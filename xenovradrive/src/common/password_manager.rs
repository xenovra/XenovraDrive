use pwhash::bcrypt;

use crate::errors::{XenovraDriveError, XenovraDriveResult};

pub struct PasswordManager;

impl PasswordManager {
    pub fn generate(password: &str) -> XenovraDriveResult<String> {
        bcrypt::hash(password).map_err(|e| {
            tracing::error!("{e}");
            XenovraDriveError::Unknown
        })
    }

    pub fn verify(password: &str, hash: &str) -> XenovraDriveResult<()> {
        if bcrypt::verify(password, hash) {
            Ok(())
        } else {
            Err(XenovraDriveError::NotAuthenticated)
        }
    }
}
