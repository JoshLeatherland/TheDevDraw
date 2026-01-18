import {
  mapCSharpTypeToTs,
  toCamelCase,
  parseCSharpModels,
  parseCSharpEnums,
} from "../utils";

export function generateTsInterfaces(csharpCode: string): string {
  if (!csharpCode.trim()) {
    throw new Error("Please paste your C# models.");
  }

  const classes = parseCSharpModels(csharpCode);
  const enums = parseCSharpEnums(csharpCode);

  if (!classes.length) {
    throw new Error("No C# classes or records were found.");
  }

  const invalidClasses = classes.filter((c) => c.properties.length === 0);
  if (invalidClasses.length) {
    throw new Error(
      `Found ${
        invalidClasses.length
      } class(es) with no properties: ${invalidClasses
        .map((c) => c.name)
        .join(", ")}. Make sure they contain auto-properties.`
    );
  }

  const enumOutput = enums.map((e) => {
    return `export enum ${e.name} {
${e.values.map((v) => `  ${v} = "${v}",`).join("\n")}
}`;
  });

  const classOutput = classes.map((cls) => {
    const props = cls.properties.map((p) => {
      const tsType = mapCSharpTypeToTs(p.type);
      const optional = p.nullable ? "?" : "";
      const name = toCamelCase(p.name);

      return `  ${name}${optional}: ${tsType};`;
    });

    return `export interface ${cls.name} {
${props.join("\n")}
}`;
  });

  return [...enumOutput, ...classOutput].join("\n\n");
}
