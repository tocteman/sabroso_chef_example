export interface IGroup {
    id: string;
    workspaceId: string;
    ownerId: string;
    benefits: string;
    configurations: string;
    members: any[];
    name: string;
}

export interface IParsedGroup {
  id: string;
  name: string;
  workspaceId: string;
  serviceType: any; 
}

interface IServiceType {
  name: string;
  price: number;
  maxOrderTime: string;
}

export interface IGroupsByService {
  serviceName: string;
  groupsIds: string[]
}

export interface IMappedGroup {
  serviceName: string;
  id: string;
}
