import React from "react";
import {EOrderStatus, IOrder, IOrderOutlet, OPTIONS_ORDER_STATUSES, ORDER_STATUSES} from "interfaces/orders";
import {useUpdate} from "@pankod/refine-core";
import {Avatar, Card, Icons, Image, Modal, Select, Space, Table, Tooltip} from "@pankod/refine-antd";
import {getDatetimeInReadableFormat, getStatus} from "../../utils";
import {OrderSteps} from "./OrderSteps";
import { Link } from "react-router-dom";
import {Switch} from "antd";

const { confirm } = Modal;

export const OutletsInOrder: React.FC<{order: IOrder | null, outletStatuses: Array<IOrderOutlet> | []}> = ({ outletStatuses, order }) => {

  const { mutate } = useUpdate<any>();

  const showConfirm = (status: string, record: IOrderOutlet) => {
    confirm({
      title: `Вы уверены, что хотите изменить статус заказа по точке продажи "${record?.outlet?.title || ''}"?`,
      icon: <Icons.ExclamationCircleOutlined />,
      content: '',
      okText: 'Да, подтверждаю',
      okType: 'primary',
      cancelText: 'Нет',
      onOk() {
        mutate({
          dataProviderName: "ordersProvider",
          resource: "orders/status",
          id: '',
          values: { orderOutletId: record.id, status: status},
        });
        //console.log('onOk');
      },
      onCancel() {
        //console.log('Cancel');
      },
    });
  };

  const showConfirmWithReward = (value: boolean, record: IOrderOutlet) => {
    confirm({
      title: value ? `Вы уверены, что хотите оформить возврат по "${record?.outlet?.title || ''}"?` : `Вы уверены, что хотите отменить возврат по "${record?.outlet?.title || ''}"?`,
      icon: <Icons.ExclamationCircleOutlined />,
      content: '',
      okText: 'Да, подтверждаю',
      okType: 'primary',
      cancelText: 'Нет',
      onOk() {
        mutate({
          dataProviderName: "ordersProvider",
          resource: "orders/status",
          id: '',
          values: { orderOutletId: record.id, withReward: value, status: record.status}
        });
        //console.log('onOk');
      },
      onCancel() {
        //console.log('Cancel');
      },
    });
  };

  return (
    <Card title={"Точки продаж в заказе"} style={{maxWidth: '100%'}} className={"order-outlets-card"}>
      <Table dataSource={outletStatuses} style={{maxWidth: '100%'}} pagination={false}>
        {/*<Table.Column*/}
        {/*  key="index"*/}
        {/*  dataIndex="index"*/}
        {/*  title={"#"}*/}
        {/*  render={(value) => value}*/}
        {/*/>*/}

        <Table.Column
          key="id"
          dataIndex="id"
          title={"ID"}
          render={(value) => value}
        />

        <Table.Column
          key="title"
          dataIndex="title"
          title={"Название"}
          render={(value, record: any) => <div>
            {/*// @ts-ignore*/}
            {/*{record?.image && (*/}
            {/*  <Avatar shape="square" className={"table-preview-image"} src={<Image src={record?.image} />} />*/}
            {/*)}*/}
            <Link to={`/outlets/show/${record.outlet?.id}`} style={{marginLeft: '12px'}}>{record.outlet?.title}</Link>
          </div>}
        />

        <Table.Column
          key="price"
          dataIndex="price"
          title={"Сумма"}
          render={(value) => value}
        />

        <Table.Column
          key="events"
          dataIndex="events"
          width={"300"}
          title={"Движение заказа"}
          render={(value, record: IOrderOutlet) => <OrderSteps progressDot={true}
                                                               order={order}
                                                               logs={record?.logs || []}
                                                               record={{
                                                                 ...record}}/>}
        />

        {/*<Table.Column*/}
        {/*  key="withReward"*/}
        {/*  dataIndex="withReward"*/}
        {/*  title={"Оформлен возврат с оплатой"}*/}
        {/*  render={(value, record: IOrderOutlet) => <Switch size={"small"} checked={value} onChange={() => {*/}
        {/*    showConfirmWithReward(!value, record)*/}
        {/*  }}/>}*/}
        {/*/>*/}

        <Table.Column
          key="events"
          fixed="right"
          dataIndex="events"
          title={"Статус"}
          render={(value, record: IOrderOutlet) => {
            let selectOption = record?.status
            return (
              <Space>
                <Select size={"small"}
                        value={record?.status}
                        onSelect={(value: string) => showConfirm(value, record)}
                          className={`status-${record?.status}`}
                        options={OPTIONS_ORDER_STATUSES}>
                </Select>

                {!record.logs?.length? (
                  <Icons.ReadOutlined style={{opacity: 0.6}}/>
                ) : (
                  <Tooltip title={record.logs?.map(item => {
                    return `${getStatus(item?.status, 'label')}: инициатор ${item?.user?.firstName} ${item?.user?.lastName} (${item?.user?.email}), ${getDatetimeInReadableFormat(item?.createdAt, null)} \n`
                  })} key={"white"}>
                    <Icons.ReadOutlined/>
                  </Tooltip>
                )}

              </Space>
            )
          }}
        />

      </Table>
    </Card>
  )
}
