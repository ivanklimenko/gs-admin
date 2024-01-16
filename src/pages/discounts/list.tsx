import React from "react";
import {
  IResourceComponentsProps,
  GetListResponse,
  CrudFilters,
  HttpError,
  useTranslate, useDelete
} from "@pankod/refine-core";
import {
  List,
  Table,
  useTable,
  getDefaultSortOrder,
  Icons,
  useSelect,
  Dropdown,
  Select,
  BooleanField,
  Card,
  Input,
  Form,
  Button,
  FormProps,
  Row,
  Col
} from "@pankod/refine-antd";
import { DatePicker } from "antd";
import {SelectProps} from "antd/lib/select";
import {Link} from "react-router-dom";
import "moment/locale/ru";
import locale from "antd/es/date-picker/locale/ru_RU";

import {IDiscount, IDiscountFilterVariables} from "interfaces/discounts";
import {TableMenu} from "components/tableMenu/tableMenu";
import {IMarket} from "interfaces/markets";
import {getDateInReadableFormat} from "utils";
import {DATE_FORMAT, FILTER_ACTIVE_OPTION, FILTER_FIRST_ORDER_OPTION} from "../../common/constants";
import {CustomBooleanField} from "components/customBooleanField";
import {EAppResources, EPageActions} from "interfaces/common";
import { AccessWrapperForPage } from "components/accessWrapper";



export const DiscountList: React.FC<
  IResourceComponentsProps<GetListResponse<IDiscount>>
> = ({ initialData }) => {

  const t = useTranslate();

  const { mutate: mutateDelete } = useDelete();

  const { tableProps, sorter, searchFormProps } = useTable<IDiscount, HttpError, IDiscountFilterVariables>({
    dataProviderName: "customProvider",
    resource: EAppResources.DISCOUNTS,
    hasPagination: true,
    initialPageSize: 20,
    queryOptions: {
      initialData,
    },
    onSearch: (params) => {
      const filters: CrudFilters = [];
      const { textSearch, isActive, isFirstOrder, markets, dates, users } = params;

      const searchMode = !(textSearch === undefined && isActive === undefined && isFirstOrder === undefined
        && markets === undefined && dates === undefined && users === undefined)

      filters.push({
        field: "searchMode",
        operator: "eq",
        value: searchMode
      });

      filters.push({
        field: "textSearch",
        operator: "eq",
        value: textSearch,
      });

      filters.push({
        field: "isActive",
        operator: "eq",
        value: isActive,
      });

      filters.push({
        field: "isFirstOrder",
        operator: "eq",
        value: isFirstOrder,
      });

      filters.push({
        field: "markets",
        operator: "eq",
        value: markets?.join(',') || undefined,
      });

      filters.push({
        field: "dateFrom",
        operator: "eq",
        value: dates?.[0]?.format(),
      });

      filters.push({
        field: "dateTo",
        operator: "eq",
        value: dates?.[1]?.format(),
      });

      return filters;
    },
    syncWithLocation: false,
  });

  const {selectProps: marketsSelectProps} = useSelect<IMarket>({
    resource: EAppResources.MARKETS,
    dataProviderName: "autocompleteProvider"
  });

  return (
    <AccessWrapperForPage resource={EAppResources.DISCOUNTS} action={EPageActions.LIST}>
      <Row gutter={[16, 16]}>
        <Col xl={6} lg={24} xs={24}>
          <Card title={t("discounts.filter.title")} className={"width-100-pr"}>
            <Filter formProps={searchFormProps} marketsSelectProps={marketsSelectProps} />
          </Card>
        </Col>
        <Col xl={18} xs={24}>
          <List>
            <Table rowKey="id" {...tableProps}>
              <Table.Column
                dataIndex="id"
                key="id"
                title="ID"
                render={(value) => value}
              />

              <Table.Column<IDiscount>
                dataIndex="name"
                key="name"
                title="Название"
                render={(value, record) => <Link to={`/discounts/show/${record.id}`}>{value}</Link>}
              />

              <Table.Column
                dataIndex="isFirstOrder"
                key="isFirstOrder"
                title="Первый заказ"
                render={(value) => <CustomBooleanField value={value}/>}
              />

              <Table.Column
                dataIndex="amount"
                key="amount"
                title="Размер, %"
                render={(value) => value}
              />

              <Table.Column
                dataIndex="startsAt"
                key="startsAt"
                title="Дата начала"
                render={(value) => value ? getDateInReadableFormat(value, DATE_FORMAT) : '--'}
              />

              <Table.Column
                dataIndex="endsAt"
                key="endsAt"
                title="Дата конца"
                render={(value) => value ? getDateInReadableFormat(value, DATE_FORMAT) : '--'}
              />

              <Table.Column<IDiscount>
                dataIndex="market"
                key="market"
                title="Расположение"
                render={(_, record) => (
                  <>
                    {record?.marketId ? (
                      <Link to={`/markets/show/${record?.marketId || ''}`}>{record?.market?.title || record?.marketId || 'Локация (пока без тайтла)'}</Link>
                    ) : (
                      !record?.outletId ? '--' : <Link to={`/outlets/show/${record?.outletId || ''}`}>{record?.outlet?.title || record?.outletId || 'Точка продажи (пока без тайтла)'}</Link>
                    )}
                  </>
                )}
                defaultSortOrder={getDefaultSortOrder("title", sorter)}
                sorter={false}
              />

              {/*<Table.Column*/}
              {/*  dataIndex="users"*/}
              {/*  key="users"*/}
              {/*  title="Пользователи"*/}
              {/*  render={(markets) => (<>{markets?.map((m:any) => <Tag>{m.username}</Tag>)}</>)}*/}
              {/*  defaultSortOrder={getDefaultSortOrder("title", sorter)}*/}
              {/*  sorter={false}*/}
              {/*/>*/}

              <Table.Column<IDiscount>
                fixed="right"
                title={t("table.actions")}
                dataIndex="actions"
                key="actions"
                align="center"
                render={(_, record) => (
                  <Dropdown
                    overlay={<TableMenu record={record}
                                        showShowButton={true}
                                        deleteItem={() => {
                                          mutateDelete({
                                            resource: "discounts",
                                            id: record.id,
                                            mutationMode: "undoable",
                                          });
                                        }}/>}
                    trigger={["click"]}
                  >
                    <Icons.MoreOutlined className={"table-dropdown-icon"}/>
                  </Dropdown>
                )}
              />

            </Table>
          </List>
        </Col>
      </Row>
    </AccessWrapperForPage>
  );
};

