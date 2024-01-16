import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {useList, usePermissions, useTranslate} from "@pankod/refine-core";
import {
  BooleanField, Button,
  Card,
  Col,
  Descriptions,
  Form,
  FormProps,
  Icons,
  Input,
  InputNumber,
  Row,
  Select, Space, Switch,
  Tag,
  useSelect,
} from "@pankod/refine-antd";

import {UploadArea} from "components/uploadArea";
import {FORM_COMMON_RULES} from "common/constants";
import {
  EProductType,
  IProduct,
  IProductOption,
  IProductOptionGroup,
  PRODUCT_TYPES,
  UNIT_LIST
} from "interfaces/products";
import {IOutlet} from "interfaces/outlets";
import {DeliveryTypeButtons} from "../deliveryTypeButtons";
import {ICategory, ILocalCategory} from "interfaces/tags";
import { OptionGroupsCard } from "./optionGroupsCard";
import {useOutletsList} from "../../hooks/products";
import {IMarket} from "interfaces/markets";
import {Link} from "react-router-dom";
import {_checkFullP, getReadyTimeList} from "../../utils";
import {AllDeliveryTypes} from "interfaces/common";
import {IRobot} from "interfaces/robots";
import {CustomBooleanField} from "../customBooleanField";
import {EUserRole} from "interfaces/users";


interface IExtOutlet extends IOutlet {
  market?: IMarket;
}

type FormProductProps = {
  formProps: FormProps;
  readonlyMode?: boolean;
  outletProps?: IExtOutlet | null;
  changeOutlet: Dispatch<SetStateAction<number | string | null>>
};


