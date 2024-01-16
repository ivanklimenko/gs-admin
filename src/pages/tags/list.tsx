import {
  useTranslate,
  IResourceComponentsProps, useDelete, CrudFilters, HttpError
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
  Avatar,
  Grid,
  useDrawerForm,
  FormProps,
  Row,
  Col,
  Card,
  DrawerProps,
  ButtonProps,
  Drawer, Create, CreateButton, Image, Edit, Switch, Radio, Menu, useForm,
} from "@pankod/refine-antd";

import {ICategory, ICategoryFilterVariables} from "interfaces/tags";
import React, {useEffect, useState} from "react";
import {FORM_COMMON_RULES} from "common/constants";
import {UploadArea} from "components/uploadArea";
import {TableMenu} from "components/tableMenu/tableMenu";
import {EUserRole, IUser} from "interfaces/users";
import {EAppResources, EPageActions} from "interfaces/common";
import {CustomBooleanField} from "../../components/customBooleanField";
import { AccessWrapperForPage } from "components/accessWrapper";
import {ColumnsType} from "antd/es/table";
import {IOutlet} from "@interfaces/outlets";
import {Link} from "react-router-dom";
import moment from "moment";
import {EmptyContainer} from "../../components/notFound/NotFound";
import {SortableTable} from "../sortableTable";
import {SortableHandle} from "react-sortable-hoc";
import {MenuOutlined} from "@ant-design/icons";
import { DragHandle } from "components/layout/dragHandle/dragHandle";


