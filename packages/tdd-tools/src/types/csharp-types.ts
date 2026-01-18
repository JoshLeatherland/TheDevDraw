export type CsProperty = {
  name: string;
  type: string;
  nullable: boolean;
};

export type CsClass = {
  name: string;
  properties: CsProperty[];
};

export type CsEnum = {
  name: string;
  values: string[];
};
