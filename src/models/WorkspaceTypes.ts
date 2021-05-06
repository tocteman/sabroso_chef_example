export interface IWorkspace {
  id: string;
  ownerId: string;
  benefits: string;
  name: string;
  configurations: string;
}

export const initialWorkspace: IWorkspace = {
	id: "",
	ownerId: "",
	benefits: "",
	name: "",
	configurations: ""
}
