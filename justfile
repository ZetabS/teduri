default:
  @just --list

check: check-js check-nix

check-js:
  pnpm lint:fix
  pnpm format

check-nix:
  nix fmt
  nix-unit --flake .#tests

build:
  pnpm build

package:
  nix build

dev *args:
  pnpm dev {{args}}
