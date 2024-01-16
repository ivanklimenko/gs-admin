import React, {useEffect, useState} from "react";
import {useList, useTranslate} from "@pankod/refine-core";
import {
  Avatar,
  Button,
  Card,
  Col, Drawer, Dropdown,
  Form, FormProps, Grid, Icons,
  Image,
  Input, Modal,
  Row,
  Select, Table,
  Typography, useForm
} from "@pankod/refine-antd";
import {ICategory, ILocalCategory} from "interfaces/tags";
import {TableMenu} from "../tableMenu/tableMenu";
import {FORM_COMMON_RULES} from "../../common/constants";
import {FileRenderPreview, UploadArea, UploadButton} from "../uploadArea";
import {ColumnsType} from "antd/es/table";
import {EmptyContainer} from "../notFound/NotFound";
import {SortableTable} from "../../pages/sortableTable";
import {DragHandle} from "../layout/dragHandle/dragHandle";

type FormCategoriesTableProps = {
  formProps: FormProps;
  readonlyMode?: boolean;
  isCopyMode?: boolean;
  setDeletedCategories: (a: Array<ILocalCategory>) => void,
};

const { confirm } = Modal;


export const CategoriesTable: React.FC<FormCategoriesTableProps> = ({ formProps, isCopyMode, readonlyMode, setDeletedCategories }) => {
  const t = useTranslate();

  const [selectCategory, setSelectCategory] = useState<ILocalCategory | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);

  const [localCategories, setLocalCategories] = useState<Array<ILocalCategory>>([])

  useEffect(() => {
    if (formProps?.initialValues?.categories) {
      setLocalCategories(formProps.initialValues.categories)
    }
  }, [formProps.initialValues])

  useEffect(() => {
    if (formProps?.form) {
      formProps.form.setFieldsValue({
        categories: localCategories
      })
    }
  }, [formProps, localCategories]);

  const handleCloseDrawer = () => {
    setShowDrawer(false)
    setSelectCategory(null)
  }

  const _changeCategory = (values: ILocalCategory) => {
    setLocalCategories(categories => categories.map(c => (c.id !== values.id) ? c : {
      ...c,
      ...values
    }));
  }

  const _addCategory = () => {
    setShowDrawer(true)
    setSelectCategory({
      id: localCategories.length + 1 + '_temp',
      title: '',
      tagId: null
    })
  }

  const _deleteCategory = (record: ILocalCategory) => {
    if (!`${record.id}`.includes('temp')) {
      const dCategories = localCategories.filter(g => g.id === record.id)
      setDeletedCategories(dCategories.map(dC => ({...dC, delete: true})))
    }
    setLocalCategories(categories => categories.filter(c => c.id !== record.id))
  }

  const showConfirm = (newData: Array<ICategory>) => {
    confirm({
      title: 'Вы точно хотите изменить порядок категорий?',
      icon: <Icons.ExclamationCircleOutlined />,
      content: '',
      okText: 'Да, подтверждаю',
      okType: 'danger',
      cancelText: 'Нет',
      onOk() {
        handleTagsSort(newData)
      },
      onCancel() {
        //console.log('Cancel');
      },
    });
  };

  const { onFinish } = useForm({
    resource: "categories/sort",
    action: "edit",
    dataProviderName: "customProvider",
    redirect: false
  });

  const handleTagsSort = (sortedTags: Array<ICategory>) => {
    onFinish(sortedTags.map(p => `${p.id}`))
      .then(() => {
        //console.log('handleOutletSort', sortedProducts)
        setLocalCategories(sortedTags)
      })
      .catch(() => {
        //setSortableCategoryId(null);
      })
  }

  const columns: ColumnsType<ILocalCategory> = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (value) => value
    },
    {
      title: 'Изображение',
      dataIndex: 'imagePNG',
      render: (value, record: ILocalCategory) => (
        record?.useEmoji ? (<div style={{fontSize: '20px'}}>{record?.emoji}</div>) : (
          <div className={"preview-entity-title"}><Avatar shape="square" className={"table-preview-image"} src={<Image src={record?.imagePNG || undefined} />} /></div>
        )
      )
    },
    {
      title: 'Название',
      dataIndex: 'title',
      render: (value) => value
    },
    {
      title: 'Родительский тег',
      dataIndex: 'tagId',
      render: (value, record: ILocalCategory) => {
        return record?.tag?.title;
      }
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
            overlay={<TableMenu record={record}
                                disabled={readonlyMode}
                                setEdit={() => {
                                  setShowDrawer(true)
                                  setSelectCategory(record)
                                }}
                                showDeleteButton={!isCopyMode || (isCopyMode && `${record?.id}`?.includes('temp'))}
                                deleteItem={() => _deleteCategory(record)}
                                showCloneButton={false}
                                fullPageMenu={false}/>
            }
            trigger={["click"]}
          >
            <Icons.MoreOutlined className={"table-dropdown-icon"}/>
          </Dropdown>
        );
      }
    },
  ];

  return (
    <Card className={"card-block-with-margin"}>
      <Row className={"card-block-with-margin"} justify={"space-between"}>
        <Col className={readonlyMode ? "" : "required-field"}>
          <Typography.Text strong={true} className={"card-title"}>
            Категории товаров
          </Typography.Text>

        </Col>
        <Col>
          <Button
            disabled={readonlyMode}
            onClick={() => {
              _addCategory();
            }}
            type="primary"
          >
            {t("buttons.add")}
          </Button>
        </Col>
      </Row>

      {!localCategories.length ? (
        <EmptyContainer/>
      ) : (
        <>
          {readonlyMode ? (
            <>
              {/*@ts-ignore */}
              <SortableTable items={localCategories}
                             columns={[ {
                               title: '',
                               dataIndex: 'sort',
                               sortOrder: "ascend",
                               render: () => <DragHandle />,
                             }, ...columns]}
                             onChange={showConfirm}
                             loading={false}/>
            </>
          ) : (
            <Table
              dataSource={localCategories}
              pagination={false}
              rowKey="id"
              columns={columns}
              onRow={(record) => ({
                onClick: (event: any) => {
                  if (event.target.nodeName === "TD") {
                    setSelectCategory && setSelectCategory(record);
                  }
                },
              })}
            >
            </Table>
          )}
        </>
      )}



      <CategoryDrawer visible={showDrawer}
                   onClose={handleCloseDrawer}
                   initialValues={selectCategory || null}
                   onChange={(values: any, createMode = false) => {
                     handleCloseDrawer();
                     if (createMode) {
                       setLocalCategories(cat => [...cat, values]);
                       return;
                     }
                     _changeCategory(values)
                   }}
      />
    </Card>
  )
}



