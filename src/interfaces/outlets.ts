import {ILocation} from "./markets";
import {EDeliveryType} from "interfaces/common";
import {ILocalCategory} from "interfaces/tags";


export enum EOutletType {
  MARKET = 'market',
  NETWORK = 'network',
  POINT = 'point',
}

export interface IOutletType {
  label: string;
  label_key?: string;
  value: EOutletType;
}

export const OUTLETS_TYPES: IOutletType[] = [
  {
    label: 'Рынок/Локация',
    value: EOutletType.MARKET
  },
  {
    label: 'Сетевая точка',
    value: EOutletType.NETWORK,
  },
  {
    label: 'Самостоятельная точка',
    value: EOutletType.POINT
  },
]

export interface IOutlet {
  id: number;
  title: string;
  subtitle: string;
  sort: number;
  isActive: boolean;
  isEnabled: boolean;
  isIntegrationWithYandex: boolean;
  isForYandex: boolean;
  isReadyForPublishing: boolean;
  imageLogoWhite: string;
  imageLogoColor: string;
  imageBkgSite: string;
  imageBkgMobile: string;
  marketId: number;
  workHoursStart: string;
  workHoursEnd: string;
  minReadyTime?: string;
  address?: string;
  deliveryOptions?: Array<EDeliveryType>;
  deliveryOptionsExclude?: Array<EDeliveryType>;
  location?: ILocation | null,
  type?: EOutletType,
  contractId?: number,
  contracts?: Array<number>,

  categories?: Array<ILocalCategory>,

  market?: {
    id?: number;
    title?: string
  }
}

export interface IOutletFilterVariables {
  textSearch: string;
  isActive: boolean;
  locationType: string;
  market: number;
  isEnabled: boolean
}