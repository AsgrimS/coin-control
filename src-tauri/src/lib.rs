mod domain;

use entity::budget;
use migration::{Migrator, MigratorTrait};
use sea_orm::{Database, DatabaseConnection};
use specta_typescript::Typescript;
use std::sync::Arc;
use tauri::async_runtime::spawn;
use tauri::{AppHandle, Manager, State};
use tauri_plugin_log::fern::colors::ColoredLevelConfig;
use tauri_specta::{collect_commands, Builder};

type SharedDb = Arc<DatabaseConnection>;

use domain::budget::{ports::BudgetServicePort, service::BudgetService};

#[tauri::command]
#[specta::specta]
async fn get_budget_by_id(
    id: i32,
    db: State<'_, SharedDb>,
) -> Result<Option<budget::Model>, String> {
    let budget_service = BudgetService::new(db.inner().clone());
    Ok(budget_service.get_budget(id).await)
}

#[tauri::command]
#[specta::specta]
async fn get_all_budgets(db: State<'_, SharedDb>) -> Result<Vec<budget::Model>, String> {
    let budget_service = BudgetService::new(db.inner().clone());
    Ok(budget_service.get_all_budgets().await)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder =
        Builder::<tauri::Wry>::new().commands(collect_commands![get_budget_by_id, get_all_budgets]);

    #[cfg(all(debug_assertions, not(target_os = "android"), not(target_os = "ios")))]
    builder
        .export(Typescript::default(), "../src/lib/bindings.ts")
        .expect("Failed to export typescript bindings");

    tauri::Builder::default()
        .plugin(
            tauri_plugin_log::Builder::new()
                .with_colors(ColoredLevelConfig::default())
                .level_for("sqlx::query", log::LevelFilter::Warn)
                .level(log::LevelFilter::Debug)
                .build(),
        )
        .setup(|app| {
            let app_handle = app.handle().clone();
            spawn(async move {
                match setup_database_and_migrate(&app_handle).await {
                    Ok(db) => {
                        app_handle.manage::<SharedDb>(Arc::new(db));
                        log::info!("DB setup completed");
                    }
                    Err(e) => {
                        log::error!("{e}");
                        panic!("Database setup failed: {e}");
                    }
                }
            });
            Ok(())
        })
        .invoke_handler(builder.invoke_handler())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

async fn setup_database_and_migrate(app: &AppHandle) -> Result<DatabaseConnection, String> {
    let data_path = app.path().app_data_dir().unwrap();
    let connection_string = data_path.to_str().unwrap();
    let db_path = format!("sqlite://{connection_string}/coin-control.db?mode=rwc");
    log::debug!("DB connnection: {db_path}");

    let db = Database::connect(&db_path)
        .await
        .map_err(|e| format!("Failed to connect to database: {e}"))?;
    Migrator::up(&db, None)
        .await
        .map_err(|e| format!("Failed to run migrations: {e}"))?;
    Ok(db)
}
