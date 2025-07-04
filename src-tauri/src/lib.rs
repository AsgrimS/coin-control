mod domain;

use migration::{Migrator, MigratorTrait};
use sea_orm::{Database, DatabaseConnection};
use specta_typescript::Typescript;
use tauri::async_runtime::spawn;
use tauri::{AppHandle, Manager};
use tauri_specta::{collect_commands, Builder};

use domain::budget::{ports::BudgetServicePort, service::BudgetService};

#[tauri::command]
#[specta::specta]
fn greet(_name: &str) -> String {
    let budget_service = BudgetService::new();
    log::info!("Invoked greet");
    budget_service.get_budget()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = Builder::<tauri::Wry>::new()
        // Then register them (separated by a comma)
        .commands(collect_commands![greet,]);

    #[cfg(all(debug_assertions, not(target_os = "android"), not(target_os = "ios")))]
    builder
        .export(Typescript::default(), "../src/lib/bindings.ts")
        .expect("Failed to export typescript bindings");

    tauri::Builder::default()
        .plugin(
            tauri_plugin_log::Builder::new()
                .level(log::LevelFilter::Debug)
                .level_for("sqlx::query", log::LevelFilter::Warn)
                .build(),
        )
        // Register a `State` to be managed by Tauri
        // We need write access to it so we wrap it in a `Mutex`
        // and finally tell Tauri how to invoke them
        .invoke_handler(builder.invoke_handler())
        .setup(|app| {
            // Spawn setup as a non-blocking task so the windows can be
            // created and ran while it executes
            spawn(setup(app.handle().clone()));
            // The hook expects an Ok result
            Ok(())
        })
        // on an actual app, remove the string argument
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

// An async function that does some heavy setup task
async fn setup(app: AppHandle) -> Result<(), ()> {
    log::info!("Running DB setup");
    if let Err(e) = setup_database_and_migrate(&app).await {
        log::error!("{e}");
        panic!("Database setup failed: {e}");
    }
    log::info!("DB setup completed");
    Ok(())
}
