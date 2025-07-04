use entity::budget;
use sea_orm::{DatabaseConnection, EntityTrait};
use std::sync::Arc;

use crate::domain::budget::ports::BudgetServicePort;

pub struct BudgetService {
    db: Arc<DatabaseConnection>,
}

impl BudgetService {
    pub fn new(db: Arc<DatabaseConnection>) -> Self {
        Self { db }
    }
}

impl BudgetServicePort for BudgetService {
    async fn get_budget(&self, id: i32) -> Option<budget::Model> {
        budget::Entity::find_by_id(id)
            .one(self.db.as_ref())
            .await
            .ok()?
    }
}
