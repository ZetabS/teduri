{ lib }:
{
  modules ? [ ],
  specialArgs ? { },
}:
lib.evalModules {
  inherit specialArgs;
  modules = [ ./module.nix ] ++ modules;
}
