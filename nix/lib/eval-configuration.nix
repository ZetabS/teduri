{ lib }:
let
  teduriModules = import ../modules { inherit lib; };
  compileManifest = import ./compile-manifest.nix { inherit lib; };
in
{
  modules ? [ ],
  specialArgs ? { },
}:
let
  evaluated = lib.evalModules {
    inherit specialArgs;

    modules = [
      teduriModules.files
    ]
    ++ modules;
  };
in
evaluated
// {
  manifest = compileManifest evaluated.config;
}