export const ProductForm: React.FC<FormProductProps> = ({
                                                          formProps,
                                                          outletProps,
                                                          changeOutlet,
                                                          readonlyMode= false}) => {
  const t = useTranslate();
  const { data: permissions } = usePermissions<Array<string>>();

  const [productType, setProductType] = useState(EProductType.PORTION);
  const [deletedGroups, setDeletedGroups] = useState<Array<IProductOptionGroup>>([])
  const [deletedOptions, setDeletedOptions] = useState<Array<IProductOption>>([])

  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);
  const [localCategories, setCategories] = useState<Array<ILocalCategory>>([]);

  const { outletsSelectProps, searchOutletValue, setSearchOutletValue } = useOutletsList();

  useEffect(() => {
    if (formProps?.initialValues?.type) {
      setProductType(formProps?.initialValues?.type)
    }
  }, [formProps])

  useEffect(() => {
    if (outletProps) {
      setCategories(outletProps?.categories || [])
    }
  }, [outletProps])

  const {selectProps: tagsProps} = useSelect<IOutlet>({
    resource: "tags",
    filters: [{
      field: "type",
      operator: "eq",
      value: "product",
    }],
    dataProviderName: "autocompleteProvider"
  });

  const timetablesSelectProps = useList<IRobot>({
    resource: "timetables/dropdown",
    dataProviderName: "timetablesProvider",
    // config: {
    //   filters: [{
    //     field: "title_like",
    //     operator: "eq",
    //     value: searchProductValue,
    //   }]
    // }
  });

  const handleSave = async (values: IProduct) => {
    const optionsGroup = values?.optionGroups?.length ? [...values?.optionGroups, ...deletedGroups] : deletedGroups?.length ? deletedGroups : values?.optionGroups

    let requestValues = {
      ...values,
      title: values?.title?.trim(),
      subtitle: values?.subtitle?.trim() || '',
      isForYandex: !!values.isForYandex,
      description: values?.description?.trim() || '',
      soldByWeight: values.type === EProductType.WEIGHT,
      weightOrVolume: values?.weightOrVolume,
      minWeight: values.minWeight || '',
      maxWeight: values.maxWeight || '',
      priceInDeliveryWithSelf: values.priceInDeliveryWithSelf || '0',
      oldPrice: values.oldPrice || '0',
      weightIncrement: values.weightIncrement || '',
      tags: values.tags ? JSON.stringify(values.tags?.map(value => value?.id ? value.id : value)) : [],
      optionGroups: JSON.stringify(optionsGroup?.map((g: IProductOptionGroup, index) => {
        const options = [...g.options, ...deletedOptions.filter(o => o.optionGroupId == g.id)]
        const group = {
          ...g,
          sort: index + 1,
          options: options.map((o, i) => {
            if (`${o?.id}`?.includes('temp') || !!values.copy) {
              delete o.id
            }
            return {...o, sort: i + 1}
          })
        }
        if (`${group?.id}`?.includes('temp') || !!values.copy) {
          delete group.id
        }
        return group
      })),
      deliveryOptionsExclude: JSON.stringify(values.deliveryOptionsExclude)
    };

    if (formProps.initialValues?.["image"] === values?.["image"]) {
      // @ts-ignore
      delete requestValues["image"]
    } else {
      // @ts-ignore
      const file = values?.["image"]?.length ? values["image"][0].originFileObj : null;

      requestValues = {
        ...requestValues,
        // @ts-ignore
        ["image"]: file
      }
    }

    if (values.hasOwnProperty('timetableId') && !values.timetableId) {
      // @ts-ignore
      delete requestValues["timetableId"]
    }

    if (formProps.onFinish) {
      formProps.onFinish(requestValues)
    }
  }

  return (
    <>
      <Form {...formProps}
            onFinish={handleSave}
            onFieldsChange={(changedFields) => {
              // @ts-ignore
              if (changedFields.length && changedFields[0].name?.length && changedFields[0].name.includes("type")) {
                setProductType(changedFields[0].value)
              }
              // @ts-ignore
              if (changedFields.length && changedFields[0].name?.length && changedFields[0].name.includes("outletId")) {
                changeOutlet(changedFields[0].value)
                formProps?.form?.setFieldsValue({
                  categoryId: null
                })
              }
            }}
            layout="vertical"
            validateTrigger={"submit"}>

        {formProps.initialValues?.id && (
          <Form.Item
            hidden={true}
            name="id"
          >
          </Form.Item>
        )}

        {formProps.initialValues?.sourceId && (
          <Form.Item
            hidden={true}
            name="sourceId"
          >
          </Form.Item>
        )}

        {formProps.initialValues?.copy && (
          <Form.Item
            hidden={true}
            name="copy"
          >
          </Form.Item>
        )}

        <Form.Item hidden={true} name={"optionGroups"}>
        </Form.Item>

        <Row gutter={[24, 12]} wrap align="stretch">
          <Col xs={24} sm={24} md={12} lg={8} span={8} className={"flex-column"}>
            <Card className={"card-block-with-margin"}>
              <Row gutter={[24, 12]} wrap align="stretch">
                <Col xs={24} sm={24} md={24} span={24}>
                  <Form.Item label={t("products.fields.image")}>
                    <Form.Item name="image" valuePropName="fileList"
                               getValueFromEvent={(e: any) => {
                                 return Array.isArray(e) ? e : e?.fileList
                               }}
                               noStyle>
                      <UploadArea name={"image"}  readonlyMode={readonlyMode}/>
                    </Form.Item>
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card className="settings-products-card">
              <Row gutter={[24, 12]} wrap align="stretch" style={{flex: 1}}>
                <Col xs={24} sm={24} md={24} span={24}>
                  {readonlyMode ? (
                    <Descriptions title="" column={1}  bordered={true} size={"middle"}
                                  layout={"vertical"}>
                      <Descriptions.Item label={t("products.fields.title")}>
                        {formProps?.initialValues?.title || "--"}
                      </Descriptions.Item>

                      <Descriptions.Item label={t("products.fields.subtitle")}>
                        {formProps?.initialValues?.subtitle || "--"}
                      </Descriptions.Item>

                      <Descriptions.Item label={t("products.fields.description")}>
                        {formProps?.initialValues?.description || "--"}
                      </Descriptions.Item>

                    </Descriptions>
                  ) : (
                    <>
                      <Form.Item
                        label={t("products.fields.title")}
                        name="title"
                        rules={[...FORM_COMMON_RULES]}
                      >
                        <Input readOnly={readonlyMode}/>
                      </Form.Item>

                      <Form.Item
                        label={t("products.fields.subtitle")}
                        name="subtitle"
                      >
                        <Input readOnly={readonlyMode}/>
                      </Form.Item>

                      <Form.Item
                        label={t("products.fields.description")}
                        name="description"
                      >
                        <Input.TextArea readOnly={readonlyMode}/>
                      </Form.Item>
                    </>
                  )}
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xs={24} sm={24} md={12} lg={8} span={8} className={"flex-column"}>
            <Card className={"settings-products-card card-block-with-margin"}>
              <Row gutter={[24, 12]} wrap align="stretch" style={{flex: 1}}>
                <Col xs={24} sm={24} md={24} span={24}>
                  {readonlyMode ? (
                    <Descriptions title="" column={1} bordered={true} size={"middle"}
                                  layout={"vertical"}>
                      <Descriptions.Item label={t("products.fields.outletId")}>
                        <Link to={`/outlets/show/${outletProps?.id || ''}`} target={"_blank"}>
                          {`${outletProps?.title} (${outletProps?.market?.title})` || "--"}</Link>
                      </Descriptions.Item>

                      <Descriptions.Item label={t("products.fields.categoryId")}>
                        {!formProps?.initialValues?.categoryId ? '--' : (outletProps?.categories?.find(c => c.id === formProps?.initialValues?.categoryId))?.title}
                      </Descriptions.Item>

                      <Descriptions.Item label={t("products.fields.type.label")}>
                        {!formProps?.initialValues?.type ?  "--" : t(`products.fields.type.${formProps?.initialValues?.type}`)}
                      </Descriptions.Item>

                      <Descriptions.Item label={t("products.fields.isEnabled")}>
                        <CustomBooleanField value={formProps?.initialValues?.isEnabled}/>
                      </Descriptions.Item>

                      <Descriptions.Item label={"Таблица времени"}>
                        {(timetablesSelectProps?.data?.data?.find(o => o.id === formProps?.initialValues?.timetableId))?.name || "--"}
                      </Descriptions.Item>

                      <Descriptions.Item label={t("products.fields.tags")}>
                        {formProps?.initialValues?.tags?.map((t: any) => <Tag>{t.title}</Tag>) || "--"}
                      </Descriptions.Item>

                    </Descriptions>
                  ) : (
                    <>
                      <Form.Item
                        label={<Space>
                          {t("products.fields.outletId")}
                          <Link to={`/outlets/show/${outletProps?.id || ''}`} target={"_blank"}><Icons.LinkOutlined/></Link>
                        </Space>}
                        name="outletId"
                        rules={[...FORM_COMMON_RULES]}
                      >
                        <Select
                          showSearch
                          disabled={!(_checkFullP(permissions))}
                          notFoundContent={null}
                          defaultActiveFirstOption={false}
                          showArrow={true}
                          filterOption={false}
                          onSearch={(value) => {
                            setSearchOutletValue(value)
                            // if (outletsSelectProps.onSearch) {
                            //   outletsSelectProps.onSearch(value);
                            // }
                          }}
                        >
                          { (outletProps?.id && !outletsSelectProps?.data?.data?.length) ? (
                            [outletProps].map(d => <Select.Option key={d?.id} value={d?.id}>{`${d.title} (${d?.market?.title})`}</Select.Option>)
                          ) : (
                            <>
                              {outletProps?.id && outletsSelectProps?.data?.data && !searchOutletValue ? (
                                <>
                                  {[outletProps, ...outletsSelectProps?.data?.data]?.map(d => <Select.Option key={d.id} value={d.id}>
                                    {`${d.title} (${d?.market?.title})`}
                                  </Select.Option>)}
                                </>
                              ) : (
                                <>
                                  {outletsSelectProps?.data?.data?.map(d => <Select.Option key={d.id} value={d.id}>
                                    {`${d.title} (${d?.market?.title})`}
                                  </Select.Option>)}
                                </>
                              )}
                            </>
                          )}
                        </Select>
                      </Form.Item>

                      <Form.Item
                        label={t("products.fields.categoryId")}
                        name="categoryId"
                        rules={[...FORM_COMMON_RULES]}
                      >
                        <Select
                          allowClear={false}
                          placeholder={t("products.fields.categoryId")}
                          notFoundContent={null}
                          defaultActiveFirstOption={false}
                          showArrow={true}
                          filterOption={false}
                        >
                          { (selectedCategory?.id && !localCategories?.length) ? (
                            [selectedCategory].map(d => <Select.Option key={d?.id} value={d?.id}>{d?.title}</Select.Option>)
                          ) : (
                            localCategories?.map(d => <Select.Option key={d.id} value={d.id}>{d.title}</Select.Option>)
                          )}
                        </Select>

                      </Form.Item>

                      <Form.Item
                        label={t("products.fields.type.label")}
                        name="type"
                      >
                        <Select
                          allowClear={false}
                          placeholder={t("products.fields.type.placeholder")}
                          options={PRODUCT_TYPES}
                        />
                      </Form.Item>

                      <Form.Item
                        label={t("products.fields.isEnabled")}
                        name="isEnabled"
                        valuePropName="checked"
                      >
                        <Switch size={"small"}/>
                      </Form.Item>

                      <Form.Item
                        label={"Расписание доступности"}
                        name="timetableId"
                      >
                        <Select
                          allowClear
                          placeholder={"Расписание доступности"}
                          options={timetablesSelectProps?.data?.data?.map((o) => ({label: o.name, value: o.id}))}
                        />
                      </Form.Item>


                      <Form.Item
                        label={t("products.fields.tags")}
                        name="tags"
                      >
                        <Select
                          allowClear={false}
                          disabled={!(_checkFullP(permissions))}
                          showSearch
                          mode={"multiple"}
                          notFoundContent={null}
                          defaultActiveFirstOption={false}
                          showArrow={true}
                          filterOption={false}
                          onSearch={(value) => {
                            if (tagsProps.onSearch) {
                              tagsProps.onSearch(value);
                            }
                          }}
                        >
                          {tagsProps?.options?.map(d => <Select.Option key={d.value} value={d.value}>{d.label}</Select.Option>)}
                        </Select>
                      </Form.Item>
                    </>
                  )}
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xs={24} sm={24} md={24} lg={8} span={8} className={"flex-column"}>

            {/*<Card className={"card-block-with-margin"}>*/}
            {/*  <Row gutter={[24, 12]} wrap align="stretch">*/}
            {/*    <Col xs={24} sm={24} md={24} span={24}>*/}
            {/*      {readonlyMode ? (*/}
            {/*        <Descriptions title="" column={1}  bordered={true} size={"middle"} layout={"vertical"}>*/}
            {/*          <Descriptions.Item label={"Таблица времени"}>*/}
            {/*            {(timetablesSelectProps?.data?.data?.find(o => o.id === formProps?.initialValues?.timetableId))?.name || "--"}*/}
            {/*          </Descriptions.Item>*/}
            {/*        </Descriptions>*/}
            {/*      ) : (*/}
            {/*        <Form.Item*/}
            {/*          label={"Таблица времени"}*/}
            {/*          name="timetableId"*/}
            {/*        >*/}
            {/*          <Select*/}
            {/*            allowClear*/}
            {/*            placeholder={"Таблица времени"}*/}
            {/*            options={timetablesSelectProps?.data?.data?.map((o) => ({label: o.name, value: o.id}))}*/}
            {/*          />*/}
            {/*        </Form.Item>*/}
            {/*      )}*/}
            {/*    </Col>*/}
            {/*  </Row>*/}
            {/*</Card>*/}

            <Card className="settings-products-card">
              <Row gutter={[24, 12]} wrap align="stretch" style={{flex: 1}}>
                <Col xs={24} sm={24} md={24} span={24}>
                  {readonlyMode ? (
                    <>
                      <Descriptions title="" column={2}  bordered={true} size={"middle"}
                                    layout={"vertical"}>
                        {/*{(productType === EProductType.PORTION) ? (*/}
                        {/*  <>*/}
                        {/*    <Descriptions.Item label={t("products.fields.price")}>*/}
                        {/*      {formProps?.initialValues?.price || "--"}*/}
                        {/*    </Descriptions.Item>*/}
                        {/*    <Descriptions.Item label={t("products.fields.priceYandex")}>*/}
                        {/*      {formProps?.initialValues?.priceYandex || "--"}*/}
                        {/*    </Descriptions.Item>*/}
                        {/*  </>*/}
                        {/*) : (*/}
                        {/*  <>*/}
                        {/*    <Descriptions.Item label={t("products.fields.price")}>*/}
                        {/*      {formProps?.initialValues?.price || "--"}*/}
                        {/*    </Descriptions.Item>*/}

                        {/*    <Descriptions.Item label={t("products.fields.priceYandex")}>*/}
                        {/*      {formProps?.initialValues?.priceYandex || "--"}*/}
                        {/*    </Descriptions.Item>*/}

                        {/*    /!*<Descriptions column={1} bordered={false} size={"small"}*!/*/}
                        {/*    /!*              layout={"vertical"}>*!/*/}
                        {/*    /!*  *!/*/}
                        {/*    /!*  /!*<Descriptions.Item label={t("products.fields.weight")}>*!/*!/*/}
                        {/*    /!*  /!*  {formProps?.initialValues?.weightPriceYandexStep || "--"}*!/*!/*/}
                        {/*    /!*  /!*</Descriptions.Item>*!/*!/*/}
                        {/*    /!*  /!*<Descriptions.Item label={t("products.fields.weightPriceUnits")}>*!/*!/*/}
                        {/*    /!*  /!*  {formProps?.initialValues?.weightPriceYandexUnits || "--"}*!/*!/*/}
                        {/*    /!*  /!*</Descriptions.Item>*!/*!/*/}
                        {/*    /!*</Descriptions>*!/*/}
                        {/*  </>*/}

                        {/*)}*/}

                        {/*<Descriptions.Item label={t("products.fields.packageHeader")}>*/}
                        {/*  */}
                        {/*  /!*<Descriptions column={1} bordered={false} size={"small"} colon={true}*!/*/}
                        {/*  /!*              layout={"vertical"}>*!/*/}
                        {/*  /!*  /!*<Descriptions.Item label={t("products.fields.priceInDeliveryToCar")}>*!/*!/*/}
                        {/*  /!*  /!*  {formProps?.initialValues?.priceInDeliveryToCar || "--"}*!/*!/*/}
                        {/*  /!*  /!*</Descriptions.Item>*!/*!/*/}

                        {/*  /!*  /!*<Descriptions.Item label={t("products.fields.priceInDeliveryToHome")}>*!/*!/*/}
                        {/*  /!*  /!*  {formProps?.initialValues?.priceInDeliveryToHome || "--"}*!/*!/*/}
                        {/*  /!*  /!*</Descriptions.Item>*!/*!/*/}
                        {/*  /!*</Descriptions>*!/*/}
                        {/*</Descriptions.Item>*/}

                        <Descriptions.Item label={t("products.fields.weightOrVolume")}>
                          {formProps?.initialValues?.measure || "--"}
                        </Descriptions.Item>

                        <Descriptions.Item label={t("products.fields.units")}>
                          {formProps?.initialValues?.unitsOfMeasure || "--"}
                        </Descriptions.Item>

                        {(productType === EProductType.WEIGHT) ? (
                          <>
                            <Descriptions.Item label={t("products.fields.minWeight")}>
                              {formProps?.initialValues?.minWeight || "--"}
                            </Descriptions.Item>

                            <Descriptions.Item label={t("products.fields.maxWeight")}>
                              {formProps?.initialValues?.maxWeight || "--"}
                            </Descriptions.Item>

                            <Descriptions.Item label={t("products.fields.weightIncrement")}>
                              {formProps?.initialValues?.weightIncrement || "--"}
                            </Descriptions.Item>

                            <Descriptions.Item label={t("products.fields.stepUnits")}>
                              {formProps?.initialValues?.unitsOfMeasure || "--"}
                            </Descriptions.Item>
                          </>
                        ) : (
                          <>
                            {/*<Descriptions.Item label={t("products.fields.calories")}>*/}
                            {/*  {formProps?.initialValues?.calories || "--"}*/}
                            {/*</Descriptions.Item>*/}

                            {/*<Descriptions.Item label={t("products.fields.proteins")}>*/}
                            {/*  {formProps?.initialValues?.proteins || "--"}*/}
                            {/*</Descriptions.Item>*/}

                            {/*<Descriptions.Item label={t("products.fields.fats")}>*/}
                            {/*  {formProps?.initialValues?.fats || "--"}*/}
                            {/*</Descriptions.Item>*/}

                            {/*<Descriptions.Item label={t("products.fields.carbohydrates")}>*/}
                            {/*  {formProps?.initialValues?.carbohydrates || "--"}*/}
                            {/*</Descriptions.Item>*/}
                          </>
                        )}

                        <Descriptions.Item label={t("products.fields.timeForPreparing")}>
                          {formProps?.initialValues?.minReadyTime || "--"}
                        </Descriptions.Item>

                        {/*<Descriptions.Item label={t("products.fields.expirationDate")}>*/}
                        {/*  {formProps?.initialValues?.expirationDate || "--"}*/}
                        {/*</Descriptions.Item>*/}
                      </Descriptions>

                      <Descriptions title={<div style={{marginTop: '16px'}}>Hungry Ninja: <CustomBooleanField value={formProps?.initialValues?.isActive}/></div>}
                                    column={2} size={"small"} layout={"vertical"} bordered>

                        <Descriptions.Item label={t("products.fields.price")}>
                          {formProps?.initialValues?.price || "--"}
                        </Descriptions.Item>

                        <Descriptions.Item label={t("products.fields.priceInDeliveryWithSelf")}>
                          {formProps?.initialValues?.priceInDeliveryWithSelf || "--"}
                        </Descriptions.Item>
                      </Descriptions>

                      <Descriptions title={<div style={{marginTop: '12px'}}>Yandex Eda: <CustomBooleanField value={formProps?.initialValues?.isForYandex}/></div>}
                                    column={2} size={"small"} layout={"vertical"} bordered>
                        <Descriptions.Item label={t("products.fields.price")}>
                          {formProps?.initialValues?.priceYandex || "--"}
                        </Descriptions.Item>

                        <Descriptions.Item label={"Старая цена"}>
                          {formProps?.initialValues?.oldPrice || "--"}
                        </Descriptions.Item>
                      </Descriptions>

                      <Descriptions title={<div style={{marginTop: '12px'}}>SberMarket: <CustomBooleanField value={formProps?.initialValues?.isForSber}/></div>}
                                    column={2} size={"small"} layout={"vertical"} bordered>

                        <Descriptions.Item label={t("products.fields.price")}>
                          {formProps?.initialValues?.priceSber || "--"}
                        </Descriptions.Item>

                        <Descriptions.Item label={"Старая цена"}>
                          {formProps?.initialValues?.priceSberOld || "--"}
                        </Descriptions.Item>
                      </Descriptions>
                    </>
                  ) : (
                    <>
                      <Row gutter={[12, 6]} wrap align="stretch">
                        <Col span={12}>
                          <Form.Item
                            label={t("products.fields.weightOrVolume")}
                            name={["measure"]}
                            rules={[...FORM_COMMON_RULES]}
                          >
                            <InputNumber className={"width-100-pr"} min={0}/>
                          </Form.Item>
                        </Col>

                        <Col span={12}>
                          <Form.Item
                            label={t("products.fields.units")}
                            name={["unitsOfMeasure"]}
                            rules={[...FORM_COMMON_RULES]}
                          >
                            <Select
                              allowClear
                              placeholder={t("products.fields.units")}
                              options={UNIT_LIST}
                            />
                          </Form.Item>
                        </Col>
                      </Row>

                      {(productType === EProductType.WEIGHT) ? (
                        <>
                          <Row gutter={[12, 6]} wrap align="stretch">
                            <Col span={8}>
                              <Form.Item
                                label={t("products.fields.minWeight")}
                                name={["minWeight"]}
                                rules={[...FORM_COMMON_RULES]}
                              >
                                <InputNumber type={"number"} className={"width-100-pr"} min={0}/>
                              </Form.Item>
                            </Col>

                            <Col span={8}>
                              <Form.Item
                                label={t("products.fields.maxWeight")}
                                name={["maxWeight"]}
                                rules={[...FORM_COMMON_RULES]}
                              >
                                <InputNumber type={"number"} className={"width-100-pr"} min={0}/>
                              </Form.Item>
                            </Col>

                            <Col span={8}>
                              <Form.Item
                                label={t("products.fields.weightIncrement")}
                                name={["weightIncrement"]}
                                rules={[...FORM_COMMON_RULES]}
                              >
                                <InputNumber type={"number"} className={"width-100-pr"} min={0}/>
                              </Form.Item>
                            </Col>
                          </Row>
                        </>
                      ) : (
                        <>
                          {/*<Row gutter={[12, 6]} wrap align="stretch">*/}
                          {/*  <Col span={12}>*/}
                          {/*    <Form.Item*/}
                          {/*      label={t("products.fields.calories")}*/}
                          {/*      name={["calories"]}*/}
                          {/*    >*/}
                          {/*      <Input />*/}
                          {/*    </Form.Item>*/}
                          {/*  </Col>*/}

                          {/*  <Col span={12}>*/}
                          {/*    <Form.Item*/}
                          {/*      label={t("products.fields.proteins")}*/}
                          {/*      name={["proteins"]}*/}
                          {/*    >*/}
                          {/*      <Input />*/}
                          {/*    </Form.Item>*/}
                          {/*  </Col>*/}
                          {/*</Row>*/}

                          {/*<Row gutter={[12, 6]} wrap align="stretch">*/}
                          {/*  <Col span={12}>*/}
                          {/*    <Form.Item*/}
                          {/*      label={t("products.fields.fats")}*/}
                          {/*      name={["fats"]}*/}
                          {/*    >*/}
                          {/*      <Input />*/}
                          {/*    </Form.Item>*/}
                          {/*  </Col>*/}

                          {/*  <Col span={12}>*/}
                          {/*    <Form.Item*/}
                          {/*      label={t("products.fields.carbohydrates")}*/}
                          {/*      name={["carbohydrates"]}*/}
                          {/*    >*/}
                          {/*      <Input />*/}
                          {/*    </Form.Item>*/}
                          {/*  </Col>*/}
                          {/*</Row>*/}
                        </>
                      )}

                      <Row gutter={[12, 6]} wrap align="stretch" style={{alignItems: "end"}}>
                        <Col span={24}>
                          <Form.Item
                            label={t("products.fields.timeForPreparing")}
                            name={["minReadyTime"]}
                            rules={[...FORM_COMMON_RULES]}
                          >
                            <Select
                              allowClear
                              placeholder={t("products.fields.timeForPreparing")}
                              options={getReadyTimeList() || []}
                            />
                          </Form.Item>
                        </Col>

                        {/*<Col span={12}>*/}
                        {/*  /!*<Form.Item*!/*/}
                        {/*  /!*  label={t("products.fields.expirationDate")}*!/*/}
                        {/*  /!*  name={["expirationDate"]}*!/*/}
                        {/*  /!*>*!/*/}
                        {/*  /!*  <Input />*!/*/}
                        {/*  /!*</Form.Item>*!/*/}
                        {/*</Col>*/}
                      </Row>

                      {/*<Row gutter={[12, 6]} wrap align="stretch" style={{alignItems: "end"}}>*/}
                      {/*  <Col span={24}>*/}
                      {/*    <Form.Item*/}
                      {/*      label={t("products.fields.timeForPreparing")}*/}
                      {/*      name={["minReadyTime"]}*/}
                      {/*      rules={[...FORM_COMMON_RULES]}*/}
                      {/*    >*/}
                      {/*      <Select*/}
                      {/*        allowClear*/}
                      {/*        placeholder={t("products.fields.timeForPreparing")}*/}
                      {/*        options={getReadyTimeList() || []}*/}
                      {/*      />*/}
                      {/*    </Form.Item>*/}
                      {/*  </Col>*/}

                      {/*  /!*<Col span={12}>*!/*/}
                      {/*  /!*  /!*<Form.Item*!/*!/*/}
                      {/*  /!*  /!*  label={t("products.fields.expirationDate")}*!/*!/*/}
                      {/*  /!*  /!*  name={["expirationDate"]}*!/*!/*/}
                      {/*  /!*  /!*>*!/*!/*/}
                      {/*  /!*  /!*  <Input />*!/*!/*/}
                      {/*  /!*  /!*</Form.Item>*!/*!/*/}
                      {/*  /!*</Col>*!/*/}
                      {/*</Row>*/}

                      <Row gutter={[12, 6]} wrap align="stretch" style={{alignItems: "end"}}>

                        <Col xs={24} sm={24} md={24} lg={24} span={24}>
                          <Form.Item
                            label="Hungry Ninja"
                            name="isActive"
                            valuePropName="checked"
                            className={"product-active-switch-container"}
                          >
                            <Switch size={"small"} disabled={!(_checkFullP(permissions))}/>
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={12} lg={12} span={24}>
                          <Form.Item
                            label={t("products.fields.price")}
                            name="price"
                            rules={[...FORM_COMMON_RULES]}
                          >
                            <InputNumber<string>  min="0" step="1.00" stringMode className={"width-100-pr"}/>
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={12} lg={12} span={24}>
                          <Form.Item
                            label={t("products.fields.priceInDeliveryWithSelf")}
                            name={["priceInDeliveryWithSelf"]}
                          >
                            <InputNumber<string> type={"number"} min="0" step="1.00" stringMode className={"width-100-pr"} />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={24} lg={24} span={24}>
                          <Form.Item
                            label="Yandex Eda"
                            name="isForYandex"
                            valuePropName="checked"
                            className={"product-active-switch-container"}
                          >
                            <Switch size={"small"} disabled={!(_checkFullP(permissions))}/>
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={14} lg={14} span={24}>
                          <div style={{display: 'flex', alignItems: 'center'}}>
                            <Form.Item
                              label={t("products.fields.price")}
                              name="priceYandex"
                            >
                              <InputNumber<string> type={"number"} min="0" step="1.00" stringMode className={"width-100-pr"}/>
                            </Form.Item>

                            <Button type={"primary"} style={{marginLeft: '12px', marginTop: '6px'}} onClick={() => {
                              const hn_price = formProps?.form?.getFieldValue('price')
                              formProps?.form?.setFieldValue('priceYandex', hn_price)
                            }}>
                              <Icons.FormOutlined/>
                            </Button>
                          </div>

                        </Col>

                        <Col xs={24} sm={24} md={10} lg={10} span={24}>
                          <Form.Item
                            label={"Старая цена"}
                            name="oldPrice"
                          >
                            <InputNumber<string>  min="0" step="1.00" stringMode className={"width-100-pr"}/>
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={24} lg={24} span={24}>
                          <Row>
                            <Form.Item
                              label="Sber Market"
                              name="isForSber"
                              valuePropName="checked"
                              className={"product-active-switch-container"}
                            >
                              <Switch size={"small"} disabled={!(_checkFullP(permissions))}/>
                            </Form.Item>
                          </Row>

                        </Col>

                        <Col xs={24} sm={24} md={14} lg={14} span={24}>
                          <div style={{display: 'flex', alignItems: 'center'}}>
                            <Form.Item
                              label={t("products.fields.price")}
                              name="priceSber"
                            >
                              <InputNumber<string> type={"number"} min="0" step="1.00" stringMode className={"width-100-pr"}/>
                            </Form.Item>

                            <Button type={"primary"} style={{marginLeft: '12px', marginTop: '6px'}} onClick={() => {
                              const hn_price = formProps?.form?.getFieldValue('price')
                              formProps?.form?.setFieldValue('priceSber', hn_price)
                            }}>
                              <Icons.FormOutlined/>
                            </Button>
                          </div>
                        </Col>

                        <Col xs={24} sm={24} md={10} lg={10} span={24}>
                          <Form.Item
                            label={"Старая цена"}
                            name="priceSberOld"
                          >
                            <InputNumber<string>  min="0" step="1.00" stringMode className={"width-100-pr"}/>
                          </Form.Item>
                        </Col>
                      </Row>
                    </>
                  )}
                </Col>
              </Row>

            </Card>
          </Col>
        </Row>

        <Card className={"card-block-with-margin"}>
          <Row gutter={[24, 12]} wrap align="stretch">
            <Col xs={24} sm={24} md={24} span={24}>
              <Form.Item
                label={t("products.fields.deliveryOptionsExclude.header")}
                name={["deliveryOptionsExclude"]}
              >
                <DeliveryTypeButtons readonlyMode={readonlyMode || !_checkFullP(permissions)}
                                     excludeMode={true}
                                     deliveryOptions={AllDeliveryTypes.filter(t =>
                                       !outletProps?.deliveryOptionsExclude?.includes(t) &&
                                       outletProps?.market?.deliveryOptions?.includes(t)) || []}
                />
              </Form.Item>

            </Col>
          </Row>
        </Card>


      </Form>

      <OptionGroupsCard
        readonlyMode={readonlyMode || !_checkFullP(permissions)}
        formProps={formProps}
        setDeletedGroups={setDeletedGroups}
        setDeletedOptions={(values, group) => setDeletedOptions(delOptions => [...delOptions, {...values, delete: true, optionGroupId: group.id}])}
      />
    </>
  );
};






