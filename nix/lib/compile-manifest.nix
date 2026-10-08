{ lib }:
let
  inherit (lib) mapAttrsToList;
in
config: {
  files = mapAttrsToList (
    target: file:
    if file.content != null then
      {
        type = "structured";
        inherit target;
        inherit (file) content;
      }
    else
      {
        type = "text";
        inherit target;
        inherit (file) text;
      }
  ) config.teduri.files;
}
