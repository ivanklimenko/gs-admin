export enum EAppResources {
  MARKETS = 'markets',
  NETWORKS = 'networks',
  USERS = 'users',
  OUTLETS = 'outlets',
  PRODUCTS = 'products',
  ORDERS = 'orders',
  CONTRACTS = 'contracts',
  TIMETABLES = 'timetables',
  DISCOUNTS = 'discounts',
  DIRECTORIES = 'directories',
  OUTLET_TAGS = 'outletTags',
  PRODUCT_TAGS = 'productTags',
  PAGES = 'pages',
}

export enum EAppResourcesForCorner {
  MARKETS = 'markets',
  NETWORKS = 'networks',
  OUTLETS = 'outlets',
  PRODUCTS = 'products',
  DIRECTORIES = 'directories',
}

export enum EPageActions {
  LIST = 'list',
  SHOW = 'show',
  EDIT = 'edit',
  CREATE = 'create',
  CLONE = 'clone',
  DELETE = 'delete'
}

export enum EPageActionsForAdmin {
  CREATE = 'create',
  DELETE = 'delete'
}

export interface IPeriod<T> {
  start: T;
  end: T;
}

export interface ICoordinate {
  lat: string;
  lng: string;
}

export interface IDeal {
  name: string;
  phone: string;
  period: IPeriod<Date>;
  inn: string;
  bic: string;
  rs: string;
  sale_margin: number
}

export enum EDeliveryType {
  IN_MARKET_TO_TABLE = 'MarketTable',
  IN_MARKET_TO_CORNER = 'MarketCorner',
  WITH_MYSELF_TO_RUNNER = 'ToGoCourier',
  WITH_MYSELF_TO_CORNER = 'ToGoCorner',
  TO_CAR = 'ToCar',
  TO_PLACE = 'Delivery',
  YANDEX = 'YandexDelivery'
}

export interface IDelivery {
  type: EDeliveryType;
}

export interface IDeliveryType {
  label: string;
  label_key?: string;
  value: EDeliveryType;
}

export const AllDeliveryTypes = [
  EDeliveryType.IN_MARKET_TO_TABLE,
  EDeliveryType.IN_MARKET_TO_CORNER,
  EDeliveryType.WITH_MYSELF_TO_RUNNER,
  EDeliveryType.WITH_MYSELF_TO_CORNER,
  EDeliveryType.TO_CAR,
  EDeliveryType.TO_PLACE,
  //EDeliveryType.YANDEX,
]

export const DeliveryCourierType = [EDeliveryType.WITH_MYSELF_TO_RUNNER, EDeliveryType.TO_CAR, EDeliveryType.TO_PLACE]

export const DELIVERY_TYPES: IDeliveryType[] = [
  {
    label: 'На рынке (к столу)',
    value: EDeliveryType.IN_MARKET_TO_TABLE
  },
  {
    label: 'На рынке (за стойкой корнера)',
    value: EDeliveryType.IN_MARKET_TO_CORNER
  },
  {
    label: 'С собой (у раннера)',
    value: EDeliveryType.WITH_MYSELF_TO_RUNNER,
  },
  {
    label: 'С собой (у стойки корнера)',
    value: EDeliveryType.WITH_MYSELF_TO_CORNER,
  },
  {
    label: 'К машине',
    value: EDeliveryType.TO_CAR
  },
  {
    label: 'Доставка',
    value: EDeliveryType.TO_PLACE
  },
  // {
  //   label: 'Яндекс',
  //   value: EDeliveryType.YANDEX
  // },
]

