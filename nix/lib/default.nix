{ lib }:
{
  compileManifest = import ./compile-manifest.nix { inherit lib; };
  evalConfiguration = import ./eval-configuration.nix { inherit lib; };
}
