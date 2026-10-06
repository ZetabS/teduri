{ lib, ... }:
let
  inherit (lib) mkOption types;
in
{
  options = {
    weave.files = mkOption {
      type =
        with types;
        attrsOf (submodule {
          options = {
            content = mkOption { type = types.anything; };
          };
        });
    };
  };
}
