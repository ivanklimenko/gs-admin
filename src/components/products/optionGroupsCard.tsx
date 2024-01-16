import {
  Button,
  Card,
  Col,
  Collapse,
  Drawer,
  Dropdown,
  Form,
  FormProps,
  Grid,
  Icons, Input, InputNumber,
  Menu, Modal, Row, Select, Switch
} from "@pankod/refine-antd";
import {
  EOptionGroupType,
  EPriceType,
  IProductOption,
  IProductOptionGroup,
  OPTION_GROUP_TYPES, PRICE_TYPES
} from "interfaces/products";
import React, {useEffect, useState} from "react";
import {useTranslate} from "@pankod/refine-core";
import {OptionTable} from "./optionSortableTable";
import {FORM_COMMON_RULES} from "../../common/constants";
import {EmptyContainer} from "../notFound/NotFound";
import {PublishStatus} from "../publishStatus";
import {EnableStatus} from "../enableStatus";

type OptionCardProps = {
  formProps?: FormProps,
  readonlyMode?: boolean,
  setDeletedGroups: (a: Array<IProductOptionGroup>) => void,
  setDeletedOptions: (a: IProductOption, b: IProductOptionGroup) => void
}


const { confirm } = Modal;


export const OptionGroupsCard: React.FC<OptionCardProps> = (
  { formProps = {}, setDeletedGroups, setDeletedOptions, readonlyMode = false }) => {
  const t = useTranslate();

  const [showDrawer, setShowDrawer] = useState(false);
  const [selectGroup, setSelectGroup] = useState<IProductOptionGroup | null>(null);

  const [groups, setGroups] = useState<Array<IProductOptionGroup>>([])

  useEffect(() => {
    if (formProps?.initialValues?.optionGroups) {
      setGroups(formProps.initialValues.optionGroups)
    }
  }, [formProps.initialValues])

  useEffect(() => {
    if (formProps?.form) {
      formProps.form.setFieldsValue({
        optionGroups: groups
      })
    }
  }, [formProps, groups])

  const handleCloseDrawer = () => {
    setShowDrawer(false)
    setSelectGroup(null)
  }

  const _addOptionInGroup = (group: IProductOptionGroup, value: IProductOption) => {
    setGroups(groups => groups.map(g => g.id !== group.id ? g : {
      ...g,
      options: g.options.some(o => o.id === value.id) ? g.options.map(o => o.id === value.id ? value : o) :  [...g.options, value]
    }))
  }

  const _copyOptionInGroup = (record: IProductOptionGroup, optionId: any) => {
    const group = groups.find(g => g.id === record.id);
    const option = group?.options.find(o => o.id === optionId);
    if (option) {
      setGroups(groups => groups.map(g => g.id !== record.id ? g : {
        ...g,
        options: [...g.options, {
          ...option,
          id: g.options.length + 1 + '_temp'
        }]
      }))
    }
  }

  const _changeOptionInGroup = (group: IProductOptionGroup, values: any, isAllChange: boolean = false) => {
    if (values.delete) {
      if (!`${values.id}`.includes('temp')) {
        setDeletedOptions(values, group)
      }

      setGroups(initGroups => initGroups.map(g => g.id !== group.id ? g : {
        ...g,
        options: g.options.filter(o => o.id !== values.id)
      }))
      return
    }

    if (isAllChange) {
      setGroups(initGroups => initGroups.map(g => g.id !== group.id ? g : {
        ...g,
        options: values
      }))
      return
    }

    setGroups(initGroups => initGroups.map(g => g.id !== group.id ? g : {
      ...g,
      options: g.options.map(o => (o.id != values.id) ? o : {
        ...o,
        ...values
      })
    }))
  }

  const _addGroup = (record: IProductOptionGroup | null = null) => {
    setShowDrawer(true)
    if (record) {
      setSelectGroup({
        ...record,
        id: groups.length + 1 + '_temp',
        options: record.options?.map((o, i) => ({...o, id: i + 1 + '_temp', optionGroupId: groups.length + 1 + '_temp'}))
      })
      return;
    }
    setSelectGroup({
      id: groups.length + 1 + '_temp',
      title: "",
      isActive: false,
      isEnabled: false,
      isRequired: false,
      type: EOptionGroupType.CHECKBOX,
      priceType: EPriceType.BASIC,
      maxAllowedOptions: 0,
      priceForGroup: "",
      description: "",
      options: []
    })
  }

  const showConfirm = (group: IProductOptionGroup) => {
    confirm({
      title: `Вы уверены, что хотите удалить группу опций "${group?.title || ''}"?`,
      icon: <Icons.ExclamationCircleOutlined />,
      content: '',
      okText: 'Да, подтверждаю',
      okType: 'primary',
      cancelText: 'Нет',
      onOk() {
        if (!`${group.id}`.includes('temp')) {
          const dGroups = groups.filter(g => g.id === group.id)
          setDeletedGroups(dGroups.map(dG => ({...dG, delete: true})))
        }
        setGroups(groups => groups.filter(g => g.id !== group.id))
      },
      onCancel() {
        //console.log('Cancel');
      },
    });
  };

  const moreMenu = (record: IProductOptionGroup) => (
    <Menu mode="vertical">
      <Menu.Item  key="3"
                  className={"table-menu-item"}
                  icon={<Icons.FormOutlined className={"menu-item-icon"}/>}
                  onClick={() => {
                    setShowDrawer(true);
                    setSelectGroup(record);
                  }}>
        {t("buttons.edit")}
      </Menu.Item>

      <Menu.Item  key="clone" style={{fontSize: 13}}
                  className={"table-menu-item"}
                  icon={<Icons.CopyOutlined className={"menu-item-icon"}/>}
                  onClick={() => {
                    _addGroup(record)
                  }}>
        {t("buttons.clone")}
      </Menu.Item>

      <Menu.Item key="delete"
                 icon={<Icons.DeleteOutlined className={"menu-item-icon delete-icon"}
                                             style={{marginRight: '8px'}}/>}
                 onClick={() => {
                   showConfirm(record)
                 }}
                 className={"table-menu-item"}>
          {t("buttons.delete")}
      </Menu.Item>
    </Menu>
  );

  return (
    <Card className={"card-block-with-margin"}>
      <Row gutter={[24, 12]} wrap align="stretch">
        <Col span={24}>
          <Row wrap style={{marginBottom: '24px'}}>
            <div className="ant-form-item-label" style={{flex: 1, textAlign: 'left'}}>
              <label>{t("products.fields.options.header")}</label>
            </div>
            <Button disabled={readonlyMode} type={"primary"} onClick={() => _addGroup()}>Добавить</Button>
          </Row>

          <Row gutter={[24, 12]} className={"row-with-margin-12"}>
            {!groups?.length ? (
              <EmptyContainer/>
            ) : (
              <Collapse collapsible="header" className={"width-100-pr"} defaultActiveKey={[]}>
                {groups.map((group, i) => (
                  <Collapse.Panel
                    header={<span>
                      <span  className={group.isRequired ? 'required-group-header' : ''} style={{marginRight: '6px'}}>{group.title}</span>
                      <PublishStatus status={group.isActive}/>
                      <EnableStatus status={group.isEnabled}/>
                  </span>} key={i}  extra={
                    <Dropdown
                      disabled={readonlyMode}
                      overlay={moreMenu(group)}
                      trigger={["click"]}
                    >
                      <Icons.MoreOutlined className={"table-dropdown-icon"}/>
                    </Dropdown>
                  }>
                    <OptionTable options={group.options}
                                 optionGroupId={group.id || group.temp_id}
                                 readonlyMode={readonlyMode}
                                 onCopy={(values: any) => _copyOptionInGroup(group, values.id)}
                                 onAdd={(values: any) => _addOptionInGroup(group, values)}
                                 onChange={(values: any, isAllChange: boolean) => {
                                   _changeOptionInGroup(group, values, isAllChange)
                                 }}/>
                  </Collapse.Panel>
                ))}
              </Collapse>
            )}
          </Row>

        </Col>
      </Row>

      <GroupDrawer visible={showDrawer}
                   onClose={handleCloseDrawer}
                   initialValues={selectGroup || null}
                   onChange={(values: any, createMode = false) => {
                     handleCloseDrawer();
                     if (createMode) {
                       setGroups(groups => [...groups, values]);
                       return;
                     }

                     setGroups(groups => groups.map(g => (g.id !== values.id) ? g : {
                       ...values,
                       options: g.options
                     }));
                   }}
      />
    </Card>
  )
}

