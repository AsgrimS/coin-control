# Setup

This project uses [devenv](https://devenv.sh/getting-started/) for creating development environment.

1. Run `devenv shell` to activate your developer environment
2. Run `pnpm install` to install all dependencies
3. Run `pnpm run tauri dev` or `pnpm run tauri android dev` to start the app.

## Android emulator setup (nixos)

1. Install android studio package globally and create virtual device with it
2. Run link-emulator to symlink the .android folder to this project's root directory
3. Start the virtual device from the Device Manager GUI
4. run `pnpm run tauri android dev`
