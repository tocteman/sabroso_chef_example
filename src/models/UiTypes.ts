export interface ISliceRange {
  from: number;
  to: number;
}

export interface IToast {
  status: "ok"|"error"|"hidden";
  message: string
}

export const initialToast: IToast = {
  status: "hidden",
  message: ""
}
