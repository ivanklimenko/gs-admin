import React, {useEffect, useState} from "react";
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Col,
  Create, Descriptions,
  Divider,
  Drawer,
  Dropdown, Edit,
  Form,
  Grid,
  Icons,
  Image,
  Input,
  InputNumber, Modal,
  Radio,
  Row,
  Select,
  Space,
  Table,
  useSelect
} from "@pankod/refine-antd";
import {IOrder, IOrderOutlet, IOrderProduct} from "interfaces/orders";
import {useList, useOne, useTranslate} from "@pankod/refine-core";
import {IOutlet} from "interfaces/outlets";
import {FORM_COMMON_RULES} from "../../common/constants";
import {EOptionGroupType, IProduct} from "interfaces/products";
import {TableMenu} from "../tableMenu/tableMenu";

import { useUpdate, useCreate, useDelete } from "@pankod/refine-core";
import {Link} from "react-router-dom";
import {Switch} from 'antd';

const { confirm } = Modal;


export const OrderState: React.FC<{
  order: IOrder | null,
  products: Array<IOrderProduct>,
  outlets: Array<IOrderOutlet>,
  onRefetchOrder: () => void
}> = ({ products: orderProducts, outlets, order, onRefetchOrder}) => {

  const t = useTranslate();

  const [products, setProducts] = useState<Array<IOrderProduct>>([])

  useEffect(() => {
    setProducts(orderProducts)
  }, [orderProducts])

  const { mutateAsync: mutateUpdateAsync } = useUpdate<any>();
  const { mutateAsync: mutateCreateAsync } = useCreate<any>();
  const { mutateAsync: mutateDeleteAsync } = useDelete<any>();
  const [showCreateDrawer, setShowCreateDrawer] = useState(false)
  const [showEditDrawer, setShowEditDrawer] = useState(false)
  const [initialFormValues, setInitialFormValues] = useState<any>({});

  const { mutateAsync: mutateReturnProductAsync } = useUpdate<any>();


  const addQuantity = async (values: any) => {
    const options = !values?.options ? [] : Object.keys(values.options).reduce((arr: any[], groupId: string) => {
      const groupValue = values.options[groupId]

      if (!groupValue) {
        return arr
      }

      return typeof groupValue !== 'object' ? [...arr, {
        "optionId": groupValue,
      }] : groupValue?.length >= 0 ? [...arr, ...groupValue.map((g: any)=> ({
        "optionId": g
      }))]  : [...arr, ...Object.keys(groupValue).map(optionId => ({
        "optionId": parseInt(optionId),
        "quantity": groupValue[optionId]
      }))]
    }, [])

    await mutateCreateAsync({
      dataProviderName: "ordersProvider",
      resource: "orders",
      values: {
        "productId": values.productId,
        "quantity": values?.product?.soldByWeight ? parseFloat(values.quantity) : parseInt(values.quantity),
        "weightOrVolume": values.weightOrVolume || 0,
        "options": options,
        "orderId": order?.id
      },
    });
    setShowCreateDrawer(false)
    onRefetchOrder()
  }

  const changeQuantity = async (values: any) => {
    await mutateUpdateAsync({
      dataProviderName: "ordersProvider",
      resource: "orders",
      id: initialFormValues.id,
      values: {
        "orderProductId": initialFormValues.id,
        "quantity": values?.product?.soldByWeight ? parseFloat(values.quantity) : parseInt(values.quantity)
      }
    })
    setShowEditDrawer(false)
    onRefetchOrder()
  }

  const deleteProduct = async (record: any) => {
    await mutateDeleteAsync({
      dataProviderName: "ordersProvider",
      resource: "orders/products/remove",
      id: initialFormValues.id,
      values: {
        "orderProductId": record.id
      }
    })
    setShowEditDrawer(false)
    onRefetchOrder()
  }

  const showConfirmWithReward = (value: boolean, record: IOrderOutlet) => {
    confirm({
      title: value ? `Вы уверены, что хотите оформить возврат по "${record?.title || ''}"?` : `Вы уверены, что хотите отменить возврат по "${record?.title || ''}"?`,
      icon: <Icons.ExclamationCircleOutlined />,
      content: '',
      okText: 'Да, подтверждаю',
      okType: 'primary',
      cancelText: 'Нет',
      onOk: async () => {
        try {
          await mutateReturnProductAsync({
            dataProviderName: "ordersProvider",
            resource: "orders/products/set_with_reward",
            id: '',
            values: { orderId: order?.id, "orderProducts": [
                {
                  "id": record?.id,
                  "withReward": value
                }
              ]},
            errorNotification: {
              description: "Произошла ошибка",
              type: "error",
              message: "Попробуйте еще раз позже, или обратитесь к администратору"
            }
          });

          setProducts(products => products?.map(p => p?.id !== record?.id ? p : {
            ...p,
            withReward: value
          }))
        } catch {

        }
        //console.log('onOk');
      },
      onCancel() {
        //console.log('Cancel');
      },
    });
  };

  return (
    <Card title="Состав заказа" style={{maxWidth: '100%'}} className={"order-outlets-card"} extra={
      <Button size={"middle"} onClick={() => {
        setShowCreateDrawer(true)
      }} type={"primary"}>{t("buttons.add")}</Button>
    }>
      <Table dataSource={products} style={{maxWidth: '100%'}} pagination={false}>
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
            {record?.image && (
              <Avatar shape="square" className={"table-preview-image"} src={<Image src={record?.image} />} />
            )}
            <span style={{marginLeft: '12px'}}>{value}</span>
          </div>}
        />

        <Table.Column
          key="outletId"
          dataIndex="outletId"
          title={"Точка продажи"}
          render={(value) => (outlets.find(o => o.id === value))?.outlet?.title || value}
        />


        <Table.Column
          key="orderProductOptions"
          dataIndex="orderProductOptions"
          title={"Опции"}
          render={(value) => value.map((v: any) => (
            <div>
              <span style={{marginRight: '4px'}}>{v.title}: </span>
              <span>+{v.price}р.</span>
            </div>
          ))}
        />

        <Table.Column
          key="quantity"
          dataIndex="quantity"
          title={"Количество"}
          render={(value) => value}
        />

        <Table.Column
          key="note"
          dataIndex="note"
          title={"Комментарий"}
          render={(value) => value}
        />

        <Table.Column
          key="basicPrice"
          dataIndex="basicPrice"
          title={"Цена, р."}
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
          render={(value) => value}
        />

        <Table.Column
          key="discountValue"
          dataIndex="discountValue"
          title={"Скидка,р."}
          render={(value) => value}
        />


        <Table.Column
          key="priceWithOptionsAndDiscount"
          dataIndex="priceWithOptionsAndDiscount"
          title={"Итог, р."}
          render={(value) => value}
        />

        <Table.Column
          key="withReward"
          dataIndex="withReward"
          title={"Оформлен возврат с оплатой"}
          render={(value, record: IOrderOutlet) => <Switch size={"small"} checked={value} onChange={() => {
            showConfirmWithReward(!value, record)
          }}/>}
        />

        <Table.Column
          key="actions"
          fixed="right"
          dataIndex="actions"
          title={"Действие"}
          render={(_, record) => (
            <Dropdown
              overlay={<TableMenu record={record}
                                  fullPageMenu={false}
                                  deleteItem={() => {
                                    deleteProduct(record)
                                  }}
                                  setEdit={() => {
                                    setShowEditDrawer(true)
                                    setInitialFormValues(record);
                                  }}
                                  showCloneButton={false} showShowButton={false}/>}
              trigger={["click"]}
            >
              <Icons.MoreOutlined className={"table-dropdown-icon"}/>
            </Dropdown>
          )}
        />

      </Table>

      <CreateOrderProduct
        initialValues={initialFormValues}
        visible={showCreateDrawer}
        market={products[0]?.product?.outlet?.market || null}
        marketId={products[0]?.product?.outlet?.market?.id || null}
        onClose={() => setShowCreateDrawer(false)}
        onFinish={addQuantity}
      />

      <EditOrderProduct
        initialValues={initialFormValues}
        visible={showEditDrawer}
        marketId={products[0]?.product?.outlet?.market?.id || null}
        market={products[0]?.product?.outlet?.market || null}
        onClose={() => setShowEditDrawer(false)}
        onFinish={changeQuantity}
      />
    </Card>
  )
}



