{ pkgs, ... }:

{
  android = {
    enable = true;
    platforms.version = [ "34" ];
    emulator = {
      enable = true;
      version = "34.1.9";
    };
    buildTools.version = [ "34.0.0" ];
    platformTools.version = "34.0.5";
    cmdLineTools.version = "13.0";
  };

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
      package = pkgs.nodejs_22;
      corepack.enable = true;
    };
  };
  scripts = {
    link-emulator.exec = ''
      ln -s $HOME/.android $PWD/.android
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
