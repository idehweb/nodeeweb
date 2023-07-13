export type AdminViewSchema = {
  name: string;
  content: ViewContent;
};

export type ViewContent = {
  list: List;
  create: Create;
  edit?: Edit;
};

export type Create = {
  fields: CreateField[];
};

export type CreateField = {
  name: string;
  type: string;
  kind?: string;
  size?: Size;
  label?: string;
  entity?: string;
  limit?: number;
  options?: Option[];
  child?: Child[];
  initialChild?: InitialChild;
  optionName?: string;
  optionValue?: string;
  defaultValue?: any;
};

export type Child = {
  name: string;
  type: string;
  entity?: string;
  limit?: number;
  size?: Size;
  optionName?: string;
  optionValue?: string;
  defaultValue?: null;
  kind?: string;
};

export type Size = {
  lg: number;
  sm: number;
};

export type InitialChild = {
  attribute: string;
  values: any[];
};

export type Option = {
  label: string;
  value: string;
  name: string;
};

export type Edit = {
  fields: EditField[];
};

export type EditField = CreateField & {
  name: string;
  type: string;
  disabled?: boolean;
  kind?: string;
  size?: Size;
  label?: string;
  entity?: string;
  limit?: number;
  options?: Option[];
  child?: Child[];
  initialChild?: InitialChild;
  optionName?: string;
};

export type List = {
  header: Header[];
  url?: string;
  pageBuilder?: boolean;
};

export type Header = {
  name: string;
  type: string;
  edit?: boolean;
  delete?: boolean;
  pageBuilder?: boolean;
  reference?: string;
  keys?: string[];
};
