const primitiveMap: Record<string, string> = {
  string: "string",
  bool: "boolean",
  boolean: "boolean",
  int: "number",
  long: "number",
  float: "number",
  double: "number",
  decimal: "number",
  short: "number",
  byte: "number",
  Guid: "string",
  DateTime: "string",
};

export function toCamelCase(str: string) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export function mapCSharpTypeToTs(type: string): string {
  type = type.trim();

  if (type.endsWith("?")) {
    return mapCSharpTypeToTs(type.slice(0, -1));
  }

  if (type.endsWith("[]")) {
    return `${mapCSharpTypeToTs(type.replace("[]", ""))}[]`;
  }

  const genericMatch = type.match(
    /(?:List|IEnumerable|ICollection|HashSet)<(.+)>/
  );

  if (genericMatch) {
    return `${mapCSharpTypeToTs(genericMatch[1])}[]`;
  }

  const dictMatch = type.match(/Dictionary<string,\s*(.+)>/);
  if (dictMatch) {
    return `Record<string, ${mapCSharpTypeToTs(dictMatch[1])}>`;
  }

  return primitiveMap[type] ?? type;
}
