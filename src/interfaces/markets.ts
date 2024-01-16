import {IUser} from "./users";
import {EDeliveryType, IDeal, IDelivery, IPeriod} from "./common";


export interface ILocation {
  type: string;
  coordinates: Array<number>
}

export enum EMarketType {
  MARKET = 'market',
  FOOD = 'food',
  CAFE = 'cafe',
}

export interface IMarketType {
  label: string;
  label_key?: string;
  value: EMarketType;
}

export const MARKET_TYPES: IMarketType[] = [
  {
    label: 'Рынок',
    value: EMarketType.MARKET
  },
  {
    label: 'Фудкорт',
    value: EMarketType.FOOD,
  },
  {
    label: 'Кафе',
    value: EMarketType.CAFE
  },
]

export interface IMarket {
  id: number;
  cityId: number;
  title: string;
  sort: number;
  isReadyForPublishing?: boolean;
  isForYandex?: boolean;
  isActive: boolean;

  imageVector: string;
  imageRaster: string;

  workHoursStart: string;
  workHoursEnd: string;

  location: ILocation;
  address: string;

  type?: EMarketType;

  etiquetteId?: string;

  deliveryOptionsOnly: EDeliveryType;
  delivery: IMarketDelivery;

  deliveryOptions: Array<EDeliveryType>;
  toCarStreets: Array<string>;
  zones: Array<IZone>;

  deals: Array<IDeal>;

  users: Array<IUser>;
}


export interface IMarketFilterVariables {
  textSearch: string;
  type: boolean;
  isActive: boolean;
  isNetwork: boolean;
}

export interface IMarketDelivery extends IDelivery {
  streets: Array<IStreets>;
  zones: Array<IZone>;
}

export interface IStreets {
  name: string;
}

export interface IZone {
  name?: string;
  price?: number;
  polygons: Array<Array<Array<number>>>

  index?: number
}