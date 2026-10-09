{ lib, config, ... }:
let
  inherit (lib) mkOption types;
  compile = import ../utils/compile.nix { inherit lib; };
in
{
  options = {
    files = mkOption {
      type =
        with types;
        attrsOf (submodule {
          options = {
            text = mkOption { type = with types; nullOr str; };
            content = mkOption { type = with types; nullOr anything; };
          };
        });
    };
    compiled = mkOption {
      type = with types; anything;
      readOnly = true;
    };
  };
  config = {
    compiled = compile { inherit (config) files; };
  };
}
