{
  pkgs,
  teduriLib,
}:

let
  evaluated = teduriLib.evalConfiguration {
    modules = [
      {
        teduri.files.".config/test/settings.json" = {
          content = {
            hello = "world";
          };
        };
      }
    ];
  };

  actual = builtins.head evaluated.manifest.files;

  expected = {
    type = "structured";
    target = ".config/test/settings.json";
    content = {
      hello = "world";
    };
  };
in
assert actual == expected;

pkgs.runCommand "teduri-basic-test" { } ''
  touch $out
''
