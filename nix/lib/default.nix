{ lib }:
{
  evalConfiguration = import ./eval-configuration.nix { inherit lib; };
}
