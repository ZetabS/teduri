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
    in
    {
      devShells.${system}.default = pkgs.mkShell {
        packages = with pkgs; [
          nodejs
          pnpm
          nix-unit
        ];
      };

      formatter.${system} = pkgs.nixfmt-tree;

      packages.${system} =
        let
          teduri = pkgs.callPackage ./nix/package.nix { };
        in
        {
          default = teduri;
          inherit teduri;
        };

      lib = import ./nix/lib;

      tests = import ./nix/tests.nix { inherit (nixpkgs) lib; };
    };
}
