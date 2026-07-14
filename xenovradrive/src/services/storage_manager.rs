use futures::future::join_all;
use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    common::{
        channels::{DeleteFileData, DownloadFileData, UploadFileData},
        telegram_api::bot_api::TelegramBotApi,
        types::ChatId,
    },
    errors::XenovraDriveResult,
    models::file_chunks::FileChunk,
    repositories::{files::FilesRepository, storages::StoragesRepository},
    schemas::files::DownloadedChunkSchema,
};

use super::storage_workers_scheduler::StorageWorkersScheduler;

pub struct StorageManagerService<'d> {
    storages_repo: StoragesRepository<'d>,
    files_repo: FilesRepository<'d>,
    telegram_baseurl: &'d str,
    db: &'d PgPool,
    chunk_size: usize,
    rate_limit: u8,
}

impl<'d> StorageManagerService<'d> {
    pub fn new(db: &'d PgPool, telegram_baseurl: &'d str, rate_limit: u8) -> Self {
        let files_repo = FilesRepository::new(db);
        let storages_repo = StoragesRepository::new(db);
        let chunk_size = 20 * 1024 * 1024;
        Self {
            storages_repo,
            files_repo,
            chunk_size,
            telegram_baseurl,
            db,
            rate_limit,
        }
    }

    pub async fn upload(&self, data: UploadFileData) -> XenovraDriveResult<()> {
        // 1. getting storage
        let storage = self.storages_repo.get_by_file_id(data.file_id).await?;

        // 2. dividing file into chunks
        let bytes_chunks = data.file_data.chunks(self.chunk_size);

        // 3. uploading by chunks
        let futures_: Vec<_> = bytes_chunks
            .enumerate()
            .map(|(position, bytes_chunk)| {
                self.upload_chunk(
                    storage.id,
                    storage.chat_id,
                    data.file_id,
                    position,
                    bytes_chunk,
                )
            })
            .collect();

        let chunks = join_all(futures_)
            .await
            .into_iter()
            .collect::<XenovraDriveResult<Vec<_>>>()?;

        // 4. saving chunks to db
        self.files_repo.create_chunks_batch(chunks).await
    }

    async fn upload_chunk(
        &self,
        storage_id: Uuid,
        chat_id: ChatId,
        file_id: Uuid,
        position: usize,
        bytes_chunk: &[u8],
    ) -> XenovraDriveResult<FileChunk> {
        let scheduler = StorageWorkersScheduler::new(self.db, self.rate_limit);

        let document = TelegramBotApi::new(self.telegram_baseurl, scheduler)
            .upload(bytes_chunk, chat_id, storage_id)
            .await?;

        tracing::debug!(
            "[TELEGRAM API] uploaded chunk with file_id \"{}\" and position \"{}\"",
            document.file_id,
            position
        );

        let chunk = FileChunk::new(
            Uuid::new_v4(),
            file_id,
            document.file_id,
            document.message_id,
            position as i16,
        );
        Ok(chunk)
    }

    pub async fn download(&self, data: DownloadFileData) -> XenovraDriveResult<Vec<u8>> {
        // 1. getting chunks
        let chunks = self.files_repo.list_chunks_of_file(data.file_id).await?;

        // 2. downloading by chunks
        let futures_: Vec<_> = chunks
            .into_iter()
            .map(|chunk| self.download_chunk(data.storage_id, chunk))
            .collect();
        let mut chunks = join_all(futures_)
            .await
            .into_iter()
            .collect::<XenovraDriveResult<Vec<_>>>()?;

        // 3. sorting in a right positions and merging into single bytes slice
        chunks.sort_by_key(|chunk| chunk.position);
        let file = chunks.into_iter().flat_map(|chunk| chunk.data).collect();
        Ok(file)
    }

    async fn download_chunk(
        &self,
        storage_id: Uuid,
        chunk: FileChunk,
    ) -> XenovraDriveResult<DownloadedChunkSchema> {
        let scheduler = StorageWorkersScheduler::new(self.db, self.rate_limit);

        let file = TelegramBotApi::new(self.telegram_baseurl, scheduler)
            .download(&chunk.telegram_file_id, storage_id)
            .await
            .map(|data| DownloadedChunkSchema::new(chunk.position, data))?;

        tracing::debug!(
            "[TELEGRAM API] downloaded chunk with file_id \"{}\" and position \"{}\"",
            chunk.file_id,
            chunk.position
        );

        Ok(file)
    }

    pub async fn delete(&self, data: DeleteFileData) -> XenovraDriveResult<()> {
        // 1. resolve which chat these messages live in
        let storage = self.storages_repo.get_by_id(data.storage_id).await?;

        // 2. delete every chunk message from Telegram concurrently. Best-effort:
        //    an individual failure is logged but never blocks removing the file.
        let futures_: Vec<_> = data
            .message_ids
            .into_iter()
            .map(|message_id| self.delete_message(data.storage_id, storage.chat_id, message_id))
            .collect();

        for result in join_all(futures_).await {
            if let Err(e) = result {
                tracing::error!("[TELEGRAM API] failed to delete chunk message: {e}");
            }
        }

        Ok(())
    }

    async fn delete_message(
        &self,
        storage_id: Uuid,
        chat_id: ChatId,
        message_id: i64,
    ) -> XenovraDriveResult<()> {
        let scheduler = StorageWorkersScheduler::new(self.db, self.rate_limit);

        TelegramBotApi::new(self.telegram_baseurl, scheduler)
            .delete_message(message_id, chat_id, storage_id)
            .await?;

        tracing::debug!("[TELEGRAM API] deleted chunk message \"{}\"", message_id);

        Ok(())
    }
}