const CategoryDrawer: React.FC<{visible: boolean, initialValues: ILocalCategory | null, onClose: any, onChange?: any}> =
  ({visible, initialValues, onChange, onClose}) => {
    const t = useTranslate();
    const breakpoint = Grid.useBreakpoint();

    const [searchTagValue, setSearchTagValue] = useState('');
    const [selectParentTag, setSelectParentTag] = useState<ICategory | null>(null);

    const [form] = Form.useForm();

    useEffect(() => {
      return () => {
        form.resetFields();
        setSelectParentTag(null)
        setSearchTagValue('')
      }
    }, [form])

    useEffect(() => {
      if (initialValues?.tag) {
        setSelectParentTag(initialValues?.tag || null)
      }
      form.setFieldsValue(initialValues)
    }, [initialValues])

    const categoryTagsSelectProps = useList<ICategory>({
      resource: "tags",
      dataProviderName: "autocompleteProvider",
      config: {
        filters: [{
          field: "title_like",
          operator: "eq",
          value: searchTagValue,
        }, {
          field: "type",
          operator: "eq",
          value: "category",
        }]
      }
    });

    return (
      <Drawer
        visible={visible}
        onClose={() => {
          form.resetFields();
          setSelectParentTag(null)
          setSearchTagValue('')
          onClose()
        }}
        className={"action-drawer-layout"}
        width={breakpoint.sm ? "500px" : "100%"}
        bodyStyle={{padding: 0}}
        zIndex={1001}
        destroyOnClose={true}
      >
        <div className="ant-page-header has-breadcrumb ant-page-header-compact" style={{paddingBottom: '48px'}}>
          <Form form={form}
                onFinish={(values) => {
                  if (`${values.id}`.includes('temp')) {
                    onChange({...values, imagePNG: selectParentTag?.imagePNG}, `${values.id}`.includes('temp'))
                  } else {
                    onChange({...values, imagePNG: selectParentTag?.imagePNG || initialValues?.imagePNG}, `${values.id}`.includes('temp'))
                  }

                }}
                layout="vertical"
                initialValues={initialValues || undefined}
          >

            <Form.Item
              hidden={true}
              name="id"
            >
            </Form.Item>

            <Form.Item
              hidden={true}
              name="tag"
            >
            </Form.Item>

            {selectParentTag?.useEmoji ? (
              <Form.Item label={"Эмодзи"}>
                <Input name={"imagePNG"} value={selectParentTag?.emoji} readOnly={true} bordered={false}/>
              </Form.Item>
            ) : (
              <>
                {initialValues?.imagePNG ? (
                  <div style={{height: '166px', marginBottom: '16px'}}>
                    <FileRenderPreview readonlyMode={true} url={initialValues?.imagePNG || ''} actions={{}}/>
                  </div>
                ) : (
                  <>
                    {selectParentTag?.imagePNG && (
                      <div style={{height: '166px', marginBottom: '16px'}}>
                        <FileRenderPreview readonlyMode={true} url={selectParentTag?.imagePNG || ''} actions={{}}/>
                      </div>
                    )}
                  </>
                )}
              </>

              // <Form.Item label={t("tags.fields.image")}>
              //   <Form.Item name="imagePNG" valuePropName="fileList"
              //              noStyle>
              //     <UploadArea name={"imagePNG"} readonlyMode={true}/>
              //   </Form.Item>
              // </Form.Item>
            )}


            <Form.Item
              label={t("tags.fields.title")}
              name="title"
              rules={[...FORM_COMMON_RULES]}
            >
              <Input type={"text"}/>
            </Form.Item>

            <Form.Item
              name="tagId"
              label={t("tags.fields.parent")}
              rules={[...FORM_COMMON_RULES]}
              className={"block-without-margin"}
            >
              <Select
                showSearch
                notFoundContent={null}
                defaultActiveFirstOption={false}
                showArrow={true}
                filterOption={false}
                onSelect={(value: any) => {
                  form.setFieldsValue({
                    tagId: value,
                    tag: categoryTagsSelectProps.data?.data?.find(t => t.id === value) || null,
                    imagePNG: (categoryTagsSelectProps.data?.data?.find(t => t.id === value))?.imagePNG || null
                  })
                  setSelectParentTag(categoryTagsSelectProps.data?.data?.find(t => t.id === value) || null)
                }}
                onSearch={(value) => {
                  setSearchTagValue(value)
                }}
                allowClear={false}
              >
                { (selectParentTag?.id && !categoryTagsSelectProps?.data?.data?.length) ? (
                  [selectParentTag].map(d => <Select.Option key={d?.id} value={d?.id}>{d?.title}</Select.Option>)
                ) : (
                  categoryTagsSelectProps?.data?.data?.map(d => <Select.Option key={d.id} value={d.id}>{d.title}</Select.Option>)
                )}
              </Select>
            </Form.Item>


            <Button htmlType="submit" type={"primary"} style={{marginTop: '24px'}}>Сохранить</Button>

          </Form>
        </div>

      </Drawer>
    )
  }

