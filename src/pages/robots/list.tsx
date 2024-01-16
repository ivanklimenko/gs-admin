import {
  CrudFilters,
  GetListResponse,
  HttpError,
  IResourceComponentsProps,
  useDelete,
  usePermissions,
  useTranslate
} from "@pankod/refine-core";
import {Col, Dropdown, Icons, List, Row, Table, useTable,} from "@pankod/refine-antd";

import {IRobot, IRobotFilterVariables} from "interfaces/robots";
import {TableMenu} from "components/tableMenu/tableMenu";
import React from "react";
import {Link} from "react-router-dom";
import {CustomBooleanField} from "../../components/customBooleanField";
import {AccessWrapperForPage} from "components/accessWrapper";
import {EAppResources, EPageActions} from "interfaces/common";


export const RobotList: React.FC<
  IResourceComponentsProps<GetListResponse<IRobot>>
> = ({ initialData }) => {
  const t = useTranslate();
  const { mutate: mutateDelete } = useDelete();
  const { data: permissions } = usePermissions<string>();

  const { tableProps } = useTable<IRobot, HttpError, IRobotFilterVariables>({
    queryOptions: {
      initialData,
    },
    resource: "timetables",
    dataProviderName: "customProvider",
    hasPagination: true,
    initialPageSize: 10,

    initialFilter: [{
      field: "isNetwork",
      operator: "eq",
      value: true,
    }],

    onSearch: (params) => {
      const filters: CrudFilters = [];
      const { textSearch } = params;

      filters.push({
        field: "textSearch",
        operator: "eq",
        value: textSearch,
      });

      // filters.push({
      //   field: "type",
      //   operator: "eq",
      //   value: type,
      // });

      return filters;
    },
    syncWithLocation: false,
  });

  return (
    <AccessWrapperForPage resource={EAppResources.TIMETABLES} action={EPageActions.LIST}>
      <Row gutter={[16, 16]}>
        {/*<Col xl={6} lg={24} xs={24}>*/}
        {/*  <Card title={t("markets.filter.title")}>*/}
        {/*    <Filter formProps={searchFormProps} />*/}
        {/*  </Card>*/}
        {/*</Col>*/}
        <Col xl={24} xs={24}>
          <List>
            <Table rowKey="id" {...tableProps}>
              <Table.Column
                dataIndex="id"
                key="id"
                title="ID"
                render={(value) => value}
              />
              <Table.Column<IRobot>
                dataIndex="name"
                key="name"
                title="Название"
                render={(value, record) => <Link to={`/timetables/show/${record.id}`}>{value}</Link>}
              />

              {/*<Table.Column*/}
              {/*  dataIndex="type"*/}
              {/*  key="type"*/}
              {/*  title="Тип"*/}
              {/*  render={(value) => value}*/}
              {/*/>*/}

              {/*<Table.Column<IRobot>*/}
              {/*  dataIndex="startTime"*/}
              {/*  key="startTime"*/}
              {/*  title="Время запуска"*/}
              {/*  render={(value) => value}*/}
              {/*/>*/}

              {/*<Table.Column*/}
              {/*  dataIndex="sequenceId"*/}
              {/*  key="sequenceId"*/}
              {/*  title="ID в очереди"*/}
              {/*  render={(value) => value}*/}
              {/*/>*/}

              <Table.Column
                dataIndex="isActive"
                key="isActive"
                title="Активность"
                render={(value) => <CustomBooleanField value={value}/>}
              />

              <Table.Column<IRobot>
                fixed="right"
                title={t("table.actions")}
                dataIndex="actions"
                key="actions"
                align="center"
                render={(_, record) => (
                  <Dropdown
                    overlay={<TableMenu record={record}
                                        fullPageMenu={true}
                                        showCloneButton={false}
                                        deleteItem={() => {
                                          mutateDelete({
                                            resource: "timetables",
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

// const Filter: React.FC<{ formProps: FormProps }> = (props) => {
//   const t = useTranslate();
//
//   return (
//     <Form layout="vertical" {...props.formProps}>
//       <Row gutter={[10, 0]} align="bottom">
//         <Col xs={24} xl={24} md={8}>
//           <Form.Item label={t("timetables.filter.search.label")} name="textSearch">
//             <Input
//               placeholder={t("timetables.filter.search.placeholder")}
//               prefix={<Icons.SearchOutlined />}
//             />
//           </Form.Item>
//         </Col>
//         {/*<Col xs={24} xl={24} md={8}>*/}
//         {/*  <Form.Item*/}
//         {/*    label={t("timetables.filter.type.label")}*/}
//         {/*    name="type"*/}
//         {/*  >*/}
//         {/*    <Select*/}
//         {/*      allowClear*/}
//         {/*      placeholder={t("markets.filter.isActive.placeholder")}*/}
//         {/*      options={ROBOT_TYPES}*/}
//         {/*    />*/}
//         {/*  </Form.Item>*/}
//         {/*</Col>*/}
//         <Col xs={24} xl={24} md={8}>
//           <div style={{display: 'flex'}}>
//             <Form.Item style={{flex: '1', marginRight: '12px'}}>
//               <Button
//                 className={"width-100-pr"}
//                 htmlType="submit"
//                 type="primary"
//               >
//                 {t("outlets.filter.submit")}
//               </Button>
//             </Form.Item>
//
//             <Form.Item>
//               <Button
//                 className={"width-100-pr"}
//                 htmlType="button"
//                 onClick={() => {
//                   props.formProps?.form?.resetFields()
//                   props.formProps?.form?.submit()
//                 }}
//               >
//                 <Icons.CloseOutlined />
//               </Button>
//             </Form.Item>
//           </div>
//
//         </Col>
//
//       </Row>
//     </Form>
//   );
// };

