{
  inputs = {
    teduri.url = "path:../../";
    nixpkgs.follows = "teduri/nixpkgs";
  };

  outputs =
    inputs@{ nixpkgs, ... }:
    let
      inherit (nixpkgs) lib;
      teduri = inputs.teduri.lib { inherit lib; };
    in
    {
      teduriConfigurations.test = teduri.evalConfiguration {
        modules = [ ./config.nix ];
      };
    };
}
