{ lib }:
{
  evalConfiguration = import ./module-system/eval-configuration.nix { inherit lib; };
}
