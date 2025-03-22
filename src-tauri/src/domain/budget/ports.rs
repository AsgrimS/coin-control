pub trait BudgetServicePort {
    fn get_budget(&self) -> String;
}
