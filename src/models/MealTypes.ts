export interface IMeal {
    id: string;
    chefId: string;
    allergens: string;
    description: string;
    image?: any;
    ingredients: string;
    kcal: number;
    macros: string;
    name: string;
    type: string;
}

export interface ICompositeMenu {
    entree: string;
    main: string;
    dessert: string
}


export const initialCompositeMenu: ICompositeMenu = {
    entree: "",
    main: "",
    dessert: ""
}

export const initialMeal: IMeal = {
    id: "",
    chefId: "",
    allergens: "",
    description: "",
    ingredients: "",
    kcal: 0,
    macros: "",
    name: "",
    type: "",
}
