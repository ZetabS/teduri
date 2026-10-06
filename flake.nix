{
  description = "Weave";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-26.05";
  };

  outputs =
    { nixpkgs, ... }:
    let
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};

      weave = pkgs.callPackage ./package.nix { };
      weaveLib = import ./nix/lib.nix { inherit (nixpkgs) lib; };
    in
    {
      devShells.${system}.default = pkgs.mkShell {
        packages = with pkgs; [
          nodejs
          pnpm
        ];
      };

      packages.${system} = {
        default = weave;
        inherit weave;
      };

      lib = import ./nix/lib.nix;

      checks.${system} = {
        basic = import ./nix/tests/basic.nix { inherit pkgs weaveLib; };
      };
    };
}
