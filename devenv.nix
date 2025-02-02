{ pkgs, ... }:

{
  android.enable = true;

  packages = with pkgs; [
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

    #nativeBuildInputs
    pkg-config
    gobject-introspection
    cargo
    cargo-tauri
  ];

  languages = {
    rust = {
      enable = true;
      channel = "stable";
      targets = [
      "aarch64-linux-android"
      "armv7-linux-androideabi"
      "i686-linux-android"
      "x86_64-linux-android"
      ];
    };
    javascript = {
      enable = true;
      corepack.enable = true;
    };
  };
  scripts = {
    build-emulator.exec = ''
      avdmanager create avd --force --name andorid-emulator --package 'system-images;android-32;google_apis_playstore;x86_64'
    '';
  };


  env = {
    WEBKIT_DISABLE_DMABUF_RENDERER = 1;
  };

  enterShell = ''
    export NDK_HOME=$ANDROID_HOME/ndk-bundle
    zsh
  '';
}
