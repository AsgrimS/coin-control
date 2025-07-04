use entity::budget;

pub trait BudgetServicePort {
    async fn get_budget(&self, id: i32) -> Option<budget::Model>;
    async fn get_all_budgets(&self) -> Vec<budget::Model>;
}
