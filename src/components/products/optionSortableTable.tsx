import React, {useEffect, useState} from "react";
import { useTranslate } from "@pankod/refine-core";
import {
  Button, Col, Drawer, Dropdown,
  Form, Grid, Icons, Input, InputNumber, Menu, SaveButton, Select, Space, Switch,
  Table,
} from "@pankod/refine-antd";
import { MenuOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { arrayMoveImmutable } from 'array-move';
import type { SortableContainerProps, SortEnd } from 'react-sortable-hoc';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import {
  IProductOption,
} from "interfaces/products";
import {TableMenu} from "../tableMenu/tableMenu";
import {FORM_COMMON_RULES} from "../../common/constants";
import {CustomBooleanField} from "../customBooleanField";

const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);


const SortableItem = SortableElement((props: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr {...props} />
));
const SortableBody = SortableContainer((props: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody {...props} />
));


export const OptionTable: React.FC<{
  options: Array<IProductOption>,
  optionGroupId?:  number | string,
  onAdd?: any,
  onChange?: any,
  onCopy?: any,
  readonlyMode?: boolean}> = ({options, optionGroupId, onAdd, onCopy, onChange, readonlyMode = false}) => {
  const t = useTranslate();


  const [showDrawer, setShowDrawer] = useState(false);
  const [selectOption, setSelectOption] = useState<IProductOption | null>(null);

  const [dataSource, setDataSource] = useState(options);
  const [sortMode, setSortMode] = useState(false);
  const [editId, setEditId] = useState<number | string | null>(null);

  const [form] = Form.useForm();

  useEffect(() => {
    setDataSource(options)
    const newOption = options.find(o => `${o.id}`.includes('temp') && !o.title )
    if (newOption) {
      setEditId(newOption?.id || null)
      if (form) {
        form.setFieldsValue(newOption)
      }
    }
  }, [options, form])

  const handleCloseDrawer = () => {
    setShowDrawer(false)
    setSelectOption(null)
  }

  const columns: ColumnsType<IProductOption> = [
    {
      title: '',
      dataIndex: 'sort',
      width: 30,
      className: 'drag-visible',
      sortOrder: "ascend",
      render: () => <DragHandle />,
    },

    {
      title: 'ID',
      dataIndex: 'id',
      width: "1px",
      className: 'drag-visible',
      render: (value, record: IProductOption) => {
        return `${value}`.includes('temp') ? '' : value;
      }
    },
    {
      title: 'Название',
      dataIndex: 'title',
      className: 'drag-visible',
      render: (value, record: IProductOption) => {
        return value;
      }
    },
    {
      title: 'Hungry Ninja',
      dataIndex: 'price',
      render: (value, record: IProductOption) => {
        return (
          <div><CustomBooleanField value={!!record.isActive}/>&#8199;{value}</div>
        );
      }
    },
    {
      title: 'Yandex Eda',
      dataIndex: 'priceYandex',
      render: (value, record: IProductOption) => {
        return (
          <div><CustomBooleanField value={!!record.isForYandex}/>&#8199;{value}</div>
        );
      }
    },
    {
      title: 'SberMarket',
      dataIndex: 'priceSber',
      render: (value, record: IProductOption) => {
        return (
          <div><CustomBooleanField value={!!record.isForSber}/>&#8199;{value}</div>
        );
      }
    },
    {
      title: 'Доступен для заказов',
      dataIndex: 'isEnabled',
      render: (value, record: IProductOption) => {
        return <CustomBooleanField value={value} />;
      }
    },

    {
      title: 'Действия',
      fixed: "right",
      dataIndex: "actions",
      key: "actions",
      align: "center",
      render: (_text, record) => {
        return (
          <Dropdown
            disabled={readonlyMode}
            overlay={<TableMenu record={record}
                                deleteItem={() => deleteOption(record)}
                                cloneItem={() => {
                                  onCopy?.(record)
                                }}
                                setEdit={() => {
                                  // setEditId(record?.id || null)
                                  // form.setFieldsValue(record)
                                  setShowDrawer(true);
                                  setSelectOption(record);
                                }}
                                fullPageMenu={false}/>}
            trigger={["click"]}
          >
            <Icons.MoreOutlined className={"table-dropdown-icon"}/>
          </Dropdown>
        );
      }
    },
  ];

  const deleteOption = (record: IProductOption) => {
    onChange({...record, delete: true})
  }

  const onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable(dataSource.slice(), oldIndex, newIndex).filter(
        (el: IProductOption) => !!el,
      );
      onChange(newData.map((o, i) => ({...o, sort: i + 1})), true)
    }
  };

  const DraggableContainer = (props: SortableContainerProps) => (
    <SortableBody
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );

  const DraggableBodyRow: React.FC<any> = ({ className, style, ...restProps }) => {
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = dataSource.findIndex(x => x.sort === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };

  // if (!dataSource?.length) {
  //   return null;
  // }

  return (
    <div

      // form={form}
      //     initialValues={options}
      //     onFinish={(values) => {
      //
      //       form.resetFields();
      //       setEditId(null)
      //     }}
          style={{width: "100%", padding: "2px 12px"}}>

      {!!dataSource?.length && (
        <div className={"row-with-margin-12"}>
          <span style={{marginRight: '12px'}}>Включить сортировку:</span>
          <Switch disabled={readonlyMode} checked={sortMode} size={"small"} onChange={() => setSortMode(!sortMode)} />
        </div>
      )}


      <div>
        <Button type="primary" size={"small"} disabled={readonlyMode} style={{marginBottom: '12px'}} onClick={() => {
          setShowDrawer(true)
          setSelectOption({
            title: "",
            price: "",
            isActive: false,
            isEnabled: false,
            sort: options.length + 1,
            optionGroupId: optionGroupId,
            id: options.length + 1 + '_temp'
          })
        }}>
          Добавить опцию
        </Button>
      </div>

      {!!dataSource?.length && (
        <>
          {sortMode ? (
            <Table
              pagination={false}
              dataSource={dataSource}
              columns={columns.slice(0, columns.length - 1)}
              rowKey="sort"
              style={{overflowX: 'auto'}}
              components={{
                body: {
                  wrapper: DraggableContainer,
                  row: DraggableBodyRow,
                },
              }}
            />
          ) : (
            <Table
              pagination={false}
              dataSource={dataSource}
              columns={columns.slice(1, columns.length)}
              rowKey="sort"
              style={{overflowX: 'auto'}}
            />
          )}
        </>
      )}

      <OptionDrawer visible={showDrawer}
                   onClose={handleCloseDrawer}
                   initialValues={selectOption || null}
                   onChange={(values: any, createMode = false) => {
                     handleCloseDrawer();

                     if (!values.id || `${values.id}`.includes('temp')) {
                       onAdd({...values})
                       return;
                     }

                     onChange(values)
                     // if (createMode) {
                     //   setGroups(groups => [...groups, values]);
                     //   return;
                     // }
                     //
                     // setGroups(groups => groups.map(g => (g.id !== values.id) ? g : {
                     //   ...values,
                     //   options: g.options
                     // }));
                   }}
      />

    </div>
  )
}


