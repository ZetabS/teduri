{
  weave.files."tmp/.config/test/settings.json" = {
    content = {
      hello = "world";
    };
  };
  weave.files."tmp/.bashrc" = {
    text = ''
      # some shell scripts here
    '';
  };
}
