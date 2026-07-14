use uuid::Uuid;

use crate::{
    errors::{XenovraDriveError, XenovraDriveResult},
    models::access::AccessType,
    repositories::access::AccessRepository,
};

pub async fn check_access<'d>(
    repo: &AccessRepository<'d>,
    user_id: Uuid,
    storage_id: Uuid,
    access_type: &AccessType,
) -> XenovraDriveResult<()> {
    if !repo.has_access(user_id, storage_id, access_type).await? {
        Err(XenovraDriveError::DoesNotExist(format!(
            "storage with id \"{storage_id}\""
        )))
    } else {
        Ok(())
    }
}
