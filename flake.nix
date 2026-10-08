{
  description = "Teduri";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-26.05";
  };

  outputs =
    { nixpkgs, ... }:
    let
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};

      teduri = pkgs.callPackage ./package.nix { };
      teduriLib = import ./nix/lib.nix { inherit (nixpkgs) lib; };
    in
    {
      devShells.${system}.default = pkgs.mkShell {
        packages = with pkgs; [
          nodejs
          pnpm
        ];
      };

      packages.${system} = {
        default = teduri;
        inherit teduri;
      };

      lib = import ./nix/lib.nix;

      checks.${system} = {
        basic = import ./nix/tests/basic.nix { inherit pkgs teduriLib; };
      };
    };
}
