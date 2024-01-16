
export interface IContract {
  id: number;
  number: string;
  signedAt: string;
  expiresAt: string;
  person: string;
  legalAddress?: string;
  phone?: string;
  percent?: string;
  inn: string;
  psrn: string;
  checkAccount: string;
  bankIdCode: string;
  comment?: string;
  commissionOutletDelivery: string;
  commissionOutletToGoCourier: string;
  commissionOutletToGoCorner: string;
  commissionOutletToCar: string;
  commissionOutletMarketTable: string;
  commissionOutletMarketCorner: string;
  commissionMarketDelivery: string;
  commissionMarketToGoCourier: string;
  commissionMarketToGoCorner: string;
  commissionMarketToCar: string;
  commissionMarketMarketTable: string;
  commissionMarketMarketCorner: string;
}

export interface IContractFilterVariables {
  textSearch: string;
  signedAt: string;
  expiresAt: string;
  type: string;
}
