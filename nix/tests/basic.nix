{
  pkgs,
  weaveLib,
}:

let
  evaluated = weaveLib.evalConfiguration {
    modules = [
      {
        weave.files.".config/test/settings.json" = {
          content = {
            hello = "world";
          };
        };
      }
    ];
  };

  actual = evaluated.config.weave.files.".config/test/settings.json";

  expected = {
    content = {
      hello = "world";
    };
  };
in
assert actual == expected;

pkgs.runCommand "weave-basic-test" { } ''
  touch $out
''
