{
  stdenv,
  nodejs,
  pnpm_11,
  fetchPnpmDeps,
  pnpmConfigHook,
  pnpmBuildHook,
}:

let
  pnpm = pnpm_11;
in
stdenv.mkDerivation (finalAttrs: {
  pname = "teduri";
  version = "0.0.0";

  src = ./.;

  nativeBuildInputs = [
    nodejs
    pnpm
    pnpmConfigHook
    pnpmBuildHook
  ];

  pnpmDeps = fetchPnpmDeps {
    inherit (finalAttrs) pname version src;
    inherit pnpm;

    fetcherVersion = 4;
    hash = "sha256-HwO6dHiUufeU/i4fI+tOR0rp73wHEPyD27KkL+ovOoU=";
  };

  installPhase = ''
    runHook preInstall

    mkdir -p $out/bin
    cp dist/main.js $out/bin/teduri
    chmod +x $out/bin/teduri
    patchShebangs $out/bin

    runHook postInstall
  '';
})
