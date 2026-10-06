{ lib, ... }:
let
  inherit (lib) mkOption types;
in
{
  options = {
    weave = mkOption {
      type = types.submodule {
        options = {
          files = mkOption {
            type =
              with types;
              attrsOf (submodule {
                options = {
                  target = mkOption { type = types.str; };
                  content = mkOption { type = types.anything; };
                };
              });
          };
        };
      };
      description = "weave option";
    };
  };
}
