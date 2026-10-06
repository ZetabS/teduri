{ lib }:
let
  weaveModule = import ./modules/files.nix;
in
{
  evalConfiguration =
    {
      modules ? [ ],
      specialArgs ? { },
    }:
    lib.evalModules {
      inherit specialArgs;

      modules = [
        weaveModule
      ]
      ++ modules;
    };
}
