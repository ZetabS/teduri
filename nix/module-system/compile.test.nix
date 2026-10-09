{ lib }:
let
  compile = import ./compile.nix { inherit lib; };
in
{
  testStructuredFile = {
    expr = compile {
      files.".config/test/settings.json" = {
        content = {
          hello = "world";
        };
        text = null;
      };
    };

    expected = {
      files = [
        {
          type = "structured";
          target = ".config/test/settings.json";
          content = {
            hello = "world";
          };
        }
      ];
    };
  };

  testTextFile = {
    expr = compile {
      files.".bashrc" = {
        content = null;
        text = ''
          export FOO=bar
        '';
      };
    };

    expected = {
      files = [
        {
          type = "text";
          target = ".bashrc";
          text = ''
            export FOO=bar
          '';
        }
      ];
    };
  };

  testThrowsWhenContentAndTextAreNull = {
    expr = compile {
      files.".config/test/settings.json" = {
        content = null;
        text = null;
      };
    };

    expectedError.type = "ThrownError";
    expectedError.msg = "Teduri file '.config/test/settings.json' must define exactly one of 'content' or 'text'";
  };

  testThrowsWhenContentAndTextAreDefined = {
    expr = compile {
      files.".config/test/settings.json" = {
        content = {
          hello = "world";
        };
        text = ''
          export FOO=bar
        '';
      };
    };

    expectedError.type = "ThrownError";
    expectedError.msg = "Teduri file '.config/test/settings.json' must define exactly one of 'content' or 'text'";
  };
}
