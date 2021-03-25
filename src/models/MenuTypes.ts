export interface IMenu {
    id: string;
    entree: string;
    main: string;
    dessert: string;
    menuDate: string;
    tag: string;
    type?: string
}

export interface IMenuType {
  code: string;
  name: string;
  maxHourTime: number;
}




export const initialMenu: IMenu = {
    id: "",
    entree: "",
    main: "",
    dessert: "",
    menuDate: "",
    tag: "",
    type: ""
}

export interface IMenuPerDay {
  chefId: string;
  entree: string;
  dessert: string;
  id: string;
  image: string;
  main: string;
  menuDate: string;
  tag: string;
  type: string;
}

export const initialMenuPerDay: IMenuPerDay = {
  chefId: "",
  entree: "",
  dessert: "",
  id: "",
  image: "",
  main: "",
  menuDate: "",
  tag: "",
  type: ""
}
