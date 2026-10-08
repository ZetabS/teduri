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

  actual = evaluated.config.teduri.files.".config/test/settings.json";

  expected = {
    content = {
      hello = "world";
    };
  };
in
assert actual == expected;

pkgs.runCommand "teduri-basic-test" { } ''
  touch $out
''
