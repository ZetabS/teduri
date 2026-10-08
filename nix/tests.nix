{ lib }:
let
  inherit (lib)
    mapAttrs
    mapAttrs'
    nameValuePair
    hasSuffix
    removeSuffix
    filterAttrs
    ;
  inherit (builtins) readDir isAttrs;

  collectTests =
    dir:
    mapAttrs' (
      name: type:
      let
        path = dir + "/${name}";
      in
      if type == "directory" then
        nameValuePair name (collectTests path)
      else if type == "regular" && hasSuffix ".test.nix" name then
        nameValuePair (removeSuffix ".test.nix" name) (import path { inherit lib; })
      else
        nameValuePair name null
    ) (readDir dir);

  removeNullsRecursive =
    attrs:
    filterAttrs (_: value: value != null) (
      mapAttrs (_: value: if isAttrs value then removeNullsRecursive value else value) attrs
    );
in
removeNullsRecursive (collectTests ./.)
