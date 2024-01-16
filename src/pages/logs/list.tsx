import {useTranslate, IResourceComponentsProps, HttpError, CrudFilters, GetListResponse} from "@pankod/refine-core";

import {
  List,
  Table,
  useTable,
  BooleanField,
  Form,
  Input,
  Dropdown,
  Icons,
  Menu,
  Grid,
  FormProps, Row, Col, Select, Card, Drawer, Descriptions
} from "@pankod/refine-antd";

import React, {useState} from "react";
import "moment/locale/ru";
import {DATE_FORMAT} from "../../common/constants";
import {IILogItemFilterVariables, ILogItem} from "interfaces/logs";
import moment from "moment";
import {CustomBooleanField} from "../../components/customBooleanField";

export const LogList: React.FC<IResourceComponentsProps<GetListResponse<ILogItem>>> = ({ initialData }) => {

  const t = useTranslate();

  const [selectLogItem, setSelectLogItem] = useState<ILogItem | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);

  const { tableProps, searchFormProps } = useTable<ILogItem, HttpError, IILogItemFilterVariables>({
    dataProviderName: "customProvider",
    hasPagination: true,
    initialPageSize: 10,
    queryOptions: {
      initialData,
    },
    onSearch: (params) => {
      const filters: CrudFilters = [];
      const { textSearch, type, sourceOfChange } = params;

      filters.push({
        field: "textSearch",
        operator: "eq",
        value: textSearch,
      });

      filters.push({
        field: "type",
        operator: "eq",
        value: type,
      });

      filters.push({
        field: "sourceOfChange",
        operator: "eq",
        value: sourceOfChange,
      });

      return filters;
    },
    syncWithLocation: false,
  });

  const moreMenu = (record: ILogItem) => (
    <Menu mode="vertical" >
      <Menu.Item
        key="1"
        className={"table-menu-item"}
        icon={<Icons.EyeOutlined className={"menu-item-icon"}/>}
        onClick={() => {
          setSelectLogItem(record);
          setShowDrawer(true)
        }}
      >
        {/*<ShowButton hideText size="small" recordItemId={id} />*/}
        {t("buttons.show")}
      </Menu.Item>
    </Menu>
  );

  const handleCloseDrawer = () => {
    setShowDrawer(false)
    setSelectLogItem(null)
  }


  const data = [{
    "id": 3,
    "title": "Элемент 1",
    "isActive": false,
    "type": "Продукт",
    "sourceOfChange": "Админ.панель",
    "initiator": "--",
    "datetime": "2022-06-23"
  }, {
    "id": 4,
    "title": "Элемент 4",
    "isActive": true,
    "type": "Точка продаж",
    "sourceOfChange": "API",
    "initiator": "--",
    "datetime": "2021-03-23"
  }]

  return (

    <Row gutter={[16, 16]} wrap={false} className={"flex-column"}>
      <Row gutter={[0, 16]}>
        <Card title={t("markets.filter.title")} className={"width-100-pr"}>
          <Filter formProps={searchFormProps} />
        </Card>
      </Row>
      <Row gutter={[0, 16]}>
        <List pageHeaderProps={{
          style: {width: '100%'}
        }}>
          <Table rowKey="id" {...tableProps} dataSource={data} >
            <Table.Column
              dataIndex="id"
              key="id"
              title="ID"
              render={(value) => value}
            />

            <Table.Column<ILogItem>
              dataIndex="title"
              key="title"
              title="Название"
              render={(value) => value || '--'}
            />

            <Table.Column<ILogItem>
              dataIndex="type"
              key="type"
              title="Тип"
              render={(value) => value || '--'}
            />

            <Table.Column
              dataIndex="datetime"
              key="datetime"
              title="Время создания"
              render={(value) => moment(value, DATE_FORMAT).format("DD MMMM YYYY, HH:mm:ss")}
            />

            <Table.Column
              dataIndex="sourceOfChange"
              key="sourceOfChange"
              title="Источник изменения"
              render={(value) => value || '--'}
            />

            <Table.Column
              dataIndex="initiator"
              key="initiator"
              title="Инициатор изменения"
              render={(value) => value || '--'}
            />

            <Table.Column
              dataIndex="isActive"
              key="isActive"
              title="Активность"
              render={(value) => <CustomBooleanField value={value} />}
            />

            <Table.Column<ILogItem>
              fixed="right"
              title={t("table.actions")}
              dataIndex="actions"
              key="actions"
              align="center"
              render={(_, record) => (
                <Dropdown
                  overlay={moreMenu(record)}
                  trigger={["click"]}
                >
                  <Icons.MoreOutlined className={"table-dropdown-icon"}/>
                </Dropdown>
              )}
            />
          </Table>
        </List>

        <LogItemDrawer visible={showDrawer} onClose={handleCloseDrawer} initialValues={selectLogItem || null}/>
      </Row>
    </Row>

  );
};


