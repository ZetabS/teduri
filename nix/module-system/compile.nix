{ lib }:
let
  inherit (lib) mapAttrsToList;
in
config: {
  files = mapAttrsToList (
    target: file:
    if file.content != null && file.text != null then
      throw "Teduri file '${target}' must define exactly one of 'content' or 'text'"
    else if file.content != null then
      {
        type = "structured";
        inherit target;
        inherit (file) content;
      }
    else if file.text != null then
      {
        type = "text";
        inherit target;
        inherit (file) text;
      }
    else
      throw "Teduri file '${target}' must define exactly one of 'content' or 'text'"
  ) config.files;
}
