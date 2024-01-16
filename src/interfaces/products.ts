import {EDeliveryType} from "./common";
import {ICategory} from "interfaces/tags";

export interface IProductCategory {
  id: number,
  sort: number,
  title: string,
  products: Array<IProduct>
}

export enum EProductType {
  PORTION = 'portion',
  WEIGHT = 'weight'
}

export interface IProductType {
  label: string;
  label_key?: string;
  value: EProductType;
}

export const PRODUCT_TYPES: IProductType[] = [
  {
    label: 'Порционный',
    value: EProductType.PORTION
  },
  {
    label: 'Весовой',
    value: EProductType.WEIGHT,
  },
]


export enum EUnitType {
  G = 'g',
  ML = 'ml',
  KG = 'kg',
  L = 'l'
}

export interface IUnitType {
  label: string;
  label_key?: string;
  value: EUnitType;
}

export const UNIT_LIST: IUnitType[] = [
  {
    label: 'Граммы',
    value: EUnitType.G
  },
  {
    label: 'Миллилитры',
    value: EUnitType.ML,
  },
  // {
  //   label: 'Килограммы',
  //   value: EUnitType.KG
  // },
  // {
  //   label: 'Литры',
  //   value: EUnitType.L,
  // },
]

export interface IProduct {
  id: number;

  copy?: boolean;

  title: string;
  type?: EProductType;
  soldByWeight?: boolean;
  subtitle?: string;
  description?: string;
  slug?: string;
  sort?: number;
  price: number;
  priceInDeliveryWithSelf?: number;
  oldPrice?: number;
  priceYandex?: number;

  isActive: boolean;
  isForYandex?: boolean;
  isForSber?: boolean;
  isEnabled: boolean;

  image: string;
  weightOrVolume: string;
  minWeight: number;
  maxWeight: number;
  weightIncrement: number;

  minReadyTime?: string | null;

  categoryId: number;
  outletId: number;
  timetableId: number | undefined;
  tags: Array<ICategory>;

  deliveryOptionsOnly: EDeliveryType;
  deliveryOptionsExclude: EDeliveryType;
  optionGroups?: Array<IProductOptionGroup>;

  createdAt?: string;
  updatedAt?: string
}


export interface IProductFilterVariables {
  outletId: string;
}




export enum EOptionGroupType {
  CHECKBOX = "checkbox",
  RADIO = "radio",
  TAKEAWAY = "takeaway",
  QUANTITIVE = "quantitive",
}

export interface IOptionGroupType {
  label: string;
  label_key?: string;
  value: EOptionGroupType;
}

export const OPTION_GROUP_TYPES: IOptionGroupType[] = [
  {
    label: 'Любое количество вариантов',
    value: EOptionGroupType.CHECKBOX
  },
  {
    label: 'Один из вариантов',
    value: EOptionGroupType.RADIO,
  },
  {
    label: 'Упаковка на вынос',
    value: EOptionGroupType.TAKEAWAY
  },
  {
    label: 'Количественное',
    value: EOptionGroupType.QUANTITIVE,
  },
]



export enum EPriceType {
  BASIC = "basic",
  ADDED = "added",
}

export interface IPriceType {
  label: string;
  label_key?: string;
  value: EPriceType;
}

export const PRICE_TYPES: IPriceType[] = [
  {
    label: 'Основная',
    value: EPriceType.BASIC
  },
  {
    label: 'Дополнительная',
    value: EPriceType.ADDED,
  },
]

export interface IProductOptionGroup {
  id?: number | string;
  temp_id?: string;
  title: string;
  type?: EOptionGroupType;
  description?: string;
  priceType?: EPriceType;

  isActive: boolean;
  isEnabled: boolean;
  isRequired: boolean;

  maxAllowedOptions?: number | null;
  priceForGroup?: string | null;

  options: Array<IProductOption>

  sort?: number;
  delete?: boolean;
}

export interface IProductOption {
  id?: number | string;
  optionGroupId?: number | string;
  title?: string;
  price: string;
  priceYandex?: string;
  priceSber?: string;

  isActive?: boolean;
  isForYandex?: boolean;
  isForSber?: boolean;
  isEnabled?: boolean;

  sort?: number;
  delete?: boolean;
}
