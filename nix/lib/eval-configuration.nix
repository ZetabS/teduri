{ lib }:
{
  modules ? [ ],
  specialArgs ? { },
}:
lib.evalModules {
  inherit specialArgs;
  modules = [ ../modules/files.nix ] ++ modules;
}
