import React, {useEffect, useState} from "react";
import {useList, useTranslate} from "@pankod/refine-core";
import {
  Form,
  Input,
  Select,
  useSelect,
  Row,
  Card,
  Col,
  Button,
  FormProps, TimePicker, Descriptions, BooleanField, Tag, Switch, Icons, Space, notification, Collapse, Tooltip
} from "@pankod/refine-antd";

import {DeleteOutlined, MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {UploadArea} from "components/uploadArea";
import {LocationMap, PolygonMap} from "components/map";
import {DeliveryTypeButtons} from "components/deliveryTypeButtons";

import {
  DATE_FORMAT,
  FORM_COMMON_RULES,
  PLACEHOLDER_TIME_FORMAT,
  TIME_FORMAT,
  USER_DATE_TIME_FORMAT
} from "common/constants";

import {IZone, MARKET_TYPES} from "interfaces/markets";
import {DELIVERY_TYPES, EDeliveryType} from "interfaces/common";
import {IUser} from "interfaces/users";
import dayjs from "dayjs";
import {getUserLabel} from "../../utils";
import {settings} from "../../common/settings";
import Cookies from "js-cookie";
import {EmptyContainer} from "../notFound/NotFound";
import moment from "moment";
import {Link} from "react-router-dom";
import {DatePicker} from "antd";
import 'moment/locale/ru';
import locale from 'antd/es/date-picker/locale/ru_RU';
import {CustomBooleanField} from "../customBooleanField";


type FormMarketProps = {
  formProps: FormProps;
  readonlyMode?: boolean;
};

export const MarketForm: React.FC<FormMarketProps> = ({formProps, readonlyMode = false}) => {
  const t = useTranslate();

  const [showDeliveryStreets, setShowDeliveryStreets] = useState(false);
  const [showDeliveryZone, setShowDeliveryZone] = useState(false);
  const [enabledReadyForPublishing, setEnabledReadyForPublishing] = useState(false);
  const [enabledIsActive, setEnabledIsActive] = useState(false);

  const [location, setLocation] = useState<Array<number>>([]);

  const [editableZone, setEditableZone] = useState<IZone | null>(null);

  const [allPolygons, setAllPolygons] = useState<any>([[], [], []]);
  const [currentZones, setCurrentZones] = useState<Array<any>>([]);

  const [searchUsersValue, setSearchUsersValue] = useState('');

  useEffect(() => {
    setEnabledReadyForPublishing(!formProps.initialValues?.isActive)
    setEnabledIsActive(formProps.initialValues?.isActive || formProps.initialValues?.isEnabled)
    setAllPolygons([
      formProps.initialValues?.deliveryZone1?.coordinates?.[0] || formProps.initialValues?.deliveryZone2?.coordinates?.[0] || formProps.initialValues?.deliveryZone3?.coordinates?.[0] || [],
      formProps.initialValues?.deliveryZone1?.coordinates?.[0] ? formProps.initialValues?.deliveryZone2?.coordinates?.[0] || formProps.initialValues?.deliveryZone3?.coordinates?.[0] || [] : formProps.initialValues?.deliveryZone3?.coordinates?.[0] || [],
      formProps.initialValues?.deliveryZone1?.coordinates?.[0] && formProps.initialValues?.deliveryZone2?.coordinates?.[0] ? formProps.initialValues?.deliveryZone3?.coordinates?.[0] : [],
    ])

    setShowDeliveryZone(!!formProps.initialValues?.deliveryOptions?.includes(EDeliveryType.TO_PLACE))
    setCurrentZones(formProps.initialValues?.zones || [])
    setLocation(formProps?.initialValues?.location?.coordinates || [])
  }, [formProps.initialValues])

  const handleSetTimeToSalePoint = async () => {
    let response = await fetch(`${settings.api.url}/outlets/set_hours_by_market`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${Cookies.get(settings.auth.token)}`
      },
      body: JSON.stringify({
        "workHoursStart": formProps?.initialValues?.workHoursStart,
        "workHoursEnd": formProps?.initialValues?.workHoursEnd,
        "marketId": formProps.initialValues?.id
      })
    });

    if (response.ok) {
      notification.success({
        message: 'Успех!',
        description:
          'Время успешно переписано',
      })
      //return Promise.resolve();
    } else {
      notification.error({
        message: 'Ошибка',
        description:
          'Не удалось изменить расписание точек продаж',
      })
      //alert("Ошибка HTTP: " + response.status);
      //return Promise.reject({name: "Ошибка", message: 'Неверный логин или пароль'});
    }
  }

  const userSelectProps = useList<IUser>({
    resource: "users",
    dataProviderName: "customProvider",
    config: {
      filters: [
        {
          field: "textSearch",
          operator: "eq",
          value: searchUsersValue,
        }]
    }
  });

  const editZones = (zoneIndex: number) => {
    if (!showDeliveryZone) {
      return;
    }
    setEditableZone({polygons: allPolygons[zoneIndex], index: zoneIndex})
  }

  const downZoneList = (field: any) => {
    if (!showDeliveryZone) {
      return;
    }
    const values = formProps.form?.getFieldsValue()
    let zones = values.zones
    if (field.key === 0) {
      zones = zones?.length === 2 ? [zones[1], zones[0]] : [values.zones[1], values.zones[0], values.zones[2]]
      setAllPolygons((ps: any) => zones?.length === 2 ?  [ps[1], ps[0]] : [ps[1], ps[0], ps[2]])
    }
    if (field.key === 1) {
      zones = zones?.length === 2 ? [zones[1], zones[0]] : [zones[0], zones[2], zones[1]]
      setAllPolygons((ps: any) => zones?.length === 2 ?  [ps[1], ps[0]] : [ps[0], ps[2], ps[1]])
    }

    if (field.key === 2) {
      zones = [values.zones[2], values.zones[0], values.zones[1]]
      setAllPolygons((ps: any) => [ps[2], ps[0], ps[1]])
    }
    formProps.form?.setFieldsValue({
      ...values,
      zones: zones
    })
  }

  const upZoneList = (field: any) => {
    if (!showDeliveryZone) {
      return;
    }
    const values = formProps.form?.getFieldsValue()
    let zones = values.zones
    if (field.key === 0) {
      zones = zones?.length === 2 ? [zones[1], zones[0]] : [zones[1], zones[2], zones[0]];
      setAllPolygons((ps: any) => zones?.length === 2 ?  [ps[1], ps[0]] : [ps[1], ps[2], ps[0]])
    }
    if (field.key === 1) {
      zones = zones?.length === 2 ? [zones[1], zones[0]] : [zones[1], zones[0], zones[2]]
      setAllPolygons((ps: any) => zones?.length === 2 ?  [ps[1], ps[0]] : [ps[1], ps[0], ps[2]])
    }
    if (field.key === 2) {
      zones = [zones[0], zones[2], zones[1]]
      setAllPolygons((ps: any) => [ps[0], ps[2], ps[1]])
    }
    formProps.form?.setFieldsValue({
      ...values,
      zones: zones
    })
  }

  const handleSubmit = (values: any) => {
    let requestValues = {
      ...values,
      title: values?.title?.trim(),
      address: values?.address?.trim(),
      cityId: 2,
      // @ts-ignore
      isActive: !!values.isActive,
      isForYandex: !!values.isForYandex,
      isReadyForPublishing: !!values.isReadyForPublishing,
      workHoursStart: !values.workHoursStart ? null : dayjs(values.workHoursStart.format()).format(TIME_FORMAT),
      // @ts-ignore
      workHoursEnd: !values.workHoursEnd ? null : dayjs(values.workHoursEnd.format()).format(TIME_FORMAT),
      location: JSON.stringify( {
        ...values.location,
        "type": "Point",
      }),
      users: values?.users?.length ? JSON.stringify(values?.users?.map((u: IUser) => u?.id || u)) : JSON.stringify([]),
      deliveryOptions: JSON.stringify(values?.deliveryOptions),
      toCarStreets: JSON.stringify(values?.toCarStreets?.map((s: string) => s.trim())),

      contractDate: !values?.contractDate ? null : moment(values?.contractDate).format('YYYY-MM-DD'),

      //{"type": "MultiPolygon","coordinates": [[[[55.75, 37.80],[55.80, 37.90],[55.75, 38.00],[55.70, 38.00],[55.70, 37.80]]]]}
      deliveryZone1: values?.zones?.[0] && allPolygons[0] ? JSON.stringify( {"type": "MultiPolygon","coordinates": [allPolygons[0]]}) : null,
      deliveryZone2: values?.zones?.[1] && allPolygons[1] ? JSON.stringify({"type": "MultiPolygon","coordinates": [allPolygons[1]]}) : null,
      deliveryZone3: values?.zones?.[2] && allPolygons[2] ? JSON.stringify({"type": "MultiPolygon","coordinates": [allPolygons[2]]}) : null,

      deliveryZoneName1: values?.zones?.[0]?.name?.trim() || null,
      deliveryZoneName2: values?.zones?.[1]?.name?.trim() || null,
      deliveryZoneName3: values?.zones?.[2]?.name?.trim() || null,

      deliveryZoneCost1: values?.zones?.[0]?.price || 0,
      deliveryZoneCost2: values?.zones?.[1]?.price || 0,
      deliveryZoneCost3: values?.zones?.[2]?.price || 0,

      //deliveryZoneFreeMinCost
      deliveryZoneFreeMinCost1: values?.zones?.[0]?.limit || 0,
      deliveryZoneFreeMinCost2: values?.zones?.[1]?.limit || 0,
      deliveryZoneFreeMinCost3: values?.zones?.[2]?.limit || 0,
    };

    ["imageVector", "imageRaster"].forEach((f)=> {
      if (formProps.initialValues?.[f] === values?.[f]) {
        delete requestValues[f]
      } else {
        requestValues = {
          ...requestValues,
          [f]: values?.[f]?.length ? values[f][0].originFileObj : null,
        }
      }
    })

    if (formProps.onFinish) {
      formProps.onFinish(requestValues)
    }
  }

  return (
    <Form {...formProps}
      onFinish={handleSubmit}
      scrollToFirstError={{behavior: 'smooth', inline: 'center'}}
      onFieldsChange={(changedFields, allFields) => {
        const values = formProps.form?.getFieldsValue()
        setCurrentZones(values?.zones || [])
        //console.log(changedFields)
        // @ts-ignore
        if (changedFields.length && changedFields[0].name?.length && changedFields[0].name.includes("deliveryOptions")) {
          setShowDeliveryStreets(changedFields[0].value.includes(EDeliveryType.TO_CAR))
          setShowDeliveryZone(changedFields[0].value.includes(EDeliveryType.TO_PLACE))
        }

        // @ts-ignore
        if (changedFields.length && changedFields[0].name?.length && changedFields[0].name.includes("zones") && changedFields[0].name.includes("price")) {
          formProps.form?.validateFields(['zones'])
        }

        // @ts-ignore
        // if (changedFields.length && changedFields[0].name?.length && changedFields[0].name.includes("coordinates") && (changedFields[0].name[2] === 0 || changedFields[0].name[2])) {
        //   setLocation((ls) => {
        //     // @ts-ignore
        //     ls[changedFields[0].name[2]] = parseFloat(changedFields[0].value)
        //     return ls
        //   })
        // }
      }}
      layout="vertical"
      // validateTrigger={"submit"}
    >

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


      <Card className={"card-block-with-margin"}>
        <Row gutter={[24, 12]} wrap align="stretch">

          <Col xs={24} sm={24} md={8} span={8}>
            <Form.Item className={readonlyMode ? "" : "required-field"} label={t("markets.fields.image_url")}>
              <Form.Item name="imageVector" valuePropName="fileList"
                         rules={[...FORM_COMMON_RULES]}
                         getValueFromEvent={(e: any) => {
                           return Array.isArray(e) ? e : e?.fileList
                         }}
                         noStyle>
                <UploadArea name={"imageVectorFile"} readonlyMode={readonlyMode}/>
              </Form.Item>
            </Form.Item>


            <Form.Item label={t("markets.fields.image_mobile_url")}>
              <Form.Item name="imageRaster" valuePropName="fileList"
                         getValueFromEvent={(e: any) => Array.isArray(e) ? e : e?.fileList}
                         noStyle>
                <UploadArea name={"imageRasterFile"} readonlyMode={readonlyMode}/>
              </Form.Item>
            </Form.Item>

          </Col>

          <Col xs={24} sm={24} md={8} span={8}>

            {readonlyMode ? (
              <Descriptions title="Информация о маркете" column={1} bordered={true} size={"middle"}
                            layout={"vertical"}>
                <Descriptions.Item label={t("markets.fields.title")}>
                  {formProps?.initialValues?.title || "--"}
                </Descriptions.Item>
                {/*<Descriptions.Item label={t("markets.fields.type.label")}>*/}
                {/*  {formProps?.initialValues?.type || "(в данный момент недоступно)"}</Descriptions.Item>*/}

                <Descriptions.Item label={t("markets.fields.is_accept_published")}>
                  <CustomBooleanField value={formProps?.initialValues?.isReadyForPublishing}/></Descriptions.Item>
                <Descriptions.Item label={t("markets.fields.is_published")}>
                  <CustomBooleanField value={formProps?.initialValues?.isActive}/></Descriptions.Item>
                <Descriptions.Item label={t("markets.fields.isForYandex")}>
                  <CustomBooleanField value={formProps?.initialValues?.isForYandex}/>
                </Descriptions.Item>
                <Descriptions.Item label={t("markets.fields.fullAddress")}>
                  {formProps?.initialValues?.address || "--"}
                </Descriptions.Item>

                <Descriptions.Item label={t("markets.fields.coordinate")}>
                  <a href={`https://yandex.ru/maps/?pt=${formProps?.initialValues?.location?.coordinates?.[1]},${formProps?.initialValues?.location?.coordinates?.[0]}&z=15&l=map`} target={"_blank"}>
                    {formProps?.initialValues?.location?.coordinates[0]}, {formProps?.initialValues?.location?.coordinates[1]}</a>
                </Descriptions.Item>

                <Descriptions.Item label={"Расписание"}>
                  <span>{formProps?.initialValues?.workHoursStart || "--"} - {formProps?.initialValues?.workHoursEnd || "--"}</span>

                  <div style={{marginTop: 6, display: 'flex', justifyContent: 'end', maxWidth: '100%'}}>
                    <Button className={"width-100-pr"} type={"primary"} size={"small"} onClick={handleSetTimeToSalePoint}>
                      Применить к точкам продаж
                    </Button>
                  </div>
                </Descriptions.Item>

                <Descriptions.Item label={t("markets.fields.users")}>
                  {formProps?.initialValues?.users?.map((u: any) => <Tag>{getUserLabel(u)}</Tag>) || "--"}
                </Descriptions.Item>

                <Descriptions.Item label={"ID для Этикета"}>
                  {formProps?.initialValues?.etiquetteId || "--"}
                </Descriptions.Item>

              </Descriptions>
            ) : (
              <>
                <Form.Item
                  label={t("markets.fields.title")}
                  name="title"
                  rules={[...FORM_COMMON_RULES]}>
                  <Input value={""}/>
                </Form.Item>

                {/*<Form.Item*/}
                {/*  label={t("markets.fields.type.label")}*/}
                {/*  name="type"*/}
                {/*>*/}
                {/*  <Select*/}
                {/*    allowClear*/}
                {/*    placeholder={t("markets.fields.type.placeholder")}*/}
                {/*    options={MARKET_TYPES}*/}
                {/*  />*/}
                {/*</Form.Item>*/}

                <Form.Item
                  label={t("markets.fields.is_accept_published")}
                  name="isReadyForPublishing"
                  valuePropName="checked"
                >
                  <Switch size={"small"} disabled={!enabledReadyForPublishing}/>
                </Form.Item>

                <Form.Item
                  label={t("markets.fields.is_published")}
                  name="isActive"
                  valuePropName="checked"
                >
                  <Switch size={"small"}/>
                  {/*<Switch size={"small"} disabled={!enabledIsActive}/>*/}
                </Form.Item>

                <Form.Item
                  label={t("markets.fields.isForYandex")}
                  name="isForYandex"
                  valuePropName="checked"
                >
                  <Switch size={"small"}/>
                </Form.Item>

                <Form.Item
                  label={t("markets.fields.fullAddress")}
                  name="address"
                >
                  <Input />
                </Form.Item>

                <Form.Item label={t("markets.fields.coordinate")}>
                  <Row gutter={[12, 6]} wrap align="stretch">
                    <Col span={12}>
                      <Form.Item
                        label={''}
                        rules={[...FORM_COMMON_RULES]}
                        name={["location", "coordinates", 0]}
                        className={"block-without-margin"}
                      >
                        <Input />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        label={''}
                        rules={[...FORM_COMMON_RULES]}
                        name={["location", "coordinates", 1]}
                        className={"block-without-margin"}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form.Item>

                <Form.Item label={t("markets.fields.work_time")}>
                  <Row gutter={[12, 6]} wrap align="stretch">
                    <Col span={12}>
                      <Form.Item
                        label={''}
                        rules={[...FORM_COMMON_RULES]}
                        name={["workHoursStart"]}
                        getValueFromEvent={(value: any) => {
                          return value
                        }}
                        className={"block-without-margin"}
                      >
                        <TimePicker
                          onSelect={(v) => {
                            const values = formProps?.form?.getFieldsValue();
                            formProps?.form?.setFieldsValue({
                              ...values,
                              "workHoursStart": v
                            })
                          }}
                          placeholder={""} format={PLACEHOLDER_TIME_FORMAT}  className={"width-100-pr"} />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        label={''}
                        rules={[...FORM_COMMON_RULES]}
                        name={["workHoursEnd"]}
                        className={"block-without-margin"}
                      >
                        <TimePicker placeholder={""} format={PLACEHOLDER_TIME_FORMAT} className={"width-100-pr"} />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form.Item>

                {/*//TODO: заглушка против бага */}
                {/*<Form.Item*/}
                {/*  label={t("markets.fields.users")}*/}
                {/*  name="users"*/}
                {/*>*/}
                {/*  <Select*/}
                {/*    showSearch*/}
                {/*    allowClear={true}*/}
                {/*    mode={"multiple"}*/}
                {/*    notFoundContent={null}*/}
                {/*    defaultActiveFirstOption={false}*/}
                {/*    showArrow={false}*/}
                {/*    filterOption={false}*/}
                {/*    onSearch={(value) => {*/}
                {/*      //if (userSelectProps.onSearch) {*/}
                {/*      setSearchUsersValue(value);*/}
                {/*      //}*/}
                {/*    }}*/}
                {/*  >*/}
                {/*    { (formProps?.initialValues?.users && !userSelectProps?.data?.data?.length) ? (*/}
                {/*      [formProps?.initialValues?.users].map(u => <Select.Option key={u.id} value={u.id}>{getUserLabel(u)}</Select.Option>)*/}
                {/*    ) : (*/}
                {/*      userSelectProps?.data?.data?.map(u => <Select.Option key={u.id} value={u.id}>{getUserLabel(u)}</Select.Option>)*/}
                {/*    )}*/}
                {/*  </Select>*/}
                {/*</Form.Item>*/}

                <Form.Item
                  label={"ID для Этикета"}
                  name="etiquetteId"
                >
                  <Input />
                </Form.Item>


              </>
            )}


          </Col>

          <Col xs={24} sm={24} md={8} span={8}>
            <div className="ant-form-item-label">
              <label>Отображение на карте</label>
            </div>

            <LocationMap form={formProps.form}
                         readonlyMode={readonlyMode}
                         initialCoordinates={location}
                         onLocationChange={(coords) => setLocation(coords)}
                         fields={["location", "coordinates"]}/>
          </Col>

        </Row>
      </Card>

      <Card className={"card-block-with-margin"}>
        <Row gutter={[24, 12]} wrap align="stretch">
          <Col xs={24} sm={24} md={24} xl={8} span={8}>
            <Form.Item
              label={t("markets.fields.delivery.type")}
              name={["deliveryOptions"]}
            >
              <DeliveryTypeButtons readonlyMode={readonlyMode}/>
            </Form.Item>

            <span>
                {readonlyMode ? (
                  <Descriptions title="Список улиц" column={1} bordered={true} size={"middle"} style={{marginBottom: '24px'}}
                                layout={"vertical"}>
                    <Descriptions.Item label={"Улицы"}>
                      {formProps?.initialValues?.toCarStreets?.map((s: any) => <Tag>{s}</Tag>) || "--"}
                    </Descriptions.Item>
                  </Descriptions>
                ) : (
                  <Form.List
                    name={["toCarStreets"]}
                  >
                    {(fields, { add, remove }, { errors }) => (
                      <>
                        <div className="ant-form-item-label">
                          <label>{t("markets.fields.delivery.streets.label")}</label>
                        </div>

                        {fields.map((field) => (
                          <Form.Item
                            label={''}
                            style={{display: 'flex'}}
                            required={false}
                            key={field.key}
                          >
                            <Form.Item
                              {...field}
                              noStyle
                            >
                              <Input disabled={!showDeliveryStreets} style={{width: '80%'}} placeholder={t("markets.fields.delivery.streets.placeholder")} />
                            </Form.Item>
                            <MinusCircleOutlined disabled={!showDeliveryStreets}
                                                 className="dynamic-delete-button"
                              onClick={() => {
                                if (!showDeliveryStreets) {
                                  return
                                }
                                remove(field.name)
                              }}
                            />
                          </Form.Item>
                        ))}
                        <Form.Item>
                          <Button
                            type="dashed"
                            disabled={!showDeliveryStreets}
                            onClick={() => add()}
                            icon={<PlusOutlined />}
                          >
                            Добавить улицу
                          </Button>
                          <Form.ErrorList errors={errors} />
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                )}
              </span>

            <span className={"delivery-zone-wrapper"}>
                {readonlyMode ? (
                  <Descriptions title="Список зон доставки" className={"zones-market-description"} column={3} bordered={true} size={"middle"}
                                layout={"vertical"}>
                    <Descriptions.Item label={"Название"} className={"zones-market-header"}>{''}</Descriptions.Item>
                    <Descriptions.Item label={"Стоимость доставки, руб"} className={"zones-market-header"}>{''}</Descriptions.Item>
                    <Descriptions.Item label={"Лимит заказа, руб"} className={"zones-market-header"}>{''}</Descriptions.Item>
                    {formProps?.initialValues?.zones?.map((s: any) =>
                      <>
                        <Descriptions.Item className={"zones-market-item"} label={""}>
                          {s.name}
                        </Descriptions.Item>
                        <Descriptions.Item className={"zones-market-item"} labelStyle={{display: "none"}} label={""}>
                          {s.price}
                        </Descriptions.Item>
                        <Descriptions.Item className={"zones-market-item"} labelStyle={{display: "none"}} label={""}>
                          {s.limit}
                        </Descriptions.Item>
                      </>
                    ) || "--"}

                  </Descriptions>
                ) : (
                  <Form.List
                    name={["zones"]}
                  >
                    {(fields, { add, remove }, { errors }) => (
                      <>
                        <div className="ant-form-item-label">
                          <label>{t("markets.fields.delivery.zone.label")}</label>
                        </div>

                        <Descriptions title="" column={5} size={"small"}
                                      layout={"vertical"}>
                          {fields.map((field, index) => (
                            <>
                              {(currentZones?.length > 1) && (
                                <Descriptions.Item label={""} style={{width: '36px', paddingTop: '8px'}}>
                                  <Icons.CaretDownOutlined
                                    style={{fontSize: '13px'}}
                                    onClick={() => downZoneList(field)}
                                    className="dynamic-sort-button"
                                  />
                                  <Icons.CaretUpOutlined
                                    style={{fontSize: '13px'}}
                                    onClick={() => upZoneList(field)}
                                    className="dynamic-sort-button"
                                  />
                                </Descriptions.Item>
                              )}

                              <Descriptions.Item className={"zones-market-header"} label={"Название"}>
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'name']}
                                >
                                  <Input readOnly={!showDeliveryZone}
                                         disabled={!showDeliveryZone} placeholder={t("markets.fields.delivery.streets.placeholder")} />
                                </Form.Item>
                              </Descriptions.Item>

                              <Descriptions.Item className={"zones-market-header"} label={"Стоимость"}>
                                <Form.Item
                                  name={[field.name, 'price']}
                                  validateTrigger={['onChange']}
                                  rules={[
                                    ...FORM_COMMON_RULES,
                                    ({ getFieldValue }) => ({
                                      validator(_, value) {
                                        if (value < 0) {
                                          return Promise.reject({message: 'Не может быть отрицательным'});
                                        }
                                        const zones = getFieldValue('zones')
                                        const isFailureMinPrice = zones?.some((z: any, i: number) => +z?.price < +value && i > index)
                                        const isFailureMaxPrice = zones?.some((z: any, i: number) => {
                                          return +z?.price > +value && i < index
                                        })
                                        if (!isFailureMinPrice && !isFailureMaxPrice) {
                                          return Promise.resolve();
                                        }
                                        return Promise.reject({message: !isFailureMinPrice ? 'Ниже соседних значений' : 'Превышает соседние значения'});
                                      },
                                    }),
                                  ]}
                                >
                                  <Input readOnly={!showDeliveryZone}
                                         disabled={!showDeliveryZone} min={0} type={"number"} placeholder={"Стоимость доставки"} />
                                </Form.Item>
                              </Descriptions.Item>

                              <Descriptions.Item className={"zones-market-header"} label={"Лимит"}>
                                <Form.Item
                                  name={[field.name, 'limit']}
                                  validateTrigger={['onChange']}
                                  rules={[
                                    ...FORM_COMMON_RULES,
                                    ({ getFieldValue }) => ({
                                      validator(_, value) {
                                        if (value < 0) {
                                          return Promise.reject({message: 'Не может быть отрицательным'});
                                        }
                                        return Promise.resolve();
                                      },
                                    }),
                                  ]}
                                >
                                  <Input min={0}
                                         disabled={!showDeliveryZone} readOnly={!showDeliveryZone} type={"number"} placeholder={"Лимит на доставку"} />
                                </Form.Item>
                              </Descriptions.Item>

                              <Descriptions.Item label={""} style={{width: '72px'}}>
                                <>
                                  <Icons.EditOutlined
                                    className="dynamic-delete-button"
                                    disabled={!showDeliveryZone}
                                    onClick={() => editZones(field.key)}
                                  />
                                  <MinusCircleOutlined
                                    className="dynamic-delete-button"
                                    disabled={!showDeliveryZone}
                                    onClick={() => {
                                      if (!showDeliveryZone) {
                                        return;
                                      }
                                      setAllPolygons((ps: any) => {
                                        return ps.filter((_: any, i: number) => i !== field.key)
                                      })
                                      remove(field.name)
                                    }}
                                  />
                                </>
                              </Descriptions.Item>

                            </>
                          ))}
                        </Descriptions>

                        {fields?.length < 3 && (
                          <Form.Item>
                            <Button
                              type="dashed"
                              disabled={!showDeliveryZone}
                              onClick={() => add()}
                              icon={<PlusOutlined />}
                            >
                              Добавить зону
                            </Button>
                            <Form.ErrorList errors={errors} />
                          </Form.Item>
                        )}
                      </>
                    )}
                  </Form.List>
                )}
              </span>
          </Col>

          <Col xs={24} sm={24} md={24} xl={16} span={16}>

            <span>
              <div className="ant-form-item-label">
                <label>Зоны доставки на карте</label>
              </div>

              <PolygonMap marketPoint={location} allPolygons={allPolygons} editableZone={editableZone} onChange={(polygons) => {
                setAllPolygons((ps: any)=> {
                  return ps.map((p: any, i: number) => i !== editableZone?.index ? p : polygons)
                })
              }}/>
            </span>
          </Col>
        </Row>
      </Card>

      <Card>
        <Row gutter={[24, 12]} wrap align="stretch">
          <Col span={24}>
            {readonlyMode ? (
              <Descriptions title="Юридическая и финансовая информация" column={3} bordered={true} size={"middle"}
                            layout={"vertical"}>
                <Descriptions.Item label={t("contracts.fields.number")}>
                  {formProps?.initialValues?.contractNumber || "--"}
                </Descriptions.Item>
                <Descriptions.Item label={t("contracts.fields.person")}>
                  {formProps?.initialValues?.contractPerson || "--"}
                </Descriptions.Item>
                <Descriptions.Item label={"Дата подписания"}>
                  {formProps?.initialValues?.contractDate?.format("DD MMMM YYYY") || "--"}
                </Descriptions.Item>

                <Descriptions.Item label={t("contracts.fields.inn")}>
                  {formProps?.initialValues?.contractInn || "--"}
                </Descriptions.Item>
                <Descriptions.Item label={t("contracts.fields.checkAccount")}>
                  {formProps?.initialValues?.contractCheckAccount || "--"}
                </Descriptions.Item>

                <Descriptions.Item label={t("contracts.fields.bankIdCode")}>
                  {formProps?.initialValues?.contractBankIdCode || "--"}
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <>
                <Row wrap>
                  <div className="ant-form-item-label">
                    <label>Юридическая и финансовая информация</label>
                  </div>
                </Row>

                <Row gutter={[24, 12]} className={"row-with-margin-12"}>
                  <Col xs={24} md={8}>
                    <Form.Item name="contractNumber" label={t("contracts.fields.number")}>
                      <Input disabled={readonlyMode}/>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item name="contractPerson" label={t("contracts.fields.person")}>
                      <Input disabled={readonlyMode}/>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item name="contractDate" label={"Дата подписания"}>
                      <DatePicker disabled={readonlyMode} format={DATE_FORMAT} locale={locale} style={{width: '100%'}}/>
                    </Form.Item>
                  </Col>
                  {/*<Col xs={24} md={8}>*/}
                  {/*  <Form.Item name="contracts" label={t("contracts.fields.legalAddress")}>*/}
                  {/*    <Input/>*/}
                  {/*  </Form.Item>*/}
                  {/*</Col>*/}
                  {/*<Col xs={24} md={8}>*/}
                  {/*  <Form.Item name="contracts" label={t("contracts.fields.phone")}>*/}
                  {/*    <Input/>*/}
                  {/*  </Form.Item>*/}
                  {/*</Col>*/}
                  {/*<Col xs={24} md={8}>*/}
                  {/*  <div className="ant-form-item-label"><label>{t("contracts.fields.dates")}</label></div>*/}
                  {/*  <Input readOnly={true} value={`${c.signedAt} - ${c.expiresAt}`}/>*/}
                  {/*</Col>*/}
                </Row>
                <Row gutter={[24, 12]} className={"row-with-margin-12"}>
                  <Col xs={24} md={6}>
                    <Form.Item name="contractInn" label={t("contracts.fields.inn")}>
                      <Input disabled={readonlyMode}/>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={6}>
                    <Form.Item name="contractCheckAccount" label={t("contracts.fields.checkAccount")}>
                      <Input disabled={readonlyMode}/>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={6}>
                    <Form.Item name="contractBankIdCode" label={t("contracts.fields.bankIdCode")}>
                      <Input disabled={readonlyMode}/>
                    </Form.Item>
                  </Col>
                  {/*<Col xs={24} md={6}>*/}
                  {/*  <Form.Item name="contractPsrn" label={t("contracts.fields.psrn")}>*/}
                  {/*    <Input readOnly={readonlyMode}/>*/}
                  {/*  </Form.Item>*/}
                  {/*</Col>*/}
                </Row>

              </>
            )}


          </Col>
        </Row>
      </Card>
    </Form>
  );
};
