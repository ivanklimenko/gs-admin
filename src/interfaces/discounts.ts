export interface IDiscount {
  id: number;
  name: string;
  isActive?: boolean;
  isFirstOrder?: boolean;

  market: {id: number; title: string}
  outlet: {id: number; title: string}
  user: Array<{id: number; username: string}>

  startsAt: string,
  endsAt: string,
  amount: string,

  dateCartCreatedFrom: string,
  dateCartCreatedTo: string,
  minCartSum: string,
  marketId: number | null,
  outletId: number | null,

  //categoryId: null,
}


export interface IDiscountFilterVariables {
  textSearch: string;
  isActive?: boolean;
  isFirstOrder?: boolean;
  markets?: Array<string>;
  dates?: Array<any>;
  //isActive: string;
  users?: string;
}