const GroupDrawer: React.FC<{visible: boolean, initialValues: IProductOptionGroup | null, onClose: any, onChange?: any}> =
  ({visible, initialValues, onChange, onClose}) => {
    const t = useTranslate();
    const breakpoint = Grid.useBreakpoint();

    const [form] = Form.useForm();

    const [groupType, setGroupType] = useState<EOptionGroupType | null>(EOptionGroupType.CHECKBOX);

    useEffect(() => {
      return () => {
        form.resetFields();
        setGroupType(null)
      }
    }, [form])

    useEffect(() => {
      if (initialValues) {
        setGroupType(initialValues?.type || null)
      }
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
                onFieldsChange={(changedFields) => {
                  // @ts-ignore
                  if (changedFields.length && changedFields[0].name?.length && changedFields[0].name.includes("type")) {
                    setGroupType(changedFields[0].value)
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
              name="options"
            >
            </Form.Item>

            <Form.Item
              hidden={true}
              name="optionGroupId"
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
              label={t("products.fields.options.group.isActive")}
              name="isActive"
              valuePropName="checked"
            >
              <Switch size={"small"}/>
            </Form.Item>
            <Form.Item
              label={t("products.fields.options.group.isEnabled")}
              name="isEnabled"
              valuePropName="checked"
            >
              <Switch size={"small"}/>
            </Form.Item>
            <Form.Item
              label={t("products.fields.options.group.isRequired")}
              name="isRequired"
              valuePropName="checked"
            >
              <Switch size={"small"}/>
            </Form.Item>

            <Form.Item
              label={t("products.fields.options.group.optionType")}
              name="type"
              rules={[...FORM_COMMON_RULES]}
            >
              <Select
                allowClear
                placeholder={t("products.fields.options.group.optionType")}
                options={OPTION_GROUP_TYPES}
              />
            </Form.Item>

            <Form.Item
              label={t("products.fields.options.group.priceType")}
              name="priceType"
              rules={[...FORM_COMMON_RULES]}
            >
              <Select
                allowClear
                placeholder={t("products.fields.options.group.priceType")}
                options={PRICE_TYPES}
              />
            </Form.Item>

            {groupType !== EOptionGroupType.RADIO && (
              <Form.Item
                label={t("products.fields.options.group.optionCount")}
                name="maxAllowedOptions"
              >
                <InputNumber className={"width-100-pr"}/>
              </Form.Item>
            )}

            {groupType === EOptionGroupType.QUANTITIVE && (
              <Form.Item
                label={t("products.fields.options.group.maxSum")}
                name="priceForGroup"
              >
                <InputNumber className={"width-100-pr"}/>
              </Form.Item>
            )}



            <Form.Item
              label={t("products.fields.options.group.description")}
              name="description"
            >
              <Input.TextArea/>
            </Form.Item>

            <Button htmlType="submit" type={"primary"}>Сохранить</Button>

          </Form>
        </div>

      </Drawer>
    )
  }