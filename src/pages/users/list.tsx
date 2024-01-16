import React, {useState} from "react";
import {
  IResourceComponentsProps,
  GetListResponse,
  CrudFilters,
  HttpError,
  useTranslate, useDelete, usePermissions, CanAccess
} from "@pankod/refine-core";
import {
  List,
  Table,
  useTable,
  getDefaultSortOrder,
  Icons,
  Dropdown,
  Select,
  Card,
  Input,
  Form,
  FormProps,
  Row,
  Col, useDrawerForm, CreateButton, Tag, BooleanField, Button
} from "@pankod/refine-antd";

import {EUserRole, IUser, IUserFilterVariables, USER_ROLES} from "interfaces/users";
import {CreateUser} from "components/users/create";
import {EditUser} from "components/users/edit";
import {getRoleTranscriptionValue} from "../../utils";
import {TableMenu} from "../../components/tableMenu/tableMenu";
import {CustomBooleanField} from "../../components/customBooleanField";
import {EAppResources, EPageActions} from "interfaces/common";
import { AccessWrapperForPage } from "components/accessWrapper";

const { FormOutlined } = Icons;


export const UserList: React.FC<
  IResourceComponentsProps<GetListResponse<IUser>>
> = ({ initialData }) => {

  const t = useTranslate();
  const { mutate: mutateDelete } = useDelete();
  const { data: permissions } = usePermissions<string>();

  const [showMode, setShowMode] = useState(false);

  const { tableProps, sorter, searchFormProps } = useTable<IUser, HttpError, IUserFilterVariables>({
    dataProviderName: "customProvider",
    hasPagination: true,
    initialPageSize: 30,
    queryOptions: {
      initialData,
    },
    onSearch: (params) => {
      const filters: CrudFilters = [];
      const { textSearch, role } = params;

      filters.push({
        field: "textSearch",
        operator: "eq",
        value: textSearch,
      });

      filters.push({
        field: "role",
        operator: "eq",
        value: role,
      });

      return filters;
    },
    syncWithLocation: false,
  });

  const {
    drawerProps: createDrawerProps,
    formProps: createFormProps,
    saveButtonProps: createSaveButtonProps,
    show: createShow,
  } = useDrawerForm<IUser>({
    action: "create",
    resource: "users",
    redirect: "list",
  });

  const {
    drawerProps: editDrawerProps,
    formProps: editFormProps,
    saveButtonProps: editSaveButtonProps,
    show: editShow,
  } = useDrawerForm<IUser>({
    action: "edit",
    resource: "users",
    redirect: "list",
    dataProviderName: "customProvider"
  });

  return (
    <AccessWrapperForPage resource={EAppResources.USERS} action={EPageActions.LIST}>
      <Row gutter={[0, 16]} wrap={false} className={"flex-column"}>
        <Row gutter={[0, 16]}>
          <Card title={t("users.filter.title")} className={"width-100-pr"}>
            <Filter formProps={searchFormProps} />
          </Card>
        </Row>
        <Row gutter={[0, 16]}>
          <List canCreate={permissions?.includes(EUserRole.ADMIN)} pageHeaderProps={{
            style: {width: '100%'},
            extra: (
              <CreateButton onClick={() => createShow()}>
                {t("buttons.create")}
              </CreateButton>
            )
          }}>
            <Table rowKey="id" {...tableProps} >
              <Table.Column
                dataIndex="id"
                key="id"
                title="ID"
                render={(value) => value}
              />

              <Table.Column<IUser>
                dataIndex="username"
                key="username"
                title="Логин"
                render={(value) => value || '--'}
              />

              <Table.Column<IUser>
                dataIndex="firstName"
                key="firstName"
                title="Имя"
                render={(value) => value || '--'}
              />

              <Table.Column
                dataIndex="lastName"
                key="lastName"
                title="Фамилия"
                render={(value) => value || '--'}
              />

              <Table.Column
                dataIndex="email"
                key="email"
                title="Email"
                render={(value) => value}
              />

              <Table.Column
                dataIndex="phone"
                key="phone"
                title="Телефон"
                render={(value) => value}
              />

              <Table.Column
                dataIndex="isActive"
                key="isActive"
                title="Активность"
                render={(value) => <CustomBooleanField value={value}/>}
              />

              <Table.Column
                dataIndex="roles"
                key="roles"
                title="Роль"
                render={(roles) => (<>{roles?.map((r:string) => <Tag>
                  {t(`users.fields.role.${getRoleTranscriptionValue(r|| "none")}`)}
                </Tag>)}</>)}
              />

              <Table.Column<IUser>
                fixed="right"
                title={t("table.actions")}
                dataIndex="actions"
                key="actions"
                align="center"
                render={(_, record) => (
                  <Dropdown
                    overlay={<TableMenu record={record}
                                        showShowButton={true}
                                        fullPageMenu={false}
                                        showCloneButton={false}
                                        showDeleteButton={false}
                                        deleteItem={() => {
                                          mutateDelete({
                                            resource: "users",
                                            id: record.id,
                                            mutationMode: "undoable",
                                          });
                                        }}
                                        showItem={(id) => {
                                          editShow(id)
                                          setShowMode(true)
                                        }}
                                        setEdit={(id) => editShow(id)}/>}
                    trigger={["click"]}
                  >
                    <Icons.MoreOutlined className={"table-dropdown-icon"}/>
                  </Dropdown>
                )}
              />

            </Table>
          </List>
        </Row>

        <CreateUser
          drawerProps={createDrawerProps}
          formProps={createFormProps}
          saveButtonProps={createSaveButtonProps}
        />

        <EditUser
          showMode={showMode}
          drawerProps={{
            ...editDrawerProps,
            onClose: (e) => {
              editDrawerProps?.onClose?.(e);
              setShowMode(false)
            }
          }}
          formProps={editFormProps}
          saveButtonProps={editSaveButtonProps}
        />
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
          <Form.Item label={t("users.filter.search.label")} name="textSearch" className={"filter-block-without-margin"}>
            <Input
              placeholder={t("users.filter.search.placeholder")}
              prefix={<Icons.SearchOutlined />}
            />
          </Form.Item>
        </Col>
        <Col xs={24} xl={6} md={8}>
          <Form.Item
            label={t("users.filter.role.label")}
            name="role"
            className={"filter-block-without-margin"}
          >
            <Select
              allowClear
              placeholder={t("users.filter.role.placeholder")}
              options={USER_ROLES.map(r => ({
                label: t(`users.fields.role.${r.label_key}`),
                value: r.value
              }))}
            />
          </Form.Item>
        </Col>

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

