export interface ILogItem {
  id: number;
  title: string;
  type?: string;
  isActive: boolean;
  sourceOfChange?: string;
  initiator?: string;
  datetime?: string;
}


export interface IILogItemFilterVariables {
  textSearch: string;
  type: string;
  //isActive: string;
  sourceOfChange: string;
}
