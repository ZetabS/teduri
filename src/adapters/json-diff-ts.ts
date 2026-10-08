import { diff } from "json-diff-ts";

import type { JsonValue } from "../types/json-value.js";

export function diffStructured(expected: JsonValue, actual: JsonValue) {
  const result = diff(expected, actual);

  return result;
}
