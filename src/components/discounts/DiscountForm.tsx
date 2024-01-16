import React, {useEffect, useState} from "react";
import {useList, useTranslate} from "@pankod/refine-core";
import {
  Form,
  Input,
  Select,
  useSelect,
  Row,
  Card,
  Col,
  FormProps,
  Switch,
  Descriptions,
  BooleanField,
  Tag, InputNumber
} from "@pankod/refine-antd";
import moment from "moment";

import {
  DATE_FORMAT,
  DATE_TIME_FORMAT,
  FORM_COMMON_RULES,
  USER_DATE_TIME_FORMAT
} from "common/constants";

import dayjs, {Dayjs} from "dayjs";
import {DatePicker, notification} from "antd";
import {IMarket} from "interfaces/markets";
import {IProduct} from "interfaces/products";
import locale from "antd/es/date-picker/locale/ru_RU";
import {IOutlet} from "interfaces/outlets";
import {IUser} from "interfaces/users";
import {ICategory} from "interfaces/tags";
import { CustomBooleanField } from "components/customBooleanField";

type FormDiscountProps = {
  formProps: FormProps;
  readonlyMode?: boolean;

};

export const DiscountForm: React.FC<FormDiscountProps> = ({formProps, readonlyMode= false}) => {
  const t = useTranslate();

  const [selectedMarketId, setSelectedMarketId] = useState<string | null>(formProps?.initialValues?.marketId || null);
  const [selectedOutletId, setSelectedOutletId] = useState<string | null>(formProps?.initialValues?.outletId || null);

  useEffect(() => {
    if (formProps?.initialValues?.outletId) {
      setSelectedOutletId(formProps?.initialValues?.outletId)
    }

    if (formProps?.initialValues?.marketId) {
      setSelectedMarketId(formProps?.initialValues?.marketId)
    }
  }, [formProps?.initialValues])

  const {selectProps: marketsSelectProps} = useSelect<IMarket>({
    resource: "markets",
    dataProviderName: "autocompleteProvider"
  });

  const [searchOutletValue, setSearchOutletValue] = useState('');

  const outletsSelectProps = useList<IOutlet>({
    resource: "outlets",
    dataProviderName: "autocompleteProvider",
    config: {
      filters: [
        {
          field: "marketId",
          operator: "eq",
          value: selectedMarketId,
        },
        {
          field: "title_like",
          operator: "eq",
          value: searchOutletValue,
      }]
    }
  });

  const {selectProps: categoriesSelectProps} = useSelect<ICategory>({
    resource: "categories",
    filters: [{
      field: "outletId",
      operator: "eq",
      value: selectedOutletId,
    }],
    dataProviderName: "categoriesProvider"
  });

  const {selectProps: productsSelectProps} = useSelect<IProduct>({
    resource: "products",
    filters: [{
      field: "marketId",
      operator: "eq",
      value: selectedMarketId,
    }, {
      field: "outletId",
      operator: "eq",
      value: selectedOutletId,
    }],
    dataProviderName: "autocompleteProvider"
  });

  const usersSelectProps = useList<IUser>({
    resource: "users",
    dataProviderName: "customProvider"
  });

  if (readonlyMode) {
    return (
      <Row gutter={[16, 16]} wrap align="stretch" style={{marginBottom: '16px'}}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Card>
            <Descriptions title="" column={2}  bordered={true} size={"middle"}
                          layout={"vertical"}>
              <Descriptions.Item label={t("discounts.fields.title")}>
                {formProps?.initialValues?.title || "--"}
              </Descriptions.Item>

              <Descriptions.Item label={t("discounts.fields.isActive")}>
                <CustomBooleanField value={formProps?.initialValues?.isActive}/>
              </Descriptions.Item>

              <Descriptions.Item label={t("discounts.fields.isFirstOrder")}>
                <CustomBooleanField value={formProps?.initialValues?.isFirstOrder}/>
              </Descriptions.Item>

              <Descriptions.Item label={t("discounts.fields.size")}>
                {formProps?.initialValues?.size || "--"}
              </Descriptions.Item>

              <Descriptions.Item label={t("discounts.fields.datesAt")}>
                {`${moment(formProps.initialValues?.startsAt).format(USER_DATE_TIME_FORMAT)} - ${moment(formProps.initialValues?.endsAt).format(USER_DATE_TIME_FORMAT)}` || "--"}
              </Descriptions.Item>

              <Descriptions.Item label={t("discounts.fields.datesCartCreated")}>
                {`${moment(formProps.initialValues?.dateCartCreatedFrom).format(USER_DATE_TIME_FORMAT)} - ${moment(formProps.initialValues?.dateCartCreatedTo).format(USER_DATE_TIME_FORMAT)}` || "--"}
              </Descriptions.Item>

              <Descriptions.Item label={t("discounts.fields.market")}>
                {[formProps?.initialValues?.market]?.map((m:any) => <Tag>{m?.title}</Tag>) || null}
              </Descriptions.Item>

              <Descriptions.Item label={t("discounts.fields.outlet")}>
                {[formProps?.initialValues?.outlet]?.map((o:any) => <Tag>{o?.title}</Tag>) || null}
              </Descriptions.Item>

              <Descriptions.Item label={t("discounts.fields.category")}>
                {[formProps?.initialValues?.category]?.map((c:any) => <Tag>{c?.title}</Tag>) || null}
              </Descriptions.Item>

              <Descriptions.Item label={t("discounts.fields.user")}>
                {formProps?.initialValues?.users?.map((u:any) => <Tag>{u?.title}</Tag>) || null}
              </Descriptions.Item>

              <Descriptions.Item label={t("discounts.fields.products")}>
                {[formProps?.initialValues?.products]?.map((p:any) => <Tag>{p?.title}</Tag>) || null}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

      </Row>
    )
  }

  return (
    <Form
      {...formProps}
      initialValues={{
        ...formProps?.initialValues,
        productIds: formProps.initialValues?.products,
        products: formProps.initialValues?.products?.map((p: {id: number}) => p.id),
        datesAt: [formProps.initialValues?.startsAt ? dayjs(formProps.initialValues?.startsAt) : null,
          formProps.initialValues?.endsAt ? dayjs(formProps.initialValues.endsAt) : null],
        datesCartCreated: [formProps.initialValues?.dateCartCreatedFrom ? dayjs(formProps.initialValues?.dateCartCreatedFrom) : null,
          formProps.initialValues?.dateCartCreatedTo ? dayjs(formProps.initialValues.dateCartCreatedTo) : null],
      }}
      onFinish={(values) => {
        if (values?.marketId) {
          if (!values?.products?.length) {
            notification.error({
              message: 'Ошибка сохранения',
              description:
                'Необходимо заполнить все условия для скидки',
            });
            return;
          }
        }

        if (values?.datesAt.some((d: Dayjs | null) => !d) || values?.datesCartCreated.some((d: Dayjs | null) => !d)) {
          notification.error({
            message: 'Ошибка сохранения',
            description:
              'Необходимо заполнить поля Сроки и Период создания корзины',
          });
          return;
        }

        // @ts-ignore
        formProps.onFinish({
          ...values,
          userId: values?.userId || undefined,
          marketId: values?.marketId || undefined,
          outletId: values?.outletId || undefined,
          startsAt: values?.datesAt[0]?.format(DATE_FORMAT),
          endsAt: values?.datesAt[1]?.format(DATE_FORMAT),
          dateCartCreatedFrom: values?.datesCartCreated[0]?.format(DATE_FORMAT),
          dateCartCreatedTo: values?.datesCartCreated[1]?.format(DATE_FORMAT),
        });
      }}
      layout="vertical"
      validateTrigger={"submit"}
    >
      {formProps.initialValues?.id && (
        <Form.Item
          hidden={true}
          name="id"
        >
        </Form.Item>
      )}


      <Row gutter={[16, 16]} wrap align="stretch" style={{marginBottom: '16px'}}>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Card>
            <Form.Item
              label={t("discounts.fields.title")}
              name="name"
              rules={[...FORM_COMMON_RULES]}
            >
              <Input type={"text"}/>
            </Form.Item>

            <Form.Item
              label={t("discounts.fields.isActive")}
              name="isActive"
              valuePropName="checked"
            >
              <Switch size={"small"}/>
            </Form.Item>

            <Form.Item
              label={t("discounts.fields.isFirstOrder")}
              name="isFirstOrder"
              valuePropName="checked"
            >
              <Switch size={"small"}/>
            </Form.Item>

            <Form.Item
              label={t("discounts.fields.size")}
              name="amount"
              rules={[...FORM_COMMON_RULES]}
            >
              <InputNumber min={0} max={100}/>
            </Form.Item>

            <Form.Item
              label={t("discounts.fields.minCartSum")}
              name="minCartSum"
            >
              <InputNumber/>
            </Form.Item>

            <Form.Item
              label={t("discounts.fields.datesAt")}
              name={["datesAt"]}
              rules={[...FORM_COMMON_RULES]}
              className={"width-100-pr"}
            >
              <DatePicker.RangePicker showTime={false} format={DATE_FORMAT} locale={locale} className={"width-100-pr"}/>
            </Form.Item>

            <Form.Item
              label={t("discounts.fields.datesCartCreated")}
              name={["datesCartCreated"]}
              rules={[...FORM_COMMON_RULES]}
              className={"width-100-pr"}
            >
              <DatePicker.RangePicker showTime={false}  format={DATE_FORMAT} locale={locale} className={"width-100-pr"}/>
            </Form.Item>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={12} lg={12}>
          <Card>
            <Form.Item
              label={t("discounts.fields.markets")}
              name="marketId"
            >
              <Select
                showSearch
                notFoundContent={null}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onSelect={(value: string) => setSelectedMarketId(value)}
                onSearch={(value) => {
                  if (marketsSelectProps?.onSearch) {
                    marketsSelectProps.onSearch(value);
                  }
                }}
              >
                { (formProps?.initialValues?.market && !marketsSelectProps?.options?.length) ? (
                  [formProps?.initialValues?.market].map(d => <Select.Option key={d?.id} value={d?.id}>{d?.title}</Select.Option>)
                ) : (
                  marketsSelectProps?.options?.map(d => <Select.Option key={d.value} value={d.value}>{d.label}</Select.Option>)
                )}
              </Select>
            </Form.Item>

            <Form.Item
              label={t("orders.fields.state.outlet")}
              name="outletId"
            >
              <Select
                showSearch
                notFoundContent={null}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onSelect={(value: string) => setSelectedOutletId(value)}
                onSearch={(value) => {
                  setSearchOutletValue(value)
                  // if (outletsSelectProps.onSearch) {
                  //   outletsSelectProps.onSearch(value);
                  // }
                }}
              >
                { (formProps?.initialValues?.outlet && !outletsSelectProps?.data?.data?.length) ? (
                  [formProps?.initialValues?.outlet].map(d => <Select.Option key={d?.id} value={d?.id}>{`${d.title} (${d?.market?.title})`}</Select.Option>)
                ) : (
                  outletsSelectProps?.data?.data?.map(d => <Select.Option key={d.id} value={d.id}>
                    {`${d.title} (${d?.market?.title})`}
                  </Select.Option>)
                )}
              </Select>
            </Form.Item>

            <Form.Item
              label={"Категория"}
              name="categoryId"
            >
              <Select
                showSearch
                disabled={!selectedOutletId}
                notFoundContent={null}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onSearch={(value: string) => {
                  if (categoriesSelectProps?.onSearch) {
                    categoriesSelectProps?.onSearch(value);
                  }
                }}
              >
                { (formProps?.initialValues?.category && !categoriesSelectProps?.options?.length) ? (
                  [formProps?.initialValues?.category].map(d => <Select.Option key={d?.id} value={d?.id}>{d?.title}</Select.Option>)
                ) : (
                  categoriesSelectProps?.options?.map(d => <Select.Option key={d.value} value={d.value}>{d.label}</Select.Option>)
                )}
              </Select>
            </Form.Item>

            <Form.Item
              label={"Продукты"}
              name="products"
            >
              <Select
                showSearch
                disabled={!selectedOutletId}
                mode={"multiple"}
                notFoundContent={null}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onSearch={(value: string) => {
                  if (productsSelectProps?.onSearch) {
                    productsSelectProps?.onSearch(value);
                  }
                }}
              >
                { (formProps?.initialValues?.productIds && !productsSelectProps?.options?.length) ? (
                  [...formProps?.initialValues?.productIds].map(d => <Select.Option key={d?.id} value={d?.id}>{d?.id}</Select.Option>)
                ) : (
                  productsSelectProps?.options?.map(d => <Select.Option key={d.value} value={d.value}>{d.label}</Select.Option>)
                )}
              </Select>
            </Form.Item>

            <Form.Item
              label={"Пользователь"}
              name="userId"
            >
              <Select
                showSearch
                notFoundContent={null}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onSearch={(value: string) => {
                  // if (usersSelectProps?.onSearch) {
                  //   usersSelectProps?.onSearch(value);
                  // }
                }}
              >
                { (formProps?.initialValues?.user && !usersSelectProps?.data?.data?.length) ? (
                  [formProps?.initialValues?.user].map(d => <Select.Option key={d?.id} value={d?.id}>{d?.firstName} {d.lastName} ({d.phone})</Select.Option>)
                ) : (
                  usersSelectProps?.data?.data?.map(d => <Select.Option key={d.id} value={d.id}>{d.firstName} {d.lastName} ({d.phone})</Select.Option>)
                )}
              </Select>
            </Form.Item>
          </Card>
        </Col>

      </Row>


    </Form>
  );
};
