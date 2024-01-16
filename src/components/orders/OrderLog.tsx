import React, {useEffect, useState} from "react";
import {IOrder, IOrderChangeLogItem} from "interfaces/orders";
import {useList} from "@pankod/refine-core";
import {Card, Collapse, Table} from "@pankod/refine-antd";
import {getDatetimeInReadableFormat} from "../../utils";


export const OrderLog: React.FC<{order: IOrder | null}> = ({ order }) => {

  const [changeLogs, setChangeLogs] = useState<Array<IOrderChangeLogItem>>([]);

  // TODO: получать при раскрытии блока
  const outletChangeLogs = useList<IOrderChangeLogItem>({
    resource: "orders/products/changeLog",
    dataProviderName: "ordersProvider",
    config: {
      filters: [{
        field: "orderId",
        operator: "eq",
        value: order?.id,
      }]
    }
  });

  useEffect(() => {
    if (outletChangeLogs?.data?.data) {
      setChangeLogs(outletChangeLogs?.data?.data)
    }
  }, [outletChangeLogs])

  return (
    <Card title={null} style={{maxWidth: '100%'}} className={"order-outlets-card card-with-no-padding"}>
      <Collapse ghost className={"width-100-pr"}>
        <Collapse.Panel header="Список логов выбранного заказа" key="1">
          <Table dataSource={changeLogs} style={{maxWidth: '100%'}} pagination={false}>
            <Table.Column
              key="id"
              dataIndex="id"
              title={"ID"}
              render={(value) => value}
            />

            <Table.Column
              key="orderProduct"
              dataIndex={["orderProduct", "title"]}
              title={"Название"}
              render={(value, record: any) => <div>
                {/*{value?.image && (*/}
                {/*  <Avatar shape="square" className={"table-preview-image"} src={<Image src={record?.image} />} />*/}
                {/*)}*/}
                <span style={{marginLeft: '12px'}}>{value}</span>
              </div>}
            />

            <Table.Column
              key="outlet"
              dataIndex="outlet"
              title={"Точка продажи"}
              render={(value) => value.title}
            />

            <Table.Column
              key="orderProductOptions"
              dataIndex={["orderProduct", "options"]}
              title={"Опции"}
              render={(value) => value.map((v: any) => (
                <div>
                  <span style={{marginRight: '4px'}}>{v.title}:</span>
                  <span>{v.title} +{v.price}р.</span>
                </div>
              ))}
            />

            <Table.Column
              key="operation"
              dataIndex="operation"
              title={"Действие"}
              render={(value) => value}
            />

            <Table.Column
              key="user"
              dataIndex="user"
              title={"Инициатор"}
              render={(value) => `${value.firstName} ${value.lastName}`}
            />

            <Table.Column
              key="quantity"
              dataIndex="quantity"
              title={"Количество"}
              render={(value) => value}
            />

            <Table.Column
              key="priceWithOptions"
              dataIndex="priceWithOptions"
              title={"Цена с опциями, р."}
              render={(value) => value}
            />

            <Table.Column
              key="discountAmount"
              dataIndex="discountAmount"
              title={"Скидка, %"}
              render={(value) => value * 100}
            />

            <Table.Column
              key="priceWithOptionsAndDiscount"
              dataIndex="priceWithOptionsAndDiscount"
              title={"Итог, р."}
              render={(value) => value}
            />

            <Table.Column
              key="createdAt"
              dataIndex="createdAt"
              title={"Создано"}
              render={(value) => getDatetimeInReadableFormat(value) || '--'}
            />

            <Table.Column
              key="updatedAt"
              dataIndex="updatedAt"
              title={"Изменено"}
              render={(value) => getDatetimeInReadableFormat(value) || '--'}
            />

          </Table>
        </Collapse.Panel>
      </Collapse>
    </Card>
  )
}
