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
  Avatar,
  useTable,
  Icons,
  Dropdown,
  Card,
  Input,
  Form,
  Button,
  FormProps,
  Row,
  Col, Image, Select, BooleanField,
} from "@pankod/refine-antd";

import {IMarket, IMarketFilterVariables} from "interfaces/markets";
import React from "react";
import {TableMenu} from "components/tableMenu/tableMenu";
import {FILTER_ACTIVE_OPTION} from "../../common/constants";
import {Link} from "react-router-dom";
import {CustomBooleanField} from "../../components/customBooleanField";
import {EAppResources, EPageActions} from "interfaces/common";
import { AccessWrapperForPage } from "components/accessWrapper";


export const NetworkList: React.FC<
  IResourceComponentsProps<GetListResponse<IMarket>>
> = ({ initialData }) => {
  const t = useTranslate();
  const { mutate: mutateDelete } = useDelete();

  const { tableProps, searchFormProps } = useTable<IMarket, HttpError, IMarketFilterVariables>({
    queryOptions: {
      initialData,
    },
    resource: "networks",
    dataProviderName: "customProvider",
    hasPagination: true,
    initialPageSize: 20,

    initialFilter: [{
      field: "isNetwork",
      operator: "eq",
      value: true,
    }],
    onSearch: (params) => {
      const filters: CrudFilters = [];
      const { textSearch, isActive } = params;

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

      return filters;
    },
    syncWithLocation: false,
  });


  return (
    <AccessWrapperForPage resource={EAppResources.NETWORKS} action={EPageActions.LIST}>
      <Row gutter={[16, 16]}>
        <Col xl={6} lg={24} xs={24}>
          <Card title={t("markets.filter.title")}>
            <Filter formProps={searchFormProps} />
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
              <Table.Column<IMarket>
                dataIndex="title"
                key="title"
                title="Название"
                render={(value, record) => <div className={"preview-entity-title"}>
                  {record?.imageRaster && (<Avatar shape="square" className={"table-preview-image"} src={<Image src={record?.imageRaster} />} />)}
                  <Link to={`/networks/show/${record.id}`} style={{marginLeft: record?.imageRaster ? '12px' : 0}}>{value}</Link>
                </div>}
              />

              <Table.Column
                dataIndex="isActive"
                key="isActive"
                title="Опубликовано"
                render={(value) => <CustomBooleanField value={value}/>}
              />

              <Table.Column<IMarket>
                fixed="right"
                title={t("table.actions")}
                dataIndex="actions"
                key="actions"
                align="center"
                render={(_, record) => (
                  <Dropdown
                    overlay={<TableMenu record={record}
                                        deleteItem={() => {
                                          mutateDelete({
                                            resource: "markets",
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

const Filter: React.FC<{ formProps: FormProps }> = (props) => {
  const t = useTranslate();

  return (
    <Form layout="vertical" {...props.formProps}>
      <Row gutter={[10, 0]} align="bottom">
        <Col xs={24} xl={24} md={8}>
          <Form.Item label={t("markets.filter.search.label")} name="textSearch">
            <Input
              allowClear
              placeholder={t("markets.filter.search.placeholder")}
              prefix={<Icons.SearchOutlined />}
            />
          </Form.Item>
        </Col>
        {/*<Col xs={24} xl={24} md={8}>*/}
        {/*  <Form.Item*/}
        {/*    label={t("markets.filter.type.label")}*/}
        {/*    name="type"*/}
        {/*  >*/}
        {/*    <Select*/}
        {/*      allowClear*/}
        {/*      placeholder={t("markets.filter.type.placeholder")}*/}
        {/*      options={[*/}
        {/*        {*/}
        {/*          label: t("markets.filter.type.food"),*/}
        {/*          value: "food",*/}
        {/*        },*/}
        {/*        {*/}
        {/*          label: t("markets.filter.type.market"),*/}
        {/*          value: "market",*/}
        {/*        },*/}
        {/*        {*/}
        {/*          label: t("markets.filter.type.cafe"),*/}
        {/*          value: "cafe",*/}
        {/*        },*/}
        {/*      ]}*/}
        {/*    />*/}
        {/*  </Form.Item>*/}
        {/*</Col>*/}
        <Col xs={24} xl={24} md={8}>
          <Form.Item
            label={t("markets.filter.isActive.label")}
            name="isActive"
            valuePropName="checked"
          >
            <Select
              allowClear
              placeholder={t("markets.filter.isActive.placeholder")}
              options={FILTER_ACTIVE_OPTION}
            />
          </Form.Item>
        </Col>

        {/*<Col xs={24} xl={24} md={8}>*/}
        {/*  <Form.Item*/}
        {/*    label={t("markets.filter.isNetwork.label")}*/}
        {/*    name="isNetwork"*/}
        {/*    valuePropName="checked"*/}
        {/*  >*/}
        {/*    <Select*/}
        {/*      allowClear*/}
        {/*      placeholder={t("markets.filter.isNetwork.placeholder")}*/}
        {/*      options={FILTER_NETWORK_OPTION}*/}
        {/*    />*/}
        {/*  </Form.Item>*/}
        {/*</Col>*/}

        <Col xs={24} xl={24} md={8}>
          <div style={{display: 'flex'}}>
            <Form.Item style={{flex: '1', marginRight: '12px'}}>
              <Button
                className={"width-100-pr"}
                htmlType="submit"
                type="primary"
              >
                {t("markets.filter.submit")}
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