const OptionDrawer: React.FC<{visible: boolean, initialValues: IProductOption | null, onClose: any, onChange?: any}> =
  ({visible, initialValues, onChange, onClose}) => {
    const t = useTranslate();
    const breakpoint = Grid.useBreakpoint();

    const [form] = Form.useForm();

    useEffect(() => {
      return () => {
        form.resetFields();
      }
    }, [form])

    useEffect(() => {
      form.setFieldsValue(initialValues)
    }, [initialValues])


    return (
      <Drawer
        visible={visible}
        onClose={() => {
          onClose()
        }}
        width={breakpoint.sm ? "500px" : "100%"}
        bodyStyle={{padding: 0}}
        zIndex={1001}
        destroyOnClose={true}
      >
        <div className="ant-page-header has-breadcrumb ant-page-header-compact" style={{paddingBottom: '48px'}}>
          <Form form={form}
                onFinish={(values) => {
                  onChange(values, `${values.id}`.includes('temp'))
                  form.resetFields();
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
              label={t("products.fields.options.group.title")}
              name="title"
              rules={[...FORM_COMMON_RULES]}
            >
              <Input type={"text"}/>
            </Form.Item>

            <Form.Item
              label={t("products.fields.options.group.isEnabled")}
              name="isEnabled"
              valuePropName="checked"
            >
              <Switch size={"small"}/>
            </Form.Item>

            <Form.Item
              label="Hungry Ninja"
              name="isActive"
              valuePropName="checked"
              className={"product-active-switch-container"}
            >
              <Switch size={"small"}/>
            </Form.Item>


            <Form.Item
              label={t("products.fields.price")}
              name="price"
              rules={[...FORM_COMMON_RULES]}
            >
              <InputNumber<string>  min="0" step="1.00" stringMode className={"width-100-pr"}/>
            </Form.Item>



            <Form.Item
              label="Yandex Eda"
              name="isForYandex"
              valuePropName="checked"
              className={"product-active-switch-container"}
            >
              <Switch size={"small"}/>
            </Form.Item>

            <div style={{display: 'flex', alignItems: 'center'}}>
              <Form.Item
                label={t("products.fields.price")}
                name="priceYandex"
              >
                <InputNumber<string> type={"number"} min="0" step="1.00" stringMode className={"width-100-pr"}/>
              </Form.Item>

              <Button type={"primary"} style={{marginLeft: '12px', marginTop: '6px'}} onClick={() => {
                const hn_price = form.getFieldValue('price')
                form.setFieldValue('priceYandex', hn_price)
              }}>
                <Icons.FormOutlined/>
              </Button>
            </div>

            <Form.Item
              label="Sber Market"
              name="isForSber"
              valuePropName="checked"
              className={"product-active-switch-container"}
            >
              <Switch size={"small"}/>
            </Form.Item>

            <div style={{display: 'flex', alignItems: 'center'}}>
              <Form.Item
                label={t("products.fields.price")}
                name="priceSber"
              >
                <InputNumber<string> type={"number"} min="0" step="1.00" stringMode className={"width-100-pr"}/>
              </Form.Item>

              <Button type={"primary"} style={{marginLeft: '12px', marginTop: '6px'}} onClick={() => {
                const hn_price = form.getFieldValue('price')
                form.setFieldValue('priceSber', hn_price)
              }}>
                <Icons.FormOutlined/>
              </Button>
            </div>

            <Button htmlType="submit" type={"primary"}>Сохранить</Button>

          </Form>
        </div>

      </Drawer>
    )
  }