import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Card,
  CardContent,
  Stack,
  Grid,
  TextField,
  Typography,
  Button,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Select,
  InputLabel,
  FormControl,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { CodePreview } from "tdd-components";

type Column = {
  name: string;
  type: string;
  nullable: boolean;
  default?: string;
  fkTable?: string;
  fkColumn?: string;
};

const sqlTypes = [
  "INT",
  "BIGINT",
  "VARCHAR(50)",
  "VARCHAR(100)",
  "VARCHAR(MAX)",
  "TEXT",
  "DATE",
  "DATETIME",
  "BIT",
  "DECIMAL(10,2)",
  "FLOAT",
];

function SqlTableGenerator() {
  const [tableName, setTableName] = useState("");
  const [schema, setSchema] = useState("dbo");
  const [columns, setColumns] = useState<Column[]>([
    {
      name: "",
      type: "VARCHAR(50)",
      nullable: false,
      default: "",
      fkTable: "",
      fkColumn: "",
    },
  ]);
  const [sql, setSql] = useState("");

  useEffect(() => {
    setSql("");
  }, [tableName, schema, columns]);

  const addColumn = () => {
    setColumns([
      ...columns,
      {
        name: "",
        type: "VARCHAR(50)",
        nullable: false,
        default: "",
        fkTable: "",
        fkColumn: "",
      },
    ]);
  };

  const removeColumn = (index: number) => {
    setColumns(columns.filter((_, i) => i !== index));
  };

  const updateColumn = <K extends keyof Column>(
    index: number,
    key: K,
    value: Column[K],
  ) => {
    setColumns((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [key]: value };
      return next;
    });
  };

  const formatDefaultValue = (type: string, value: string) => {
    const trimmed = value.trim();

    if (!trimmed) return "";

    if (
      trimmed.toUpperCase() === "NULL" ||
      trimmed.endsWith("()") ||
      trimmed.startsWith("'")
    ) {
      return trimmed;
    }

    const stringTypes = ["CHAR", "VARCHAR", "TEXT", "NVARCHAR", "NCHAR"];

    if (stringTypes.some((t) => type.toUpperCase().includes(t))) {
      return `'${trimmed.replace(/'/g, "''")}'`;
    }

    return trimmed;
  };

  const generateSql = () => {
    if (!tableName) return;

    const fullTableName = schema
      ? `[${schema}].[${tableName}]`
      : `[${tableName}]`;

    const pkConstraint = `CONSTRAINT PK_${tableName} PRIMARY KEY CLUSTERED ([Id] ASC)`;

    const colDefs = [
      `[Id] INT IDENTITY(1,1) NOT NULL`,
      ...columns.map((col) => {
        const parts = [
          `[${col.name}] ${col.type}`,
          col.nullable ? "NULL" : "NOT NULL",
        ];

        if (col.default) {
          const formatted = formatDefaultValue(col.type, col.default);
          parts.push(
            `CONSTRAINT DF_${tableName}_${col.name} DEFAULT ${formatted}`,
          );
        }

        return parts.join(" ");
      }),
    ];

    const fkDefs = columns
      .filter((c) => c.fkTable && c.fkColumn)
      .map(
        (c) =>
          `CONSTRAINT FK_${tableName}_${c.fkTable}_${c.name} FOREIGN KEY ([${c.name}]) REFERENCES [dbo].[${c.fkTable}]([${c.fkColumn}])`,
      );

    const createSql = `
IF NOT EXISTS (
    SELECT 1
    FROM sys.tables t
    JOIN sys.schemas s ON t.schema_id = s.schema_id
    WHERE t.name = '${tableName}'
    ${schema ? `AND s.name = '${schema}'` : ""}
)
BEGIN
    CREATE TABLE ${fullTableName}
    (
        ${colDefs.join(",\n        ")},
        ${pkConstraint}${
          fkDefs.length ? ",\n        " + fkDefs.join(",\n        ") : ""
        }
    );
END
`.trim();

    setSql(createSql);
  };

  const copy = (text: string) => navigator.clipboard.writeText(text);

  const isValid =
    tableName.trim().length > 0 &&
    columns.length > 0 &&
    columns.every(
      (c) =>
        c.name.trim().length > 0 &&
        c.type.trim().length > 0 &&
        (!c.fkTable || c.fkColumn?.trim().length),
    ) &&
    new Set(columns.map((c) => c.name.trim().toLowerCase())).size ===
      columns.length;

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container maxWidth="lg">
        <Card sx={{ borderRadius: 2 }}>
          <CardContent>
            <Stack spacing={3}>
              <Typography variant="h5" fontWeight={600}>
                SQL Table Generator
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    variant="filled"
                    label="Table Name"
                    fullWidth
                    value={tableName}
                    onChange={(e) => setTableName(e.target.value)}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    variant="filled"
                    label="Schema (optional)"
                    fullWidth
                    value={schema}
                    onChange={(e) => setSchema(e.target.value)}
                  />
                </Grid>
              </Grid>

              <Typography variant="h6">Columns</Typography>

              {columns.map((col, idx) => (
                <Grid container spacing={2} key={idx} alignItems="center">
                  <Grid size={{ xs: 12, md: 2 }}>
                    <TextField
                      variant="filled"
                      label="Name"
                      value={col.name}
                      onChange={(e) =>
                        updateColumn(idx, "name", e.target.value)
                      }
                      fullWidth
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 2 }}>
                    <FormControl variant="filled" fullWidth>
                      <InputLabel id={`type-label-${idx}`}>Type</InputLabel>
                      <Select
                        labelId={`type-label-${idx}`}
                        id={`type-${idx}`}
                        value={col.type}
                        label="Type"
                        onChange={(e) =>
                          updateColumn(idx, "type", e.target.value)
                        }
                      >
                        {sqlTypes.map((t) => (
                          <MenuItem key={t} value={t}>
                            {t}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, md: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={col.nullable}
                          onChange={(e) =>
                            updateColumn(idx, "nullable", e.target.checked)
                          }
                        />
                      }
                      label="Nullable"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 2 }}>
                    <TextField
                      variant="filled"
                      label="Default"
                      value={col.default || ""}
                      onChange={(e) =>
                        updateColumn(idx, "default", e.target.value)
                      }
                      fullWidth
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 2 }}>
                    <TextField
                      variant="filled"
                      label="FK Table"
                      value={col.fkTable || ""}
                      onChange={(e) =>
                        updateColumn(idx, "fkTable", e.target.value)
                      }
                      fullWidth
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 1 }}>
                    <TextField
                      variant="filled"
                      label="FK Column"
                      value={col.fkColumn || ""}
                      onChange={(e) =>
                        updateColumn(idx, "fkColumn", e.target.value)
                      }
                      fullWidth
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 1 }}>
                    <IconButton color="error" onClick={() => removeColumn(idx)}>
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}

              <Button variant="outlined" onClick={addColumn}>
                Add Column
              </Button>

              <Button
                variant="contained"
                onClick={generateSql}
                disabled={!isValid}
              >
                Generate SQL
              </Button>

              {sql && (
                <>
                  <CodePreview
                    title="Output"
                    value={sql}
                    language="sql"
                    height={400}
                  />
                </>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default SqlTableGenerator;
