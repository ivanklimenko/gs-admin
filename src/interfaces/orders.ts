import {IProduct} from "interfaces/products";
import {IOutlet} from "interfaces/outlets";
import {IUser} from "interfaces/users";
import {EDeliveryType} from "interfaces/common";

export interface IOrder {

  id: number;

  products?: Array<IProduct>;
  outlet?: Array<IOutlet>;
  customer?: IUser;
  orderOutlets?: Array<IOutlet>;
  runner?: IUser;
  note?: string;
  name?: string;
  email?: string;
  address?: string;
  deliveryStreet?: string;
  deliveryBuilding?: string;
  deliveryApartment?: string;
  delayedTime?: string;
  tableNumber?: string;
  phone?: string;
  cost?: string;

  discountCost?: string;
  discountAmount?: string;
  discountValue?: string;

  deliveryCost?: string;

  fullCost?: string;
  totalCost?: string;

  deliveryType?: EDeliveryType | null;

  //это "к какому времени приготовить", так было в v1 что дата/время
  readyTime?: string;
  //приборы
  cutlery?: number;
  readyQuickly?: boolean;

  paid?: boolean;
  paidAt?: string;
  paidtoAcquiere?: boolean;
  paidToAcquirerAt?: string;

  paidFact?: boolean;
  paidFactAt?: string;
  paidTest?: boolean;
  paidTestAt?: string;

  pointOfSale?: string;
  carNumber?: string;
  toCarStreet?: string;
  platform?: string;
  eatsId?: number;
  rate?: number;
  rateComment?: string;

  updatedAt?: string;
  createdAt?: string;

  timeTo: string;
  status?: EOrderStatus;
  statusChangedAt: string;

  isPaid: boolean;
  isPaidToAcquirer: boolean;

  events?: Array<IEvent> | [];

  comment?: string;

  orderProducts: Array<IOrderProduct>

  statuses: Array<IOrderOutlet> | null

  changelog?: Array<IOrderChangeLogItem>

  statusCode?: number
}

export interface IOrderProduct {
  basicPrice: string;
  basicPricePerUnit?: string;
  createdAt: string;
  discountAmount?: string;
  discountValue: string;
  id: number;
  note?: string;
  orderProductOptions?: Array<{id: number, optionId: number, title: string, price:string, quantity: number | null}>;
  priceWithOptions?: string;
  priceWithOptionsAndDiscount?: string;
  priceWithOptionsPerUnit?: string;
  quantity: number;
  title?: string;
  updatedAt: string;
  version?: number;
  weightOrVolume?: number | boolean | null;

  withReward?: boolean;

  product: {
    outlet: {
      market: {
        id: number,
        title: string
      }
    }
  }

}

export interface IOrderChangeLogItem {
  id: number;

  discountAmount: string
  operation: string
  orderId: number
  orderProduct: IOrderProduct
  outlet: {id: number, title: string}
  outletId: number
  priceWithOptions: string
  priceWithOptionsAndDiscount: string
  productTitle: string
  quantity: number
  updatedAt: string
  user: IUser
  userId: number
}

export interface IOrderOutlet {
  id: number;
  index: number;

  withReward?: boolean;

  status?: EOrderStatus;
  title: string;
  price: string;
  outlet: {
    title: string
  }
  logs?: [any] | null
  events?: Array<IEvent> | []
}

export interface IOrderOutletLogs {
  BaseKey: any
}

export interface IEvent {
  status: string,
  label: string,
  date?: string
}

export interface IOrderFilterVariables {
  textSearch?: string;
  eatsId?: string;
  status?: string;
}

export enum EOrderStatus {
  //AwaitingPayment = "awaiting_payment", //такие заказы не отображаются в админке
  Waiting = "waiting", // в ожидании подтверждения?
  Received = "received", // получен?
  Ready = "ready",
  Confirmed = "confirmed",
  Cooking = "cooking",
  InProcess = "in_process",
  Refused = "refused", //в документе просили отдельным полем, но пусть пока будет отсюда
  RefusedWithCornerReward = "refused_with_corner_reward", //в документе просили отдельным полем, но пусть пока будет отсюда
  IssuedCourier = "issued_courier",
  WaitingOnCounter = "waiting_on_counter",
}

export interface IOrderStatus {
  label?: string;
  label_key?: string;
  className?: string,
  color?: string,
  colorText?: string,
  value: EOrderStatus;
}

export const OPTIONS_ORDER_STATUSES: IOrderStatus[] = [
  {
    label: 'Ожидает подтверждения',
    color: '#efe41a',
    colorText: '#e7811f',
    className: 'status-waiting',
    value: EOrderStatus.Waiting
  },
  {
    label: 'Принят в работу',
    color: '#FA6D1D',
    className: 'status-confirmed',
    value: EOrderStatus.Confirmed
  },
  {
    label: 'Готовится',
    color: '#FAB11D',
    colorText: '#9b510f',
    className: 'status-cooking',
    value: EOrderStatus.Cooking
  },
  {
    label: 'Готов',
    color: '#a2ee64',
    className: 'status-ready',
    value: EOrderStatus.Ready
  },
  {
    label: 'Выдан',
    color: '#023820',
    className: 'status-received',
    value: EOrderStatus.Received
  },
  {
    label: 'Отменен',
    color: '#ee2a2a',
    className: 'status-refused',
    value: EOrderStatus.Refused
  },
  // {
  //   label: 'Отмена с оплатой корнеру',
  //   color: '#ee2a2a',
  //   className: 'status-refused',
  //   value: EOrderStatus.RefusedWithCornerReward
  // },
  {
    label: 'В пути',
    color: '#4B65FF',
    className: 'status-issued-courier',
    value: EOrderStatus.IssuedCourier
  },
  {
    label: 'Ожидает на стойке',
    color: '#d064ee',
    className: 'status-waiting-on-counter',
    value: EOrderStatus.WaitingOnCounter
  },
]

export const ORDER_STATUSES: IOrderStatus[] = [
  ...OPTIONS_ORDER_STATUSES,
  {
    label: 'В процессе',
    color: '#FAB11D',
    colorText: '#9b510f',
    className: 'status-cooking',
    value: EOrderStatus.InProcess
  },
]


export const REFUSED_ORDER_EVENTS: IEvent[] = [
  {
    label: 'Отменен',
    status: EOrderStatus.Refused
  },
  // {
  //   label: 'Отмена с оплатой корнеру',
  //   status: EOrderStatus.RefusedWithCornerReward
  // },
]

export const ORDER_EVENTS_WITH_COUNTER: IEvent[] = [
  {
    label: 'В ожидании',
    status: EOrderStatus.Waiting
  },
  {
    label: 'Подтвержден',
    status: EOrderStatus.Confirmed
  },
  {
    label: 'Готовится',
    status: EOrderStatus.Cooking
  },
  {
    label: 'Готов',
    status: EOrderStatus.Ready
  },
  {
    label: 'Ожидает на стойке',
    status: EOrderStatus.WaitingOnCounter
  },
  {
    label: 'Получен',
    status: EOrderStatus.Received
  },
]


export const ORDER_EVENTS_WITH_COURIER: IEvent[] = [
  {
    label: 'В ожидании',
    status: EOrderStatus.Waiting
  },
  {
    label: 'Подтвержден',
    status: EOrderStatus.Confirmed
  },
  {
    label: 'Готовится',
    status: EOrderStatus.Cooking
  },
  {
    label: 'Готов',
    status: EOrderStatus.Ready
  },
  {
    label: 'В пути',
    status: EOrderStatus.IssuedCourier
  },
  {
    label: 'Получен',
    status: EOrderStatus.Received
  },
]