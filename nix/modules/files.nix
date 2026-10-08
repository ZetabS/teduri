{ lib }:
let
  inherit (lib) mkOption types;
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
  };
}
