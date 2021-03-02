export interface Filter {
  value: string | string[],
  field: string,
  operator: string
}

export const initialFilter: Filter = {
  value: "",
  field: "",
  operator: ""
}


