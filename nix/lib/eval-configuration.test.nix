{ lib }:
let
  evalConfiguration = import ./eval-configuration.nix { inherit lib; };

  eval =
    modules:
    evalConfiguration {
      inherit modules;
    };

  firstFile = modules: builtins.head (eval modules).manifest.files;
in
{
  testStructuredFile = {
    expr = firstFile [
      {
        files.".config/test/settings.json" = {
          content = {
            hello = "world";
          };
        };
      }
    ];

    expected = {
      type = "structured";
      target = ".config/test/settings.json";
      content = {
        hello = "world";
      };
    };
  };

  testTextFile = {
    expr = firstFile [
      {
        files.".bashrc" = {
          text = ''
            export FOO=bar
          '';
        };
      }
    ];

    expected = {
      type = "text";
      target = ".bashrc";
      text = ''
        export FOO=bar
      '';
    };
  };

  testMultipleFiles = {
    expr =
      (eval [
        {
          files = {
            ".config/a.json".content = {
              a = 1;
            };

            ".config/b.json".content = {
              b = 2;
            };
          };
        }
      ]).manifest.files;

    expected = [
      {
        type = "structured";
        target = ".config/a.json";
        content = {
          a = 1;
        };
      }
      {
        type = "structured";
        target = ".config/b.json";
        content = {
          b = 2;
        };
      }
    ];
  };

  testModuleMerge = {
    expr = firstFile [
      {
        files.".config/test/settings.json".content = {
          editor.fontSize = 14;
        };
      }

      {
        files.".config/test/settings.json".content = {
          editor.fontFamily = "JetBrains Mono";
        };
      }
    ];

    expected = {
      type = "structured";
      target = ".config/test/settings.json";
      content = {
        editor = {
          fontSize = 14;
          fontFamily = "JetBrains Mono";
        };
      };
    };
  };

  testSpecialArgs = {
    expr =
      (evalConfiguration {
        specialArgs = {
          value = "from-special-args";
        };

        modules = [
          (
            { value, ... }:
            {
              files.".config/test/settings.json".content = {
                inherit value;
              };
            }
          )
        ];
      }).manifest.files;

    expected = [
      {
        type = "structured";
        target = ".config/test/settings.json";
        content = {
          value = "from-special-args";
        };
      }
    ];
  };
}
