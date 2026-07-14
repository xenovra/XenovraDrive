use crate::errors::XenovraDriveError;

#[inline]
pub fn map_not_found(e: sqlx::Error, entity_name: &str) -> XenovraDriveError {
    match e {
        sqlx::Error::RowNotFound => XenovraDriveError::DoesNotExist(format!("such {entity_name}")),
        _ => {
            tracing::error!("{e}");
            XenovraDriveError::Unknown
        }
    }
}
