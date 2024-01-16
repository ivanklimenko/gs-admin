import React from "react";
import {
  CrudFilters,
  GetListResponse,
  HttpError,
  IResourceComponentsProps,
  useDelete,
  useTranslate
} from "@pankod/refine-core";
import {
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  FormProps,
  Icons,
  Input,
  List,
  Row,
  Table,
  useTable
} from "@pankod/refine-antd";
import "moment/locale/ru";
import {Link} from "react-router-dom";

import {IContract, IContractFilterVariables} from "interfaces/contracts";
import {getDateInReadableFormat} from "utils";
import {DATE_FORMAT} from "common/constants";
import {TableMenu} from "components/tableMenu/tableMenu";
import {AccessWrapperForPage} from "components/accessWrapper";
import {EAppResources, EPageActions} from "interfaces/common";


export const ContractList: React.FC<
  IResourceComponentsProps<GetListResponse<IContract>>
> = ({ initialData }) => {
  const t = useTranslate();
  const { mutate: mutateDelete } = useDelete();

  const { tableProps, searchFormProps } = useTable<IContract, HttpError, IContractFilterVariables>({
    dataProviderName: "customProvider",
    hasPagination: true,
    initialPageSize: 20,
    queryOptions: {
      initialData,
    },
    onSearch: (params) => {
      const filters: CrudFilters = [];
      const { textSearch } = params;

      filters.push({
        field: "textSearch",
        operator: "eq",
        value: textSearch,
      });

      // filters.push({
      //   field: "signedAt",
      //   operator: "eq",
      //   value: signedAt,
      // });
      //
      // filters.push({
      //   field: "expiresAt",
      //   operator: "eq",
      //   value: expiresAt,
      // });

      return filters;
    },
    syncWithLocation: false,
  });


  return (
    <AccessWrapperForPage resource={EAppResources.CONTRACTS} action={EPageActions.LIST}>
      <Row gutter={[0, 16]} wrap={false} className={"flex-column"}>
        <Row gutter={[0, 16]}>
          <Card title={t("users.filter.title")} className={"width-100-pr"}>
            <Filter formProps={searchFormProps} />
          </Card>
        </Row>
        <Row gutter={[0, 16]}>
          <List pageHeaderProps={{
            style: {width: '100%'}
          }}>
            <Table rowKey="id" {...tableProps} >
              <Table.Column
                dataIndex="id"
                key="id"
                title="ID"
                render={(value) => value}
              />

              <Table.Column<IContract>
                dataIndex="number"
                key="number"
                title="Номер"
                render={(value, record) => <Link to={`/contracts/show/${record.id}`}>{value}</Link>}
              />

              <Table.Column<IContract>
                dataIndex="person"
                key="person"
                title="Юридическое лицо или ИП"
                render={(value) => value || '--'}
              />

              <Table.Column
                dataIndex="phone"
                key="phone"
                title="Телефон"
                render={(value) => value || '--'}
              />

              <Table.Column
                dataIndex="inn"
                key="inn"
                title="ИНН"
                render={(value) => value || '--'}
              />

              <Table.Column
                dataIndex="signedAt"
                key="signedAt"
                title="Дата подписания"
                render={(value) => value ? getDateInReadableFormat(value, DATE_FORMAT) : '--'}
              />

              <Table.Column
                dataIndex="expiresAt"
                key="expiresAt"
                title="Дата окончания"
                render={(value) => value ? getDateInReadableFormat(value, DATE_FORMAT) : '--'}
              />

              <Table.Column
                dataIndex="outletId"
                key="outletId"
                title="Привязанная точка продаж (ID)"
                render={(value) => !value ? '--' : <Link to={`/outlets/show/${value}`} target={"_blank"}>{value}</Link>}
              />

              {/*<Table.Column*/}
              {/*  dataIndex="percent"*/}
              {/*  key="percent"*/}
              {/*  title="Проценты"*/}
              {/*  render={(value) => value || '--'}*/}
              {/*/>*/}

              <Table.Column<IContract>
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
                                            resource: "contracts",
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
        </Row>
      </Row>
    </AccessWrapperForPage>
  );
};

const Filter: React.FC<{ formProps: FormProps }> = (props) => {
  const t = useTranslate();

  return (
    <Form className={"width-100-pr"} layout="vertical" {...props.formProps}>
      <Row gutter={[10, 0]} align="bottom" wrap>
        <Col xs={24} xl={6} md={8}>
          <Form.Item label={t("contracts.filter.search.label")} className={"filter-block-without-margin"} name="textSearch">
            <Input
              placeholder={t("contracts.filter.search.placeholder")}
              prefix={<Icons.SearchOutlined />}
            />
          </Form.Item>
        </Col>

        {/*<Col xs={0}  md={0} xl={8} span={8}>*/}
        {/*</Col>*/}

        {/*<Col xs={24} xl={8} md={24} span={8}>*/}
        {/*  <Form.Item label={t("contracts.filter.dates.label")} name="dates">*/}
        {/*    <RangePicker placeholder={["Дата подписания", "Дата окончания"]} className={"width-100-pr"} locale={locale}/>*/}
        {/*  </Form.Item>*/}
        {/*</Col>*/}

        {/*<Col xs={24} xl={8} md={24} span={8}>*/}
        {/*</Col>*/}

        <Col xs={24} xl={6} md={8}>
          <div style={{display: 'flex'}}>
            <Form.Item className={"filter-block-without-margin"} style={{flex: '1', marginRight: '12px'}}>
              <Button
                className={"width-100-pr"}
                htmlType="submit"
                type="primary"
              >
                {t("markets.filter.submit")}
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
    </Form>
  );
};

