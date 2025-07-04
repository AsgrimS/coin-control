use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Replace the sample below with your own migration scripts

        manager
            .create_table(
                Table::create()
                    .table(Budget::Table)
                    .if_not_exists()
                    .col(pk_auto(Budget::Id))
                    .col(string(Budget::Title))
                    .col(float(Budget::Allowance))
                    .col(float(Budget::Balance))
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Budget::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Budget {
    Table,
    Id,
    Title,
    Allowance,
    Balance,
}
