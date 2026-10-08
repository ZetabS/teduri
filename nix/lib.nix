{ lib }:
let
  teduriModule = import ./module.nix;

  compileManifest = config: {
    files = lib.mapAttrsToList (
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
  };
in
{
  evalConfiguration =
    {
      modules ? [ ],
      specialArgs ? { },
    }:
    let
      evaluated = lib.evalModules {
        inherit specialArgs;

        modules = [
          teduriModule
        ]
        ++ modules;
      };
    in
    evaluated
    // {
      manifest = compileManifest evaluated.config;
    };
}