const Filter: React.FC<{ formProps: FormProps }> = (props) => {
  const t = useTranslate();

  return (
    <Form className={"width-100-pr"} layout="vertical" {...props.formProps}>
      <Row gutter={[10, 0]} align="bottom">
        <Col xs={24} xl={8} md={8}>
          <Form.Item label={t("logs.filter.search.label")} name="textSearch">
            <Input
              placeholder={t("logs.filter.search.placeholder")}
              prefix={<Icons.SearchOutlined />}
            />
          </Form.Item>
        </Col>

        <Col xs={24} xl={4} md={4} span={4}>
        </Col>

        <Col xs={24} xl={6} md={6} span={6}>
          <Form.Item
            label={t("logs.filter.type.label")}
            name="type"
          >
            <Select
              allowClear
              placeholder={t("logs.filter.type.placeholder")}
              options={[]}
            />
          </Form.Item>
        </Col>

        <Col xs={24} xl={6} md={6} span={6}>
          <Form.Item
            label={t("logs.filter.sourceOfChange.label")}
            name="type"
          >
            <Select
              allowClear
              placeholder={t("logs.filter.sourceOfChange.placeholder")}
              options={[]}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};


const LogItemDrawer: React.FC<{visible: boolean, initialValues: ILogItem | null, onClose: any, onChange?: any}> =
  ({visible, initialValues, onClose}) => {
    const t = useTranslate();
    const breakpoint = Grid.useBreakpoint();

    return (
      <Drawer
        visible={visible}
        onClose={onClose}
        width={breakpoint.sm ? "500px" : "100%"}
        bodyStyle={{padding: 0}}
        zIndex={1001}
      >
        <div className="ant-page-header has-breadcrumb ant-page-header-compact">

          <Descriptions title="" column={1} size={"middle"} style={{padding: 0}}>
            <Descriptions.Item label={t("logs.fields.id")}>
              {initialValues?.id || "--"}
            </Descriptions.Item>

            <Descriptions.Item label={t("logs.fields.title")}>
              {initialValues?.title || "--"}
            </Descriptions.Item>

            <Descriptions.Item label={t("logs.fields.datetime")}>
              {!initialValues?.datetime ? '--' : moment(initialValues?.datetime, DATE_FORMAT).format("DD MMMM YYYY, HH:mm:ss")}
            </Descriptions.Item>

            <Descriptions.Item label={t("logs.fields.type")}>
              {initialValues?.type || "--"}
            </Descriptions.Item>

            <Descriptions.Item label={t("logs.fields.isActive")}>
              <CustomBooleanField value={!!initialValues?.isActive}/>
            </Descriptions.Item>

            <Descriptions.Item label={t("logs.fields.sourceOfChange")}>
              {initialValues?.sourceOfChange || "--"}
            </Descriptions.Item>

            <Descriptions.Item label={t("logs.fields.initiator")}>
              {initialValues?.initiator || "--"}
            </Descriptions.Item>
          </Descriptions>
        </div>

      </Drawer>
    )
  }
