{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    fenix.url = "github:nix-community/fenix";
    fenix.inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
      fenix,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs {
          system = system;
          config.allowUnfree = true;
          config.android_sdk.accept_license = true;
        };

        android_sdk =
          (pkgs.androidenv.composeAndroidPackages {
            platformVersions = [ "36" ];
            ndkVersions = [ "27.2.12479018" ];
            includeNDK = true;
            useGoogleAPIs = false;
            useGoogleTVAddOns = false;
            includeEmulator = false;
            includeSystemImages = false;
            includeSources = false;
          }).androidsdk;

        packages = with pkgs; [
          pnpm
          rust-analyzer
          android_sdk
          jdk
        ];

        nativeBuildInputs = with pkgs; [
          pkg-config
          gobject-introspection
          (
            with fenix.packages.${system};
            combine [
              complete.rustc
              complete.cargo
              complete.clippy
              complete.rust-src
              targets.aarch64-linux-android.latest.rust-std
              targets.armv7-linux-androideabi.latest.rust-std
              targets.i686-linux-android.latest.rust-std
              targets.x86_64-linux-android.latest.rust-std
            ]
          )
          cargo-tauri
          nodejs_22
        ];

        buildInputs = with pkgs; [
          at-spi2-atk
          atkmm
          cairo
          gdk-pixbuf
          glib
          gtk3
          harfbuzz
          librsvg
          libsoup_3
          pango
          webkitgtk_4_1
          openssl
        ];

      in
      {
        devShell = pkgs.mkShell {
          nativeBuildInputs = nativeBuildInputs;
          buildInputs = buildInputs ++ packages;

          LD_LIBRARY_PATH = "${pkgs.lib.makeLibraryPath buildInputs}:$LD_LIBRARY_PATH";

          #XDG_DATA_DIRS = "${pkgs.gsettings-desktop-schemas}/share/gsettings-schemas/${pkgs.gsettings-desktop-schemas.name}:${pkgs.gtk3}/share/gsettings-schemas/${pkgs.gtk3.name}:$XDG_DATA_DIRS";
          ANDROID_HOME = "${android_sdk}/libexec/android-sdk";
          NDK_HOME = "${android_sdk}/libexec/android-sdk/ndk-bundle";
          GRADLE_OPTS = "-Dorg.gradle.project.android.aapt2FromMavenOverride=${android_sdk}/libexec/android-sdk/build-tools/36.0.0/aapt2";
          WEBKIT_DISABLE_DMABUF_RENDERER = 1;

          shellHook = ''
            alias link-emulator='ln -s $HOME/.android $PWD/.android'
          '';
        };
      }
    );
}
