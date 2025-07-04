mod domain;

use sea_orm::{Database, DatabaseConnection};
use specta_typescript::Typescript;
use std::sync::Mutex;
use tauri::async_runtime::spawn;
use tauri::{AppHandle, Manager, State};
use tauri_specta::{collect_commands, Builder};

use domain::budget::{ports::BudgetServicePort, service::BudgetService};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
#[specta::specta]
fn greet(_name: &str) -> String {
    let budget_service = BudgetService::new();
    budget_service.get_budget()
}

// Create a struct we'll use to track the completion of
// setup related tasks
struct SetupState {
    backend_task: bool,
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
        // Register a `State` to be managed by Tauri
        // We need write access to it so we wrap it in a `Mutex`
        .manage(Mutex::new(SetupState {
            backend_task: false,
        }))
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

async fn set_complete(
    app: AppHandle,
    state: State<'_, Mutex<SetupState>>,
    task: String,
) -> Result<(), ()> {
    // Lock the state without write access
    let mut state_lock = state.lock().unwrap();
    match task.as_str() {
        "backend" => state_lock.backend_task = true,
        _ => panic!("invalid task completed!"),
    }
    // Check if both tasks are completed
    if state_lock.backend_task {
        // Setup is complete, we can close the splashscreen
        // and unhide the main window!
        let splash_window = app.get_webview_window("splashscreen").unwrap();
        let main_window = app.get_webview_window("main").unwrap();
        splash_window.close().unwrap();
        main_window.show().unwrap();
    }
    Ok(())
}

// An async function that does some heavy setup task
async fn setup(app: AppHandle) -> Result<(), ()> {
    println!("Performing really heavy backend setup task...");
    let db: DatabaseConnection = Database::connect("sqlite::memory:").await.map_err(|_| ())?;

    println!("Backend setup task completed!");
    // Set the backend task as being completed
    // Commands can be ran as regular functions as long as you take
    // care of the input arguments yourself
    set_complete(
        app.clone(),
        app.state::<Mutex<SetupState>>(),
        "backend".to_string(),
    )
    .await?;
    Ok(())
}
