{
  pkgs,
  weaveLib,
}:

let
  evaluated = weaveLib.evalConfiguration {
    modules = [
      {
        weave.files.test = {
          target = ".config/test/settings.json";

          content = {
            hello = "world";
          };
        };
      }
    ];
  };

  actual = evaluated.config.weave.files.test;

  expected = {
    target = ".config/test/settings.json";

    content = {
      hello = "world";
    };
  };
in
assert actual == expected;

pkgs.runCommand "weave-basic-test" { } ''
  touch $out
''
