import {
  useTranslate,
  IResourceComponentsProps,
  HttpError, useDelete, CrudFilters
} from "@pankod/refine-core";

import {
  List,
  Table,
  useTable,
  BooleanField,
  Form,
  Button,
  Input,
  Dropdown,
  Icons,
  FormProps,
  Row,
  Col,
  Card, Tag,
} from "@pankod/refine-antd";
import {Link} from "react-router-dom";
import React, {useState} from "react";
import "moment/locale/ru";

import {TableMenu} from "components/tableMenu/tableMenu";
import {IOrder, IOrderFilterVariables} from "interfaces/orders";
import {getDatetimeInReadableFormat, getStatus} from "utils";
import {DELIVERY_TYPES, EAppResources, EDeliveryType, EPageActions} from "interfaces/common";
import {CustomBooleanField} from "components/customBooleanField";
import {AccessWrapperForPage} from "components/accessWrapper";


export const OrderList: React.FC<IResourceComponentsProps> = () => {
  const { mutate: mutateDelete } = useDelete();

  const {
    tableProps,
    searchFormProps
  } = useTable<IOrder, HttpError, IOrderFilterVariables>({
    initialSorter: [],
    resource: "orders",
    initialPageSize: 25,
    dataProviderName: "customProvider",
    onSearch: (params: any) => {
      const filters: CrudFilters = [];
      const { eatsId } = params;

      const searchMode = !(eatsId === undefined)

      filters.push({
        field: "searchMode",
        operator: "eq",
        value: searchMode
      });

      filters.push({
        field: "eatsId",
        operator: "eq",
        value: eatsId,
      });

      return filters;
    },
  });

  const t = useTranslate();

  return (
    <AccessWrapperForPage resource={EAppResources.ORDERS} action={EPageActions.LIST}>
      <Row gutter={[0, 16]} wrap={false} className={"flex-column"}>
        <Row gutter={[0, 16]}>
          <Card title={""} className={"width-100-pr"}>
            <Filter formProps={searchFormProps} />
          </Card>
        </Row>
        <Row gutter={[0, 16]}>
          <List pageHeaderProps={{
            style: {width: '100%'},
            // extra: (
            //   <>
            //     <RangePicker placeholder={["Начальная дата", "Конечная дата"]} locale={locale}/>
            //     <Button type={"primary"}>
            //       Экспорт в CSV
            //     </Button>
            //   </>
            // )
          }}>
            <Table
              {...tableProps}
              //dataSource={data}
              rowKey="id"
            >

              <Table.Column
                key="id"
                dataIndex="id"
                title={"#"}
                render={(value) => <Link to={`/orders/show/${value}`}>#{value}</Link>}
              />

              <Table.Column
                key="deliveryType"
                dataIndex="deliveryType"
                title={"Тип выдачи"}
                render={(value) => DELIVERY_TYPES.find(t => t.value === value)?.label || (value === EDeliveryType.YANDEX ? 'Яндекс Доставка' : '--')}
              />

              <Table.Column
                key="eatsId"
                dataIndex="eatsId"
                title={"Номер заказа Яндекс"}
                render={(value) => value}
              />

              <Table.Column
                key="totalCost"
                dataIndex="totalCost"
                title={"Итоговая сумма"}
                render={(value) => value || '--'}
              />

              <Table.Column
                key="phone"
                dataIndex="phone"
                title={"Пользователь"}
                render={(value) => value || '--'}
              />
              {/*
              <Table.Column
                key="userEmail"
                dataIndex="userEmail"
                title={"Email"}
                render={(value) => value || '--'}
              /> */}

              {/* <Table.Column
                key="timeTo"
                dataIndex="timeTo"
                title={"К какому времени приготовить"}
                render={(value, record: IOrder) => value ? value : !record.readyQuickly ? '--' : 'Как можно скорее'}
              /> */}

              <Table.Column
                key="status"
                dataIndex="status"
                title={"Статус"}
                render={(value) => <Tag style={{marginRight: 0, color: getStatus(value || '', 'colorText') || '#fff'}}
                                        color={getStatus(value || '', 'color')}>
                  {getStatus(value || '', 'label')}</Tag>}
              />

              <Table.Column
                key="createdAt"
                dataIndex="createdAt"
                title={"Время создания"}
                render={(value) => getDatetimeInReadableFormat(value) || '--'}
              />

              <Table.Column
                key="paidFact"
                dataIndex="paidFact"
                title={"Оплачено"}
                render={(value) => {
                  return <CustomBooleanField value={value}/>;
                }}
              />

              <Table.Column
                key="paidTest"
                dataIndex="paidTest"
                title={"Тестовый платеж"}
                render={(value) => {
                  return <BooleanField value={value}/>;
                }}
              />

              <Table.Column<IOrder>
                title={t("table.actions")}
                dataIndex="actions"
                key="actions"
                align="center"
                fixed="right"
                render={(_text, record) => {
                  return (
                    <Dropdown
                      overlay={<TableMenu record={record}
                                          resourceName={"orders"}
                                          deleteItem={() => {
                                            mutateDelete({
                                              resource: "orders",
                                              id: record.id,
                                              mutationMode: "undoable",
                                            });
                                          }}
                                          showEditButton={false}
                                          showCloneButton={false}
                                          fullPageMenu={true}/>}
                      trigger={["click"]}
                    >
                      <Icons.MoreOutlined className={"table-dropdown-icon"}/>
                    </Dropdown>
                  );
                }}
              />
            </Table>
          </List>
        </Row>
      </Row>
    </AccessWrapperForPage>
  );
};


const Filter: React.FC<{ formProps: FormProps }> = (props) => {
  const t = useTranslate();

  const [orderId, setOrderId] = useState<string>('');

  return (
    <Form layout="vertical" {...props.formProps}>
      <Row>
        <Col xl={24} lg={24} md={24}>
          <Row gutter={[10, 0]} align="bottom">
            <Col xl={6} lg={8} md={10} sm={12} xs={24}>
              <Form.Item label={"Номер заказа Яндекса"} name="eatsId">
                <Input
                  onChange={(e) => setOrderId(e?.target?.value)}
                  placeholder={"Поиск по номеру заказа Яндекса"}
                  prefix={<Icons.SearchOutlined />}
                />
              </Form.Item>
            </Col>

            <Col xl={6} lg={8} md={10} sm={12} xs={24}>
              <div style={{display: 'flex'}}>
                <Form.Item style={{flex: '1', marginRight: '12px'}}>
                  <Button
                    className={"width-100-pr"}
                    htmlType="submit"
                    type="primary"
                  >
                    Найти
                    {/*{t("markets.filter.submit")}*/}
                  </Button>
                </Form.Item>
                <Form.Item className={"block-without-margin"}>
                  <Button
                    className={"width-100-pr"}
                    htmlType="button"
                    onClick={() => {
                      props.formProps?.form?.resetFields()
                      props.formProps?.form?.submit()
                    }}
                  >
                    <Icons.CloseOutlined />
                  </Button>
                </Form.Item>
              </div>
            </Col>

          </Row>
        </Col>

        <Col xl={24} lg={24} md={24}>
          <Row gutter={[10, 0]} align="bottom">
            <Col xl={6} lg={8} md={10} sm={12} xs={24}>
              <Form.Item label={"По номеру заказа"} className={"filter-block-without-margin"} name="textSearch">
                <Input
                  onChange={(e) => setOrderId(e?.target?.value)}
                  placeholder={t("orders.filter.search.placeholder")}
                  prefix={<Icons.SearchOutlined />}
                />
              </Form.Item>
            </Col>

            {/*<Col xs={0} xl={4} md={2}>*/}
            {/*</Col>*/}

            {/*<Col xs={24} xl={6} md={6}>*/}
            {/*  <Form.Item label={t("orders.filter.status.label")} name="textSearch">*/}
            {/*    <Select*/}
            {/*      allowClear*/}
            {/*      placeholder={t("orders.filter.status.placeholder")}*/}
            {/*      options={ORDER_STATUSES}*/}
            {/*    />*/}
            {/*  </Form.Item>*/}
            {/*</Col>*/}

            {/*<Col xs={24} xl={6} md={6}>*/}
            {/*  <Form.Item label={t("orders.filter.paid.label")}*/}
            {/*             valuePropName="checked" name="textSearch">*/}
            {/*    <Switch size={"small"}/>*/}
            {/*  </Form.Item>*/}
            {/*</Col>*/}

            <Col xl={6} lg={8} md={10} sm={12} xs={24}>
              <div style={{display: 'flex'}}>
                <Form.Item className={"filter-block-without-margin"} style={{flex: '1', marginRight: '12px'}}>
                  <Button
                    className={"width-100-pr"}
                    htmlType="button"
                    type="primary"
                  >
                    <Link to={`/orders/show/${orderId}`}>Перейти</Link>
                    {/*{t("markets.filter.submit")}*/}
                  </Button>
                </Form.Item>
                {/*<Form.Item className={"block-without-margin"}>*/}
                {/*  <Button*/}
                {/*    className={"width-100-pr"}*/}
                {/*    htmlType="button"*/}
                {/*    onClick={() => {*/}
                {/*      props.formProps?.form?.resetFields()*/}
                {/*      props.formProps?.form?.submit()*/}
                {/*    }}*/}
                {/*  >*/}
                {/*    <Icons.CloseOutlined />*/}
                {/*  </Button>*/}
                {/*</Form.Item>*/}
              </div>
            </Col>

          </Row>
        </Col>
      </Row>



    </Form>
  );
};