export const CategoryList: React.FC<IResourceComponentsProps> = (props) => {

  const [copyMode, setCopyMode] = useState(false);
  const [tags, setTags] = useState<Array<ICategory>>([]);

  const { mutate: mutateDelete } = useDelete();

  const {
    tableProps,
    searchFormProps,
  } = useTable<ICategory, HttpError, ICategoryFilterVariables>({
    initialSorter: [],
    hasPagination: true,
    initialPageSize: 200,
    initialFilter: [{
      field: "type",
      operator: "eq",
      value: props.name === "outletTags" ? "category" : "product",
    }],
    onSearch: (params) => {
      const filters: CrudFilters = [];
      const { textSearch } = params;

      filters.push({
        field: "textSearch",
        operator: "eq",
        value: textSearch,
      });

      return filters;
    },
    resource: "tags",
    dataProviderName: "customProvider"
  });

  const t = useTranslate();

  const {
    drawerProps: createDrawerProps,
    formProps: createFormProps,
    saveButtonProps: createSaveButtonProps,
    show: createShow,
  } = useDrawerForm<IUser>({
    action: "create",
    resource: "tags",
    redirect: false,
    dataProviderName: "customProvider"
  });

  const {
    drawerProps: editDrawerProps,
    formProps: editFormProps,
    saveButtonProps: editSaveButtonProps,
    show: editShow,
  } = useDrawerForm<IUser>({
    action: "edit",
    resource: "tags",
    redirect: false,
    dataProviderName: "customProvider"
  });

  const columns: ColumnsType<ICategory> = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (value) => value
    },
    {
      title: 'Изображение',
      dataIndex: 'imagePNG',
      render: (value, record: ICategory) => (<div className={"preview-entity-title"}>
        {record?.useEmoji ? (<div style={{fontSize: '20px'}}>{record?.emoji}</div>) : (
          <Avatar shape="square" className={"table-preview-image"}
                  src={<Image src={record?.imagePNG || undefined}/>}/>
        )}
      </div>)
    },
    {
      title: 'Название',
      dataIndex: 'title',
      render: (value) => value
    },
    {
      title: 'Активность',
      dataIndex: 'isActive',
      render: (value) => <CustomBooleanField value={value} />
    },
    {
      title: 'Действия',
      fixed: 'right',
      dataIndex: 'actions',
      key: 'actions',
      align: 'center',
      render: (_text, record) => {
        return (
          <Dropdown
            overlay={<TableMenu record={record} resourceName={"tags"}
                                cloneItem={() => {
                                  editShow(record.id)
                                  setCopyMode(true)
                                }}
                                deleteItem={() => {
                                  mutateDelete({
                                    resource: "tags",
                                    id: record.id,
                                    mutationMode: "undoable",
                                  });
                                }}
                                setEdit={() => editShow(record.id)} fullPageMenu={false}/>}
            trigger={["click"]}
          >
            <Icons.MoreOutlined className={"table-dropdown-icon"}/>
          </Dropdown>
        );
      }
    },
  ];

  const { onFinish } = useForm({
    resource: "tags/sort",
    action: "edit",
    dataProviderName: "customProvider",
    redirect: false
  });

  const handleTagsSort = (sortedTags: Array<ICategory>) => {
    onFinish(sortedTags.map(p => `${p.id}`))
      .then(() => {
        //console.log('handleOutletSort', sortedProducts)
        setTags(sortedTags)
      })
      .catch(() => {
        //setSortableCategoryId(null);
      })
  }

  return (
    <AccessWrapperForPage resource={props.name === EAppResources.OUTLET_TAGS ? EAppResources.OUTLET_TAGS : EAppResources.PRODUCT_TAGS} action={EPageActions.LIST}>
      <Row gutter={[0, 16]} wrap={false} className={"flex-column"}>
        <Row gutter={[0, 16]}>
          <Card title={""} className={"width-100-pr"}>
            <Filter formProps={searchFormProps} />
          </Card>
        </Row>
        <Row gutter={[0, 16]}>
          <List  pageHeaderProps={{
            style: {width: '100%'},
            extra: (
              <CreateButton onClick={() => createShow()}>
                {t("buttons.create")}
              </CreateButton>
            )
          }}>
            {!tableProps?.dataSource?.length ? (
              <EmptyContainer/>
            ) : (
              <>
                {/*@ts-ignore */}
                <SortableTable items={tags?.length ? tags : tableProps.dataSource}
                               columns={[ {
                                 title: '',
                                 dataIndex: 'sort',
                                 sortOrder: "ascend",
                                 render: () => <DragHandle />,
                               }, ...columns]}
                               onChange={handleTagsSort}
                               loading={false}/>

              </>
            )}
          </List>
        </Row>

        <CreateTag
          drawerProps={createDrawerProps}
          formProps={{
            ...createFormProps,
            initialValues: {
              ...createFormProps,
              type: props.name === "outletTags" ? "category" : "product",
            }
          }}
          saveButtonProps={createSaveButtonProps}
        />

        <EditTag
          copyMode={copyMode}
          drawerProps={{
            ...editDrawerProps,
            onClose: (e) => {
              editDrawerProps?.onClose?.(e)
              setCopyMode(false)
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
        <Col xs={24} xl={8} md={8}>
          <Form.Item label={t("tags.filter.search.label")} name="textSearch"
                     className={"filter-block-without-margin"}>
            <Input
              placeholder={t("tags.filter.search.placeholder")}
              prefix={<Icons.SearchOutlined />}
            />
          </Form.Item>
        </Col>

        <Col xs={24} xl={8} md={8}>
          <div style={{display: 'flex'}}>
            <Form.Item className={"block-without-margin"} style={{flex: '1', marginRight: '12px'}}>
              <Button
                className={"width-100-pr"}
                htmlType="submit"
                type="primary"
              >
                {t("outlets.filter.submit")}
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



type FormTagProps = {
  drawerProps?: DrawerProps;
  formProps: FormProps;
  saveButtonProps?: ButtonProps;
  copyMode?: boolean;
  createMode?: boolean
};

export const CreateTag: React.FC<FormTagProps> = ({
                                                        drawerProps,
                                                        formProps,
                                                        saveButtonProps,
                                                      }) => {
  const t = useTranslate();
  const breakpoint = Grid.useBreakpoint();


  return (
    <Drawer
      {...drawerProps}
      width={breakpoint.sm ? "500px" : "100%"}
      bodyStyle={{padding: 0}}
      className={"action-drawer-layout"}
      zIndex={501}
    >
      <Create resource="tags"
              pageHeaderProps={{extra: null, breadcrumb: undefined}}
              title={t("tags.create")}
              saveButtonProps={saveButtonProps}>

        <TagForm formProps={formProps} createMode={true} copyMode={false}/>
      </Create>
    </Drawer>
  );
};


export const EditTag: React.FC<FormTagProps> = ({
                                                    drawerProps,
                                                    formProps,
                                                    saveButtonProps,
                                                  copyMode= false
                                                  }) => {
  const t = useTranslate();
  const breakpoint = Grid.useBreakpoint();

  return (
    <Drawer
      {...drawerProps}
      width={breakpoint.sm ? "500px" : "100%"}
      bodyStyle={{padding: 0}}
      className={"action-drawer-layout"}
      zIndex={501}
    >
      <Edit resource="tags"
            pageHeaderProps={{extra: null, breadcrumb: undefined}}
            title={t("tags.edit")}
            saveButtonProps={saveButtonProps}>

          <TagForm formProps={formProps} createMode={false} copyMode={copyMode}/>
      </Edit>
    </Drawer>
  );
};


const TagForm: React.FC<FormTagProps> = ({ formProps, copyMode, createMode }) => {
  const t = useTranslate();
  const [type, setType] = useState<boolean>(createMode || !!formProps.initialValues?.useEmoji);

  useEffect(() => {
    setType(createMode || !!formProps.initialValues?.useEmoji)
  }, [formProps.initialValues])

  return (
    <Form
      {...formProps}
      initialValues={{
        ...formProps.initialValues,
        useEmoji: createMode || !!formProps.initialValues?.useEmoji
      }}
      onFieldsChange={(changedFields) => {
        // @ts-ignore
        if (changedFields.length && changedFields[0]?.name?.length && changedFields[0].name.includes("useEmoji")) {
          setType(!!changedFields[0]?.value)
        }
      }}
      onFinish={(values) => {
        let requestValues = !copyMode ? values : {
          ...values,
          isActive: !!values.isActive,
          sourceId: formProps?.initialValues?.id,
          copy: !!formProps?.initialValues?.id,
        };

        ["imagePNG"].forEach((f)=> {
          // @ts-ignore
          if (formProps.initialValues?.[f] === values?.[f]) {
            // @ts-ignore
            delete requestValues[f]
          } else {
            requestValues = {
              ...requestValues,
              // @ts-ignore
              [f]: values?.[f]?.length ? values[f][0].originFileObj : null,
            }
          }
        })

        if (formProps.onFinish) {
          formProps?.onFinish(requestValues);
          formProps.form?.resetFields();
        }

      }}
      layout="vertical"
    >

      {(!createMode && !copyMode) && (
        <Form.Item
          hidden={true}
          name="id"
        >
        </Form.Item>
      )}

      <Form.Item
        hidden={true}
        name="sort"
      >
      </Form.Item>

      <Form.Item
        hidden={true}
        name="type"
      >
      </Form.Item>

      {/*<Form.Item*/}
      {/*  label={"Изображение"}*/}
      {/*  name="useEmoji"*/}
      {/*  valuePropName="checked"*/}
      {/*>*/}
      {/*  <Switch size={"small"}/>*/}
      {/*</Form.Item>*/}

      <Form.Item name="useEmoji" label="Тип изображения"
                 rules={[...FORM_COMMON_RULES]}>
        <Radio.Group>
          <Radio value={true}>Эмодзи</Radio>
          <Radio value={false}>Изображение</Radio>
        </Radio.Group>
      </Form.Item>

      {type ? (
        <Form.Item
          label="Код эмодзи"
          name="emoji"
          rules={[...FORM_COMMON_RULES]}
        >
          <Input type={"text"}/>
        </Form.Item>

      ) : (
        <Form.Item label={t("tags.fields.image")}>
          <Form.Item className={"required-field"} name="imagePNG" valuePropName="fileList"
                     rules={[...FORM_COMMON_RULES]}
                     getValueFromEvent={(e: any) => {
                       return Array.isArray(e) ? e : e?.fileList
                     }}
                     noStyle>
            <UploadArea name={"imagePNG"}/>
          </Form.Item>
        </Form.Item>
      )}



      <Form.Item
        label={t("tags.fields.title")}
        name="title"
        rules={[...FORM_COMMON_RULES]}
      >
        <Input type={"text"}/>
      </Form.Item>

      <Form.Item
        label={t("tags.fields.isActive")}
        name="isActive"
        valuePropName="checked"
      >
        <Switch size={"small"}/>
      </Form.Item>


    </Form>
  )
}