const Filter: React.FC<{ formProps: FormProps, marketsSelectProps?: SelectProps<{
    value: string;
    label: string;
  }>}> = (props) => {
  const t = useTranslate();

  const { RangePicker } = DatePicker;

  return (
    <Form layout="vertical" {...props.formProps}>
      <Row gutter={[10, 0]} align="bottom">
        <Col xs={24} sm={12} md={12} xl={24}>
          <Form.Item label={t("discounts.filter.search.label")} name="textSearch">
            <Input
              placeholder={t("discounts.filter.search.placeholder")}
              prefix={<Icons.SearchOutlined />}
            />
          </Form.Item>
        </Col>

        <Col xs={24} xl={24} md={8}>
          <Form.Item
            label={t("discounts.filter.isActive.label")}
            name="isActive"
            valuePropName="checked"
          >
            <Select
              allowClear
              placeholder={t("discounts.filter.isActive.placeholder")}
              options={FILTER_ACTIVE_OPTION}
            />
          </Form.Item>
        </Col>

        <Col xs={24} xl={24} md={8}>
          <Form.Item
            label={t("discounts.filter.isFirstOrder.label")}
            name="isFirstOrder"
            valuePropName="checked"
          >
            <Select
              allowClear
              placeholder={t("discounts.filter.isFirstOrder.placeholder")}
              options={FILTER_FIRST_ORDER_OPTION}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={12} xl={24}>
          <Form.Item label={"Интервал"} name="dates">
            <RangePicker placeholder={["Начало", "Окончание"]} className={"width-100-pr"} locale={locale}/>
          </Form.Item>
        </Col>

        {/*<Col xs={24} sm={12} md={12} xl={24}>*/}
        {/*  <Form.Item*/}
        {/*    label={t("discounts.filter.users.label")}*/}
        {/*    name="users"*/}
        {/*  >*/}
        {/*    <Select*/}
        {/*      allowClear*/}
        {/*      placeholder={t("discounts.filter.users.placeholder")}*/}
        {/*      options={[]}*/}
        {/*    />*/}
        {/*  </Form.Item>*/}
        {/*</Col>*/}

        <Col xs={24} sm={12} md={12} xl={24}>
          <Form.Item
            label={t("discounts.filter.markets.label")}
            name="markets"
          >
            <Select
              showSearch
              mode={"multiple"}
              notFoundContent={null}
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              onSearch={(value) => {
                if (props?.marketsSelectProps?.onSearch) {
                  props.marketsSelectProps.onSearch(value);
                }
              }}
            >
              {props?.marketsSelectProps?.options?.map(d => <Select.Option key={d.value} value={d.value}>{d.label}</Select.Option>)}
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={12} xl={24}>
          <div style={{display: 'flex'}}>
            <Form.Item style={{flex: '1', marginRight: '12px'}}>
              <Button
                className={"width-100-pr"}
                htmlType="submit"
                type="primary"
              >
                {t("outlets.filter.submit")}
              </Button>
            </Form.Item>
            <Form.Item>
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
    </Form>
  );
};

