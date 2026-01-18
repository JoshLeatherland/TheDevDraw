import { CsClass, CsEnum } from "../types";

export function parseCSharpModels(input: string): CsClass[] {
  const classRegex =
    /(?:public|private|protected|internal)?\s*(?:sealed|abstract|partial)?\s*(?:class|record)\s+(\w+)[^{]*\{([\s\S]*?)\n\}/g;

  const propertyRegex =
    /(?:\[[^\]]+\]\s*)*(?:public|private|protected|internal)?\s*(?:virtual\s+|override\s+)?([\w<>\[\]?]+)\s+(\w+)\s*\{[\s\S]*?get;[\s\S]*?set;[\s\S]*?\}\s*(?:=\s*[^;]+)?;/g;

  const classes: CsClass[] = [];

  let classMatch;
  while ((classMatch = classRegex.exec(input)) !== null) {
    const [, className, body] = classMatch;

    const properties = [];
    let propMatch;

    while ((propMatch = propertyRegex.exec(body)) !== null) {
      const [, type, propName] = propMatch;

      properties.push({
        name: propName,
        type,
        nullable: type.endsWith("?"),
      });
    }

    classes.push({ name: className, properties });
  }

  return classes;
}

export function parseCSharpEnums(input: string): CsEnum[] {
  const enumRegex =
    /(?:public|internal|private|protected)?\s*enum\s+(\w+)\s*\{([\s\S]*?)\}/g;

  const enums: CsEnum[] = [];

  let match;
  while ((match = enumRegex.exec(input)) !== null) {
    const [, name, body] = match;

    const values = body
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean)
      .map((v) => v.replace(/=.*/, "").trim());

    enums.push({ name, values });
  }

  return enums;
}
