export interface IOrder {
    id: string;
    groupId: string;
    memberId: string;
    details: any;
    orderDate: string;
    subtotal: string;
    total: string;
    status?: string;
    amount?: any;
    workspaceId: string;
}

export interface IGrouppedObj {
  [key:string]: IGroupAndQuantity[]
}

export interface IOrderDetails {
  id: string;
  details: string;
  tag?: string;
  quantity: number;
  total: string;
  type: string;
}

export interface IParsedOrderDetails {
  meal: string;
  quantity: number;
  tag?: string
}

export interface IReducedMenu {
  tag: string;
  type?: string;
  quantity: number;
  groupName: string;
}

export interface IGroupAndQuantity {
  groupName: string;
  quantity: number;
}

export interface ITagAndQuantity {
  tag: string;
  quantities: number;
}

