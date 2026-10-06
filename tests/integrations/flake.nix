{
  inputs = {
    weave.url = "path:../../";
    nixpkgs.follows = "weave/nixpkgs";
  };

  outputs =
    inputs@{ nixpkgs, ... }:
    let
      inherit (nixpkgs) lib;
      weave = inputs.weave.lib { inherit lib; };
    in
    {
      weaveConfigurations.test = weave.evalConfiguration {
        modules = [ ./config.nix ];
      };
    };
}
