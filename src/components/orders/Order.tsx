import React from "react";
import {useTranslate, useUpdate} from "@pankod/refine-core";
import {
  BooleanField,
  Card,
  Col,
  Icons,
  Rate,
  Row,
  Tag,
  Tooltip,
  useSelect
} from "@pankod/refine-antd";

import {IUser} from "interfaces/users";
import {
  IOrder
} from "interfaces/orders";
import {DELIVERY_TYPES, EDeliveryType} from "interfaces/common";
import {OrderState} from "./OrderState";
import {getDatetimeInReadableFormat, getStatus} from "../../utils";
import { OrderLog } from "./OrderLog";
import {OutletsInOrder} from "./OutletsInOrder";
import { OrderSteps } from "./OrderSteps";
import {CustomBooleanField} from "../customBooleanField";


type FormOrderProps = {
  order: IOrder | null
  onRefetchOrder: () => void
};

export const Order: React.FC<FormOrderProps> = ({order, onRefetchOrder}) => {
  const t = useTranslate()


  return (
    <>
      <Row gutter={[24, 12]} className={"row-with-margin-12"}>

        <Col xl={24} md={24} xs={24}>
          <Card title={"Общее движение заказа"}
                extra={<><Tag style={{marginRight: 0, color: getStatus(order?.status || '', 'colorText') || '#fff'}}
                              color={getStatus(order?.status || '', 'color')}>
              {getStatus(order?.status || '', 'label')}</Tag>
            {order?.statusChangedAt && (
              <Tooltip title={`Дата изменения: ${getDatetimeInReadableFormat(order?.statusChangedAt)}`}>
                <Icons.QuestionCircleOutlined style={{marginLeft: 6}} />
              </Tooltip>
            )}
          </>
          }>
            <OrderSteps order={order} logs={[]} record={order}/>
          </Card>
        </Col>

      </Row>

      <Row gutter={[24, 12]} className={"row-with-margin-12"}>
        <Col xl={16} md={12} xs={24}>
          <Card title="Стоимость" className={"order-info-card"}>
            <Row gutter={[0, 16]}>
              <Col span={24}>
                <Row gutter={[16, 16]}>
                  <Col xl={8} md={24} sm={8} xs={24} className={"order-info"}>
                    <span className={"order-info-label"}>Полная цена:</span>
                    <span className={"order-info-value"}>{order?.cost || '--'}</span>
                  </Col>

                  <Col xl={8} md={24} sm={8} xs={24}  className={"order-info"}>
                    <span className={"order-info-label"}>Скидка:</span>
                    <span className={"order-info-value"}>{order?.discountValue || '--'}</span>
                  </Col>

                  <Col xl={8} md={24} sm={8} xs={24}  className={"order-info"}>
                    <span className={"order-info-label"}>Доставка:</span>
                    <span className={"order-info-value"}>{order?.deliveryCost || '--'}</span>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col xl={24} md={24} sm={24} xs={24}  className={"order-info"}>
                    <span className={"order-info-label order-info-finally"}>Итоговая цена:</span>
                    <span className={"order-info-value"}>{order?.totalCost || '--'}</span>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xl={8} md={12} xs={24}>
          <Card title={"Оплата"} className={"order-info-card"}>
            <Row gutter={[0, 16]}>
              <Col xl={24} md={24} sm={24} xs={24} className={"order-info"}>
                <span className={"order-info-label"}>Статус оплаты:</span>
                <span className={"order-info-value"}>
                  <CustomBooleanField value={!!order?.paidFact}/>
                  <span className={"order-indo-additional"}>(оплачено {order?.paidFactAt})</span>
                </span>
              </Col>

              <Col xl={24} md={24} sm={24} xs={24}  className={"order-info"}>
                <span className={"order-info-label"}>Тестовый платеж:</span>
                <span className={"order-info-value"}><CustomBooleanField value={!!order?.paidTest}/></span>
              </Col>
            </Row>
          </Card>
        </Col>

      </Row>
      <Row gutter={[24, 12]} className={"row-with-margin-12"}>
        <Col xl={8} md={12} xs={24}>
          <Card title={"Параметры доставки"} className={"order-info-card"}>
            <Row gutter={[0, 16]}>
              {order?.deliveryType === EDeliveryType.YANDEX && (
                <>
                  <Col xl={24} md={24} sm={24} xs={24} className={"order-info"}>
                    <span className={"order-info-label"}>Номер заказа в Яндекс:</span>
                    <span className={"order-info-value"}>{order?.eatsId || '--'}</span>
                  </Col>
                  <Col xl={24} md={24} sm={24} xs={24} className={"order-info"}>
                    <span className={"order-info-label"}>Адрес:</span>
                    <span className={"order-info-value"}>{order?.address || '--'}</span>
                  </Col>
                </>
              )}


              {order?.deliveryType === EDeliveryType.TO_CAR && (
                <>
                  <Col xl={24} md={24} sm={24} xs={24} className={"order-info"}>
                    <span className={"order-info-label"}>Номер машины:</span>
                    <span className={"order-info-value"}>{order?.carNumber || '--'}</span>
                  </Col>

                  <Col xl={24} md={24} sm={24} xs={24} className={"order-info"}>
                    <span className={"order-info-label"}>Улица:</span>
                    <span className={"order-info-value"}>{order?.toCarStreet || '--'}</span>
                  </Col>
                </>
              )}

              {order?.deliveryType === EDeliveryType.TO_PLACE && (
                <>
                  <Col xl={24} md={24} sm={24} xs={24} className={"order-info"}>
                    <span className={"order-info-label"}>Адрес доставки:</span>
                    <span className={"order-info-value"}>{order?.address || `${order?.deliveryStreet || '-улица-'}, № ${order?.deliveryBuilding || '-дом-'}, ${order?.deliveryApartment || '-квартира-'}` || '--'}</span>
                  </Col>
                </>
              )}

              {order?.deliveryType === EDeliveryType.IN_MARKET_TO_TABLE && (
                <>
                  <Col xl={24} md={24} sm={24} xs={24} className={"order-info"}>
                    <span className={"order-info-label"}>Номер столика:</span>
                    <span className={"order-info-value"}>{order?.tableNumber || '--'}</span>
                  </Col>
                </>
              )}

              <Col xl={24} md={24} sm={24} xs={24} className={"order-info"}>
                <span className={"order-info-label"}>Комментарий:</span>
                <span className={"order-info-value"}>{order?.note || '--'}</span>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xl={16} md={12} xs={24}>
          <Card title="Параметры выдачи" className={"order-info-card"}>
            <Row gutter={[0, 16]}>
              <Col xl={24} md={24} sm={24} xs={24} className={"order-info"}>
                <span className={"order-info-label"}>Тип выдачи:</span>
                <span className={"order-info-value"}>
                  {DELIVERY_TYPES.find(t => t.value === order?.deliveryType)?.label || (order?.deliveryType === EDeliveryType.YANDEX ? 'Яндекс Доставка' : '--')}
                </span>
              </Col>

              <Col xl={24} md={24} sm={24} xs={24} className={"order-info"}>
                <span className={"order-info-label"}>К которому часу приготовить:</span>
                <span className={"order-info-value"}>{order?.delayedTime || '--'}</span>
              </Col>

              <Col xl={24} md={24} sm={24} xs={24}  className={"order-info"}>
                <span className={"order-info-label"}>Как можно скорее:</span>
                <span className={"order-info-value"}><CustomBooleanField value={!order?.delayedTime}/></span>
              </Col>

              <Col xl={24} md={24} sm={24} xs={24} className={"order-info"}>
                <span className={"order-info-label"}>Количество приборов:</span>
                <span className={"order-info-value"}>{order?.cutlery || '--'}</span>
              </Col>
            </Row>
          </Card>
        </Col>

      </Row>
      <Row gutter={[24, 12]} className={"row-with-margin-12"}>
        <Col xl={16} md={12} xs={24}>
          <Card title={"Параметры клиента"} className={"order-info-card"}>
            <Row gutter={[0, 16]}>

              <Col xl={12} md={24} sm={12} xs={24}  className={"order-info"}>
                <span className={"order-info-label"}>Имя:</span>
                <span className={"order-info-value"}>{order?.name || '--'}</span>
              </Col>

              <Col xl={12} md={24} sm={12} xs={24}  className={"order-info"}>
                <span className={"order-info-label"}>Телефон:</span>
                <span className={"order-info-value"}>{order?.phone || '--'}</span>
              </Col>

              <Col xl={12} md={24} sm={8} xs={24}  className={"order-info"}>
                <span className={"order-info-label"}>Email:</span>
                <span className={"order-info-value"}>{order?.email || '--'}</span>
              </Col>

              <Col xl={12} md={24} sm={12} xs={24}  className={"order-info"}>
                <span className={"order-info-label"}>Источник заказа:</span>
                <span className={"order-info-value"}>{order?.pointOfSale || '--'}</span>
              </Col>

              <Col xl={12} md={24} sm={12} xs={24}  className={"order-info"}>
                <span className={"order-info-label"}>Платформа:</span>
                <span className={"order-info-value"}>{order?.platform || '--'}</span>
              </Col>

            </Row>
          </Card>
        </Col>

        <Col xl={8} md={12} xs={24}>
          <Card title={"Оценка"} className={"order-info-card"} extra={<Rate style={{fontSize: '14px'}} disabled value={order?.rate} />}>
            <Row gutter={[16, 16]}>
              <Col xl={24} md={24} sm={24} xs={24}  className={"order-info"}>
                <span className={"order-info-label"}>Комментарий:</span>
                <span className={"order-info-value"}>{order?.rateComment || '--'}</span>
              </Col>
            </Row>
          </Card>
        </Col>

      </Row>

      <Row gutter={[24, 12]} className={"row-with-margin-12"}>
        <Col xl={24} md={24} xs={24} className={"width-100-pr"}>
          <OutletsInOrder order={order} outletStatuses={order?.statuses || []}/>
        </Col>
      </Row>

      <Row gutter={[24, 12]} className={"row-with-margin-12"}>
        <Col xl={24} md={24} xs={24} className={"width-100-pr"}>
          <OrderState
            order={order}
            products={order?.orderProducts || []}
            outlets={order?.statuses || []} onRefetchOrder={onRefetchOrder}/>
        </Col>
      </Row>

      <Row gutter={[24, 12]} className={"row-with-margin-12"}>
        <Col xl={24} md={24} xs={24} className={"width-100-pr"}>
          <OrderLog order={order}/>
        </Col>
      </Row>
    </>
  );
};