type FormOrderProductProps = {
  visible: boolean;
  onClose: () => void;
  onFinish: (values: any) => void;
  marketId?: number | null,
  market?: {id: number, title: string},
  initialValues: any
};


export const CreateOrderProduct: React.FC<FormOrderProductProps> = ({
                                                                      visible,
                                                                      onClose,
                                                                      onFinish, market,
                                                                      marketId
                                                                    }) => {
  const t = useTranslate();
  const [form] = Form.useForm();
  const breakpoint = Grid.useBreakpoint();

  const [selectedOutletId, setSelectedOutletId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string>();

  const [searchOutletValue, setSearchOutletValue] = useState('');

  const outletsSelectProps = useList<IOutlet>({
    resource: "outlets",
    dataProviderName: "autocompleteProvider",
    config: {
      filters: [
        {
          field: "marketId",
          operator: "eq",
          value: marketId,
        },
        {
          field: "starts_with",
          operator: "eq",
          value: searchOutletValue,
        }]
    }
  });

  const {selectProps: productsSelectProps} = useSelect<IProduct>({
    resource: "products",
    filters: [{
      field: "outletId",
      operator: "eq",
      value: selectedOutletId,
    }, {
      field: "marketId",
      operator: "eq",
      value: marketId,
    }],
    dataProviderName: "autocompleteProvider"
  });

  const productProps = useOne<IProduct>({
    resource: "products",
    id: selectedProductId || '',
    dataProviderName: "customProvider",
  })

  return (
    <Drawer
      visible={visible}
      onClose={() => {
        onClose()
        form.resetFields();
      }}
      width={breakpoint.sm ? "500px" : "100%"}
      bodyStyle={{padding: 0}}
      className={"action-drawer-layout"}
      zIndex={1001}
      destroyOnClose={true}
    >
      <Create resource="orderState"
              saveButtonProps={{
                onClick: () => {
                  form.submit()
                }
              }}
              title={t("orders.titles.create")} pageHeaderProps={{
        extra: null, breadcrumb: undefined, onBack: undefined
      }}>

        <Form
          form={form}
          onFinish={(values) => {
            onFinish({
              ...values,
              product: productProps?.data?.data,
              weightOrVolume: productProps?.data?.data.weightOrVolume || 0
            });
            //form?.resetFields();
          }}
          layout="vertical"
          initialValues={{
            quantity: 1
          }}
        >

          {!!market && (
            <Descriptions title="" column={1} size={"middle"} style={{padding: 0}}>
              <Descriptions.Item label={"Маркет"}>
                <Link to={`/markets/show/${market?.id}`}  target={"_blank"}>{market?.title || "--"}</Link>
              </Descriptions.Item>
            </Descriptions>
          )}

          <Form.Item
            label={t("orders.fields.state.outlet")}
            name="outletId"
            rules={[...FORM_COMMON_RULES]}
          >
            <Select
              showSearch
              notFoundContent={null}
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              onSelect={(value: string) => setSelectedOutletId(value)}
              onSearch={(value: string) => {
                //if (outletsSelectProps.onSearch) {
                setSearchOutletValue(value);
                //}
              }}
            >
              {outletsSelectProps?.data?.data?.map((d: any) =>
                <Select.Option key={d.id} value={d.id}>{`${d.title} (${d?.market?.title})`}</Select.Option>)}
            </Select>
          </Form.Item>

          <Form.Item
            label={t("orders.fields.state.product")}
            name="productId"
            rules={[...FORM_COMMON_RULES]}
          >
            <Select
              showSearch
              notFoundContent={null}
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              onSearch={(value) => {
                if (productsSelectProps.onSearch) {
                  productsSelectProps.onSearch(value);
                }
              }}
              onSelect={(value: string) => {
                setSelectedProductId(value)
              }}
            >
              {productsSelectProps?.options?.map(d => <Select.Option key={d.value} value={d.value}>{d.label}</Select.Option>)}
            </Select>
          </Form.Item>

          <Form.Item
            label={t("orders.fields.state.count")}
            name="quantity"
            initialValue={1}
            rules={[...FORM_COMMON_RULES]}
          >
            <InputNumber decimalSeparator={'.'} min={productProps?.data?.data?.soldByWeight ? 0 : 1} max={1000} step={productProps?.data?.data?.soldByWeight ? 0.1 : 1}/>
          </Form.Item>

          {productProps?.data?.data?.optionGroups?.map((group) => {

            if (group.type === EOptionGroupType.TAKEAWAY) {
              return null
            }

            return (
              <>
                <Divider/>
                <Form.Item name={["options", `${group.id}`]} label={group.title} valuePropName="checked">
                  {group.type === EOptionGroupType.RADIO && (
                    <Radio.Group onChange={(e) => {
                      const values = form.getFieldsValue()
                      form.setFieldsValue({
                        ...values,
                        "options": {
                          ...values.options,
                          [`${group.id}`]: e.target.value
                        }
                      })
                    }}>
                      <Space direction="vertical">
                        {group.options?.map(o => <Radio value={o.id} disabled={!group?.isActive || !group.isEnabled || !o.isActive || !o.isEnabled}>{o.title} (+{o.price})</Radio>)}
                      </Space>
                    </Radio.Group>
                  )}

                  {group.type === EOptionGroupType.CHECKBOX && (
                    <Checkbox.Group onChange={(e) => {
                      const values = form.getFieldsValue()
                      form.setFieldsValue({
                        ...values,
                        "options": {
                          ...values.options,
                          [`${group.id}`]: e
                        }

                      })
                    }}>
                      {group.options?.map(o => <Checkbox value={o.id} disabled={!group?.isActive || !group.isEnabled || !o.isActive || !o.isEnabled}>{o.title} (+{o.price})</Checkbox>)}
                    </Checkbox.Group>
                  )}

                  {group.type === EOptionGroupType.QUANTITIVE && (
                    <Row gutter={[0, 12]}>
                      {group.options?.map(o => (
                        <Col span={24}><InputNumber min={0} max={group.maxAllowedOptions || 10000}
                                                    disabled={!group?.isActive || !group.isEnabled || !o.isActive || !o.isEnabled}
                                                    onChange={(e) => {
                                                      const values = form.getFieldsValue()
                                                      form.setFieldsValue({
                                                        ...values,
                                                        "options": {
                                                          ...values.options,
                                                          [`${group.id}`]: {
                                                            ...values.options[`${group.id}`],
                                                            [`${o.id}`]: e
                                                          }
                                                        }
                                                      })
                                                    }}
                        /> {o.title} (+{o.price})</Col>
                      ))}
                    </Row>
                  )}
                </Form.Item>
              </>
            )
          })}

        </Form>
      </Create>
    </Drawer>
  );
};


export const EditOrderProduct: React.FC<FormOrderProductProps> = ({
                                                                    visible,
                                                                    onClose,
                                                                    onFinish, market,
                                                                    initialValues,
                                                                  }) => {
  const t = useTranslate();
  const [form] = Form.useForm();
  const breakpoint = Grid.useBreakpoint();

  const [selectedOutletId, setSelectedOutletId] = useState<string>(initialValues.outletId);
  const [selectedProductId, setSelectedProductId] = useState<string>(initialValues.productId);

  useEffect(() => {
    setSelectedOutletId(initialValues.outletId)
    setSelectedProductId(initialValues.productId)
    form?.setFieldsValue({
      quantity: initialValues.quantity
    })
  }, [initialValues])

  const outletProps = useOne<IOutlet>({
    resource: "outlets",
    id: selectedOutletId,
    dataProviderName: "customProvider",
  })

  const productProps = useOne<IProduct>({
    resource: "products",
    id: selectedProductId,
    dataProviderName: "customProvider",
  })

  return (
    <Drawer
      visible={visible}
      onClose={() => {
        onClose()
        form.resetFields();
      }}
      width={breakpoint.sm ? "500px" : "100%"}
      bodyStyle={{padding: 0}}
      className={"action-drawer-layout"}
      zIndex={1001}
      destroyOnClose={true}
    >
      <Edit resource="orderState"
            saveButtonProps={{
              onClick: () => {
                form.submit()
              }
            }}
            title={t("orders.titles.edit")} pageHeaderProps={{
        extra: null, breadcrumb: undefined, onBack: undefined
      }}>

        {!!market && (
          <Descriptions title="" column={1} size={"middle"} style={{padding: 0}}>
            <Descriptions.Item label={"Маркет"}>
              <Link to={`/markets/show/${market?.id}`} target={"_blank"}>{market?.title || "--"}</Link>
            </Descriptions.Item>
          </Descriptions>
        )}

        <Form
          form={form}
          onFinish={(values) => {
            onFinish({
              ...values,
              product: productProps?.data?.data
            });
            form?.resetFields();
          }}
          layout="vertical"
          initialValues={initialValues}
        >

          <Descriptions title="" column={1} size={"middle"} style={{padding: 0}}>
            <Descriptions.Item label={t("orders.fields.state.outlet")}>
              {outletProps?.data?.data?.title || "--"}
            </Descriptions.Item>

            <Descriptions.Item label={t("orders.fields.state.product")}>
              {productProps?.data?.data?.title || "--"}
            </Descriptions.Item>

          </Descriptions>

          <Form.Item
            label={t("orders.fields.state.count")}
            name="quantity"
            rules={[...FORM_COMMON_RULES]}
          >
            <InputNumber decimalSeparator={'.'} min={productProps?.data?.data?.soldByWeight ? 0 : 1} max={1000}  step={productProps?.data?.data?.soldByWeight ? 0.1 : 1}/>
          </Form.Item>

        </Form>
      </Edit>
    </Drawer>
  );
};