use crate::domain::budget::ports::BudgetServicePort;

pub struct BudgetService;

impl BudgetService {
    pub fn new() -> Self {
        Self
    }
}

impl BudgetServicePort for BudgetService {
    fn get_budget(&self) -> String {
        "Hello from budget service".to_string()
    }
}
