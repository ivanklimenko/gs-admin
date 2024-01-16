import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {useList, useOne, usePermissions, useTranslate} from "@pankod/refine-core";
import {
  Form,
  Input,
  Select,
  useSelect,
  Row,
  Card,
  Col,
  Button,
  Collapse,
  FormProps,
  TimePicker,
  Tooltip,
  Icons,
  Descriptions,
  BooleanField,
  Tag, notification, Switch, Space,
} from "@pankod/refine-antd";

import {DeleteOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";
import dayjs from "dayjs";
import moment from "moment";

import {LocationMap} from "components/map";
import {UploadArea} from "components/uploadArea";
import {
  DATE_FORMAT,
  FORM_COMMON_RULES,
  PLACEHOLDER_TIME_FORMAT,
  TIME_FORMAT
} from "common/constants";
import { IMarket } from "interfaces/markets";
import {EOutletType, IOutlet, OUTLETS_TYPES} from "interfaces/outlets";
import {IContract} from "interfaces/contracts";
import {ICategory, ILocalCategory} from "interfaces/tags";
import { CategoriesTable } from "./CategoriesTable";
import {EmptyContainer} from "../notFound/NotFound";
import {EUserRole, IUser} from "interfaces/users";
import {_checkFullP, getUserLabel} from "../../utils";
import {DeliveryTypeButtons} from "../deliveryTypeButtons";
import {CustomBooleanField} from "../customBooleanField";

type FormOutletProps = {
  formProps: FormProps;
  readonlyMode?: boolean;
  marketProps?: IMarket | null;
  changeMarket?: Dispatch<SetStateAction<number | null>>
};


export const OutletForm: React.FC<FormOutletProps> = ({
                                                        formProps,
                                                        marketProps,
                                                        changeMarket,
                                                        readonlyMode= false}) => {
  const t = useTranslate();
  const { data: permissions } = usePermissions<Array<string>>();

  const [enabledReadyForPublishing, setEnabledReadyForPublishing] = useState(false);
  const [enabledIsActive, setEnabledIsActive] = useState(false);
  const [isNetworkPoint, setIsNetworkPoint] = useState(formProps.initialValues?.type === EOutletType.NETWORK);

  useEffect(() => {
    setEnabledReadyForPublishing(!formProps.initialValues?.isActive)
    setEnabledIsActive(formProps.initialValues?.isActive || formProps.initialValues?.isEnabled)
    setIsNetworkPoint(formProps.initialValues?.type === EOutletType.NETWORK)
  }, [formProps.initialValues])

  const [showMapCard, setShowMapCard] = useState(false);
  const [showMarketId, setShowMarketId] = useState(true);
  const [deletedCategories, setDeletedCategories] = useState<Array<ILocalCategory>>([]);
  const [searchUsersValue, setSearchUsersValue] = useState('');

  useEffect(() => {
    if (formProps.initialValues?.type === EOutletType.MARKET) {
      changeMarket?.(formProps.initialValues.marketId)
      setShowMarketId(true)
    } else {
      setShowMarketId(false)
    }
  }, [formProps.initialValues])


  const userSelectProps = useList<IUser>({
    resource: "users",
    dataProviderName: "customProvider",
    config: {
      filters: [
        {
          field: "textSearch",
          operator: "eq",
          value: searchUsersValue,
        },
        {
          field: "isPermissions",
          operator: "eq",
          value: _checkFullP(permissions),
        }
      ]
    }
  });

  const {selectProps: marketsSelectProps} = useSelect<IMarket>({
    resource: "markets",
    dataProviderName: "autocompleteProvider",
    filters: [{
      field: "isNetwork",
      operator: "eq",
      value: isNetworkPoint,
    }]
  });

  const {selectProps: categoryTagsSelectProps} = useSelect<ICategory>({
    resource: "tags",
    filters: [{
      field: "type",
      operator: "eq",
      value: "category",
    }],
    dataProviderName: "autocompleteProvider"
  });


  return (
    <Form {...formProps}
          onFinish={(values) => {
            if (!values?.categories?.length) {
              notification.error({message: "Добавьте категории"})
              return
            }

            const localCategories: Array<ILocalCategory> = values?.categories?.length ? [...values?.categories, ...deletedCategories] : values?.categories

            let requestValues = {
              ...values,
              title: values?.title?.trim(),
              marketId: values.type === EOutletType.POINT ? "null" : values.marketId,
              //isOsz: values.type === EOutletType.POINT,
              isNetwork: values.type === EOutletType.NETWORK,
              users: JSON.stringify(values?.users?.map((u: IUser) => u?.id || u)),
              isActive: !!values.isActive,
              isEnabled: !!values.isEnabled,
              isForYandex: !!values.isForYandex,
              isReadyForPublishing: !!values.isReadyForPublishing,
              workHoursStart: !values.workHoursStart ? null : dayjs(values.workHoursStart.format()).format(TIME_FORMAT),
              workHoursEnd: !values.workHoursEnd ? null : dayjs(values.workHoursEnd.format()).format(TIME_FORMAT),
              deliveryOptionsExclude: JSON.stringify(values?.deliveryOptionsExclude),
              location: JSON.stringify( {
                ...values.location
              }),
              contracts: values.contracts ? JSON.stringify(values.contracts.map((c:any) => c.id ? c.id : c)) : JSON.stringify([]),
              categories: JSON.stringify(localCategories?.map((c: ILocalCategory) => {
                const category = {
                  ...c
                }
                if (category?.id && `${category?.id}`?.includes('temp')) {
                  // @ts-ignore
                  delete category.id
                }
                return category
              })),
            };

            ["imageBkgSite", "imageBkgMobile", "imageLogoWhite", "imageLogoColor"].forEach((f)=> {
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
          }}
          onFieldsChange={(changedFields) => {
            // @ts-ignore
            if (changedFields.length && changedFields[0].name?.length && changedFields[0].name.includes("type")) {
              setShowMapCard(!changedFields[0].value.includes(EOutletType.MARKET));
              setShowMarketId(!changedFields[0].value.includes(EOutletType.POINT));
              setIsNetworkPoint(!changedFields[0].value.includes(EOutletType.NETWORK));
            }
            // @ts-ignore
            // if (changedFields.length && changedFields[0].name?.length && changedFields[0].name?.includes("deliveryOptionsExclude")) {
            //   setShowDeliveryStreets(changedFields[0].value.includes(EDeliveryType.TO_CAR));
            //   setShowDeliveryZone(changedFields[0].value.includes(EDeliveryType.TO_PLACE));
            // }
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

      <Form.Item
        hidden={true}
        name="categories"
      >
      </Form.Item>

      <Row gutter={[24, 12]} wrap align="stretch">
        <Col xs={24} sm={24} md={24} span={24}>
          <Card className={"card-block-with-margin"}>
            <Row gutter={[24, 12]} wrap align="stretch">
              <Col xs={24} sm={24} md={12} xl={8}>

                <Form.Item label={t("outlets.fields.imageBkgSite")}>
                  <Form.Item name="imageBkgSite" valuePropName="fileList"
                             getValueFromEvent={(e: any) => {
                               return Array.isArray(e) ? e : e?.fileList
                             }}
                             noStyle>
                    <UploadArea name={"imageBkgSite"} readonlyMode={readonlyMode}/>
                  </Form.Item>
                </Form.Item>

                <Form.Item label={t("outlets.fields.imageBkgMobile")}>
                  <Form.Item name="imageBkgMobile" valuePropName="fileList"
                             getValueFromEvent={(e: any) => Array.isArray(e) ? e : e?.fileList}
                             noStyle>
                    <UploadArea name={"imageBkgMobile"} readonlyMode={readonlyMode}/>
                  </Form.Item>
                </Form.Item>

                <Row gutter={[24, 12]}>
                  <Col span={12}>
                    <Form.Item label={t("outlets.fields.imageLogoWhite")}>
                      <Form.Item name="imageLogoWhite" valuePropName="fileList"
                                 getValueFromEvent={(e: any) => Array.isArray(e) ? e : e?.fileList}
                                 noStyle>
                        <UploadArea name={"imageLogoWhite"} readonlyMode={readonlyMode}/>
                      </Form.Item>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={t("outlets.fields.imageLogoColor")}>
                      <Form.Item name="imageLogoColor" valuePropName="fileList"
                                 getValueFromEvent={(e: any) => Array.isArray(e) ? e : e?.fileList}
                                 noStyle>
                        <UploadArea name={"imageLogoColor"} readonlyMode={readonlyMode}/>
                      </Form.Item>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>

              <Col xs={24} sm={24} md={12} xl={8}>

                {readonlyMode ? (
                  <Descriptions title="Информация о точке продажи" column={1} bordered={true} size={"middle"}
                                layout={"vertical"}>
                    <Descriptions.Item label={t("outlets.fields.title")}>
                      {formProps?.initialValues?.title || "--"}
                    </Descriptions.Item>
                    <Descriptions.Item label={t("outlets.fields.subtitle")}>
                      {formProps?.initialValues?.subtitle || "--"}
                    </Descriptions.Item>
                    <Descriptions.Item label={t("outlets.fields.locationType.label")}>
                      {formProps?.initialValues?.type || "--"}</Descriptions.Item>
                    <Descriptions.Item label={t("outlets.fields.marketId")}>
                      {!formProps?.initialValues?.marketId ? (
                        formProps?.initialValues?.location?.coordinates && (
                          <a href={`https://yandex.ru/maps/?pt=${formProps?.initialValues.location?.coordinates?.[1]},${formProps?.initialValues.location?.coordinates?.[0]}&z=15&l=map`} target={"_blank"}>
                            {formProps?.initialValues.location?.coordinates?.[0]}, {formProps?.initialValues.location?.coordinates?.[1]}</a>
                        )
                      ) : (
                        !formProps?.initialValues?.marketId ? '--' : <Link to={`/markets/show/${formProps?.initialValues?.marketId || ''}`}  target={"_blank"}>{marketProps?.title || 'Локация (пока без тайтла)'}</Link>
                      )}
                    </Descriptions.Item>

                    <Descriptions.Item label={"Дата начала работы"}>
                      {formProps?.initialValues?.workHoursStart || "--"}
                    </Descriptions.Item>
                    <Descriptions.Item label={"Дата окончания работы"}>
                      {formProps?.initialValues?.workHoursEnd || "--"}
                    </Descriptions.Item>

                    <Descriptions.Item label={t("outlets.fields.users")}>
                      {formProps?.initialValues?.users?.map((u: any) => <Tag>{getUserLabel(u)}</Tag>) || "--"}
                    </Descriptions.Item>

                  </Descriptions>
                ) : (
                  <>
                    <Form.Item
                      label={t("outlets.fields.title")}
                      name="title"
                      rules={[...FORM_COMMON_RULES]}
                    >
                      <Input value={""} readOnly={readonlyMode}/>
                    </Form.Item>

                    <Form.Item
                      label={t("outlets.fields.subtitle")}
                      name="subtitle"
                      rules={[...FORM_COMMON_RULES]}
                    >
                      <Input value={""} readOnly={readonlyMode}/>
                    </Form.Item>

                    <Form.Item
                      label={t("outlets.fields.locationType.label")}
                      name="type"
                    >
                      <Select
                        allowClear={false}
                        disabled={readonlyMode || !(_checkFullP(permissions))}
                        placeholder={t("outlets.fields.locationType.placeholder")}
                        options={OUTLETS_TYPES}
                      />
                    </Form.Item>

                    {showMarketId && (
                      <Form.Item
                        rules={[...FORM_COMMON_RULES]}
                        label={<Space>
                          {t("outlets.fields.marketId")}
                          {!formProps?.initialValues?.marketId ? null : <Link to={`/markets/show/${marketProps?.id || ''}`} target={"_blank"}><Icons.LinkOutlined/></Link>}
                        </Space>}
                        name="marketId"
                      >
                        <Select
                          showSearch
                          disabled={readonlyMode || !(_checkFullP(permissions))}
                          notFoundContent={null}
                          defaultActiveFirstOption={false}
                          showArrow={true}
                          filterOption={false}
                          onSearch={(value) => {
                            if (marketsSelectProps.onSearch) {
                              marketsSelectProps.onSearch(value);
                            }
                          }}
                          allowClear={false}
                          placeholder={t("outlets.fields.marketId")}
                        >
                          { (marketProps?.id && !marketsSelectProps?.options?.length) ? (
                            [marketProps].map(d => <Select.Option key={d?.id} value={d?.id}>{d?.title}</Select.Option>)
                          ) : (
                            marketsSelectProps?.options?.map(d => <Select.Option key={d.value} value={d.value}>{d.label}</Select.Option>)
                          )}
                        </Select>
                      </Form.Item>
                    )}

                    <Form.Item label={t("outlets.fields.workTime")}>
                      <Row gutter={[12, 6]} wrap align="stretch">
                        <Col span={12}>
                          <Form.Item
                            label={''}
                            rules={[...FORM_COMMON_RULES]}
                            name={["workHoursStart"]}
                            className={"block-without-margin"}
                          >
                            <TimePicker inputReadOnly={readonlyMode} placeholder={""} format={PLACEHOLDER_TIME_FORMAT} className={"width-100-pr"} />
                          </Form.Item>
                        </Col>

                        <Col span={12}>
                          <Form.Item
                            label={''}
                            rules={[...FORM_COMMON_RULES]}
                            name={["workHoursEnd"]}
                            className={"block-without-margin"}
                          >
                            <TimePicker inputReadOnly={readonlyMode} placeholder={""} format={PLACEHOLDER_TIME_FORMAT} className={"width-100-pr"} />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form.Item>

                    <Form.Item
                      label={t("outlets.fields.users")}
                      name="users"
                    >
                      <Select
                        showSearch
                        mode={"multiple"}
                        disabled={!(_checkFullP(permissions))}
                        allowClear={true}
                        notFoundContent={null}
                        defaultActiveFirstOption={false}
                        showArrow={false}
                        filterOption={false}
                        onSearch={(value) => {
                          setSearchUsersValue(value)
                          // if (userSelectProps.onSearch) {
                          //   userSelectProps.onSearch(value);
                          // }
                        }}
                      >
                        { (formProps?.initialValues?.users && !userSelectProps?.data?.data?.length) ? (
                          [formProps?.initialValues?.users].map(u => <Select.Option key={u.id} value={u.id}>{getUserLabel(u)}</Select.Option>)
                        ) : (
                          userSelectProps?.data?.data?.map(u => <Select.Option key={u.id} value={u.id}>{getUserLabel(u)}</Select.Option>)
                        )}
                      </Select>
                    </Form.Item>

                    {/*<Form.Item*/}
                    {/*  label={t("outlets.fields.menuCategoryTypes.label")}*/}
                    {/*  name="menuCategoryTypes"*/}
                    {/*>*/}
                    {/*  <Select*/}
                    {/*    showSearch*/}
                    {/*    mode={"multiple"}*/}
                    {/*    notFoundContent={null}*/}
                    {/*    defaultActiveFirstOption={false}*/}
                    {/*    showArrow={true}*/}
                    {/*    filterOption={false}*/}
                    {/*    onSearch={(value) => {*/}
                    {/*      if (categoryTagsSelectProps.onSearch) {*/}
                    {/*        categoryTagsSelectProps.onSearch(value);*/}
                    {/*      }*/}
                    {/*    }}*/}
                    {/*    allowClear={false}*/}
                    {/*    placeholder={t("outlets.fields.menuCategoryTypes.placeholder")}*/}
                    {/*  >*/}
                    {/*    {categoryTagsSelectProps?.options?.map(c => <Select.Option key={c.value} value={c.value}>{c.label}</Select.Option>)}*/}
                    {/*  </Select>*/}
                    {/*</Form.Item>*/}

                  </>
                )}
              </Col>

              <Col xs={24} sm={24} md={12} xl={8}>

                {readonlyMode ? (
                  <Descriptions title="Информация о точке продажи" column={1} bordered={true} size={"middle"}
                                layout={"vertical"}>
                    <Descriptions.Item label={t("outlets.fields.isReadyForPublishing")}>
                      <CustomBooleanField value={formProps?.initialValues?.isReadyForPublishing}/></Descriptions.Item>
                    <Descriptions.Item label={t("outlets.fields.isForYandex")}>
                      <CustomBooleanField value={formProps?.initialValues?.isForYandex}/></Descriptions.Item>
                    <Descriptions.Item label={t("outlets.fields.isForSber")}>
                      <CustomBooleanField value={formProps?.initialValues?.isForSber}/></Descriptions.Item>
                    <Descriptions.Item label={t("outlets.fields.isActive")}>
                      <CustomBooleanField value={formProps?.initialValues?.isActive}/></Descriptions.Item>
                    <Descriptions.Item label={t("outlets.fields.isEnabled")}>
                      <CustomBooleanField value={formProps?.initialValues?.isEnabled}/></Descriptions.Item>
                  </Descriptions>
                ) : (
                  <>
                    <Form.Item
                      label={t("outlets.fields.isReadyForPublishing")}
                      name="isReadyForPublishing"
                      valuePropName="checked"
                    >
                      <Switch size={"small"} disabled={!enabledReadyForPublishing || !(_checkFullP(permissions))}/>
                    </Form.Item>

                    <Form.Item
                      label={t("outlets.fields.isActive")}
                      name="isActive"
                      valuePropName="checked"
                    >
                      <Switch size={"small"} disabled={!enabledIsActive || !(_checkFullP(permissions))}/>
                    </Form.Item>

                    <Form.Item
                      label={t("outlets.fields.isForYandex")}
                      name="isForYandex"
                      valuePropName="checked"
                    >
                      <Switch size={"small"} disabled={!(_checkFullP(permissions))}/>
                    </Form.Item>

                    <Form.Item
                      label={t("outlets.fields.isForSber")}
                      name="isForSber"
                      valuePropName="checked"
                    >
                      <Switch size={"small"} disabled={!(_checkFullP(permissions))}/>
                    </Form.Item>

                    <Form.Item
                      label={t("outlets.fields.isEnabled")}
                      name="isEnabled"
                      valuePropName="checked"
                    >
                      <Switch size={"small"}/>
                    </Form.Item>
                  </>
                )}
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={24} span={24} className={"flex-column"}>
          <Card className={"card-block-with-margin"}>
            <Row gutter={[24, 12]} wrap align="stretch">
              <Col xs={24} sm={24} md={24} span={24}>
                <Form.Item
                  label={t("outlets.fields.deliveryOptionsExclude.header")}
                  name={["deliveryOptionsExclude"]}
                >
                  <DeliveryTypeButtons readonlyMode={readonlyMode || !(_checkFullP(permissions))}
                                       excludeMode={true} deliveryOptions={marketProps?.deliveryOptions || []}/>
                </Form.Item>

              </Col>
            </Row>
          </Card>

          {/*<Card className={"card-block-with-margin"}>*/}
          {/*  <Row gutter={[24, 12]} wrap align="stretch">*/}
          {/*    <Col xs={24} sm={24} md={24} span={24}>*/}
          {/*      {readonlyMode ? (*/}
          {/*        <Descriptions title={""} column={1} layout={"vertical"} bordered={true} size={"middle"}>*/}
          {/*          <Descriptions.Item label={t("outlets.fields.chatParameters.label")}>*/}
          {/*            {formProps?.initialValues?.chatID || "--"}*/}
          {/*          </Descriptions.Item>*/}
          {/*        </Descriptions>*/}
          {/*      ) : (*/}
          {/*        <>*/}
          {/*          <Form.Item*/}
          {/*            label={t("outlets.fields.chatParameters.label")}*/}
          {/*            name="chatID"*/}
          {/*          >*/}
          {/*            <Input value={""}/>*/}
          {/*          </Form.Item>*/}

          {/*          <div style={{marginTop: 6, display: 'flex', justifyContent: 'end', maxWidth: '100%'}}>*/}
          {/*            <Button style={{maxWidth: '100%'}} type={"primary"} size={"small"} onClick={handleVerification}>*/}
          {/*              {t("outlets.fields.chatParameters.button")}*/}
          {/*            </Button>*/}
          {/*          </div>*/}
          {/*        </>*/}
          {/*      )}*/}

          {/*    </Col>*/}
          {/*  </Row>*/}
          {/*</Card>*/}

          {/*<Card className="settings-products-card">*/}
          {/*  <Row gutter={[24, 12]} wrap align="stretch" style={{flex: 1}}>*/}
          {/*    <Col xs={24} sm={24} md={24} span={24}>*/}

          {/*      {readonlyMode ? (*/}
          {/*        <>*/}
          {/*          <div className="ant-form-item-label width-100-pr" style={{paddingBottom: 0}}>*/}
          {/*            <label>{t("outlets.fields.products.header")}</label>*/}
          {/*          </div>*/}
          {/*          {formProps.initialValues?.id && (*/}
          {/*            <Link to={`/products?outlet_id=${formProps.initialValues?.id}`}*/}
          {/*                  style={{paddingBottom: '8px', display: "block"}}>{t("outlets.fields.products.link")}</Link>*/}
          {/*          )}*/}

          {/*          <Descriptions title={""} column={1} layout={"vertical"} bordered={true} size={"middle"}>*/}
          {/*            <Descriptions.Item label={t("outlets.fields.products.minTime")}>*/}
          {/*              {formProps?.initialValues?.minReadyTime || "--"}*/}
          {/*            </Descriptions.Item>*/}
          {/*          </Descriptions>*/}
          {/*        </>*/}

          {/*      ) : (*/}
          {/*        <>*/}
          {/*          <div className="ant-form-item-label width-100-pr" style={{paddingBottom: 0}}>*/}
          {/*            <label>{t("outlets.fields.products.header")}</label>*/}
          {/*          </div>*/}

          {/*          {formProps.initialValues?.id && (*/}
          {/*            <Link to={`/products?outlet_id=${formProps.initialValues?.id}`}*/}
          {/*                  style={{paddingBottom: '8px', display: "block"}}>{t("outlets.fields.products.link")}</Link>*/}
          {/*          )}*/}

          {/*          <Form.Item*/}
          {/*            label={t("outlets.fields.products.minTime")}*/}
          {/*            name="minReadyTime"*/}
          {/*          >*/}
          {/*            <Select*/}
          {/*              allowClear*/}
          {/*              placeholder={t("outlets.fields.products.minTime")}*/}
          {/*              options={getReadyTimeList() || []}*/}
          {/*            />*/}
          {/*          </Form.Item>*/}
          {/*        </>*/}
          {/*      )}*/}
          {/*    </Col>*/}
          {/*  </Row>*/}

          {/*  {formProps.initialValues?.id && (*/}
          {/*      <Row>*/}
          {/*        <Button className={"width-100-pr"}*/}
          {/*                onClick={() => {*/}
          {/*                  localStorage.setItem("outlet_id", `${formProps.initialValues?.id}`);*/}
          {/*                  navigate('/products/create')*/}
          {/*                }}*/}
          {/*                type="primary">*/}
          {/*          Добавить товар*/}
          {/*        </Button>*/}
          {/*      </Row>*/}
          {/*  )}*/}
          {/*</Card>*/}
        </Col>
      </Row>

      <CategoriesTable formProps={formProps} isCopyMode={!!formProps?.initialValues?.sourceId}
                       readonlyMode={readonlyMode || !(_checkFullP(permissions))}
                       setDeletedCategories={setDeletedCategories}/>

      {showMapCard && (
        <Card className={"card-block-with-margin"}>
          <Row gutter={[24, 12]} wrap align="stretch">
            <Col xs={24} sm={24} md={8} span={8}>

              {readonlyMode ? (
                <Descriptions title="User Info" column={1} layout={"vertical"} bordered={true} size={"middle"}>
                  <Descriptions.Item label={t("outlets.fields.address")}>
                    {formProps?.initialValues?.address || "--"}
                  </Descriptions.Item>

                  <Descriptions.Item label={t("outlets.fields.coordinate")}>
                    [{formProps?.initialValues?.location?.coordinates?.[0] || "--"},{formProps?.initialValues?.location?.coordinates?.[1] || "--"}]
                  </Descriptions.Item>

                  <Descriptions.Item label={t("outlets.fields.menuCategoryTypes")}>
                    {formProps?.initialValues?.menuCategoryTypes?.map((t: any) => <Tag>{t.value || "--"}</Tag>)}
                  </Descriptions.Item>
                </Descriptions>
              ) : (
                <>
                  <Form.Item
                    label={t("outlets.fields.fullAddress")}
                    name="address"
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item label={t("outlets.fields.coordinate")}>
                    <Row gutter={[12, 6]} wrap align="stretch">
                      <Col span={12}>
                        <Form.Item
                          label={''}
                          name={["location", "coordinates", 0]}
                          className={"block-without-margin"}
                        >
                          <Input />
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item
                          label={''}
                          name={["location", "coordinates", 1]}
                          className={"block-without-margin"}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form.Item>
                </>
              )}
            </Col>

            <Col xs={24} sm={24} md={16} span={16}>
              <div className="ant-form-item-label">
                <label>Зоны доставки на карте</label>
              </div>

              <LocationMap form={formProps.form} fields={["location", "coordinates"]} readonlyMode={readonlyMode}/>
            </Col>
          </Row>
        </Card>
      )}

      {formProps.initialValues?.contracts && (
        <ContractCards formProps={formProps} readonlyMode={readonlyMode}/>
      )}

    </Form>
  );
};


const ContractCards: React.FC<FormOutletProps> = ({ formProps, readonlyMode }) => {

  const t = useTranslate();

  const [searchContractValue, setSearchContractValue] = useState('');
  const [selectContractValue, setSelectContractValue] = useState('');

  const [addedContract, setAddedContract] = useState<number | string>('');
  const [contractValues, setContractValues] = useState<Array<IContract> | null>(null);

  const contractProps = useOne<IContract>({
    resource: "contracts",
    id: addedContract,
    dataProviderName: "customProvider",
  })

  useEffect(() => {
    if (formProps.initialValues?.contracts) {
      setContractValues(formProps.initialValues?.contracts)
    }
    // @ts-ignore
  }, [formProps.initialValues.contracts])

  useEffect(() => {
    if (contractProps?.data?.data) {
      setContractValues(contracts => contracts?.some(c => c.id === contractProps?.data?.data.id) ? contracts : !contracts ? contracts : [...contracts, contractProps?.data?.data])
      setAddedContract('')
    }
  }, [contractProps])

  const contractSelectProps = useList<IContract>({
    resource: "contracts",
    dataProviderName: "autocompleteProvider",
    config: {
      filters: [{
        field: "title_like",
        operator: "eq",
        value: searchContractValue,
      }]
    }
  });

  const handleAddContract = () => {
    if (formProps.form?.setFieldsValue) {
      setAddedContract(selectContractValue);
      contractProps.remove();
      formProps.form.setFieldsValue({
        contracts: formProps.form.getFieldValue('contracts') ? [...formProps.form.getFieldValue('contracts'), selectContractValue] : [selectContractValue]
      })
    }
  }

  return (
    <Card>
      <Row gutter={[24, 12]} wrap align="stretch">
        <Col span={24}>
          <Row wrap>
            <div className="ant-form-item-label">
              <label>Юридическая и финансовая информация</label>
            </div>
          </Row>
          <Row wrap style={{marginBottom: '24px'}} >
            <Select
              showSearch
              allowClear={true}
              notFoundContent={null}
              style={{ width: 250 }}
              defaultActiveFirstOption={false}
              placeholder={"№ договора, Юр.лицо"}
              showArrow={false}
              filterOption={false}
              onSelect={(value: any) => {
                setSelectContractValue(value)
              }}
              onSearch={(value) => {
                setSearchContractValue(value)
              }}
            >
              {/*@ts-ignore*/}
              {contractSelectProps?.data?.data?.map(c => <Select.Option key={c.id} value={c.id}>
                {`№${c.number} (${c.person})`}</Select.Option>)}
            </Select>

            <Button disabled={readonlyMode} type={"primary"} onClick={handleAddContract} style={{marginLeft: 12}}>Добавить</Button>
          </Row>

          <Form.Item
            hidden={true}
            name="contracts"
          >
          </Form.Item>

          {!contractValues?.length ? (
            <EmptyContainer/>
          ) : (
            <Collapse collapsible="header" defaultActiveKey={[]}>
              {contractValues.map((c, i) => (
                <Collapse.Panel header={
                  <Row align="middle">
                    {`Договор №${c.number} от ${moment(c.signedAt, DATE_FORMAT).format('D MMMM YYYY')} года с ${c.person} (до ${moment(c.expiresAt, DATE_FORMAT).format('D MMMM YYYY')})`}
                    {c.comment && (
                      <Tooltip title={c.comment || "--"}>
                        <Icons.QuestionCircleOutlined style={{marginLeft: 6}} />
                      </Tooltip>
                    )}
                    {!c?.id ? null : <Link style={{marginLeft: '6px'}} to={`/contracts/show/${c?.id || ''}`} target={"_blank"}><Icons.LinkOutlined/></Link>}
                  </Row>
                } key={i} extra={<DeleteOutlined disabled={readonlyMode} onClick={() => {
                  setContractValues(contractValues.filter(contract => contract.id !== c.id))
                  formProps?.form?.setFieldsValue({
                    contracts: contractValues.filter(contract => contract.id !== c.id)
                  })
                }}/>}>
                  <Row gutter={[24, 12]} className={"row-with-margin-12"}>
                    <Col xs={24} md={8}>
                      <div className="ant-form-item-label"><label>{t("contracts.fields.person")}</label></div>
                      <Input readOnly={true} value={c.person} />
                    </Col>
                    <Col xs={24} md={8}>
                      <div className="ant-form-item-label"><label>{t("contracts.fields.legalAddress")}</label></div>
                      <Input readOnly={true} value={c.legalAddress} />
                    </Col>
                    <Col xs={24} md={8}>
                      <div className="ant-form-item-label"><label>{t("contracts.fields.phone")}</label></div>
                      <Input readOnly={true} value={c.phone || '--'} />
                    </Col>
                    {/*<Col xs={24} md={8}>*/}
                    {/*  <div className="ant-form-item-label"><label>{t("contracts.fields.dates")}</label></div>*/}
                    {/*  <Input readOnly={true} value={`${c.signedAt} - ${c.expiresAt}`}/>*/}
                    {/*</Col>*/}
                  </Row>
                  <Row gutter={[24, 12]} className={"row-with-margin-12"}>
                    <Col xs={24} md={6}>
                      <div className="ant-form-item-label"><label>{t("contracts.fields.inn")}</label></div>
                      <Input readOnly={true} value={c.inn} />
                    </Col>
                    <Col xs={24} md={6}>
                      <div className="ant-form-item-label"><label>{t("contracts.fields.psrn")}</label></div>
                      <Input readOnly={true} value={c.psrn} />
                    </Col>
                    <Col xs={24} md={6}>
                      <div className="ant-form-item-label"><label>{t("contracts.fields.checkAccount")}</label></div>
                      <Input readOnly={true} value={c.checkAccount} />
                    </Col>
                    <Col xs={24} md={6}>
                      <div className="ant-form-item-label"><label>{t("contracts.fields.bankIdCode")}</label></div>
                      <Input readOnly={true} value={c.bankIdCode} />
                    </Col>
                  </Row>
                  <Row gutter={[24, 12]} className={"row-with-margin-12"}>
                    <Col xs={24} md={24} span={24}>
                      <div className="ant-form-item-label"><label>Комментарий</label></div>
                      <Input.TextArea value={c.comment} />
                    </Col>
                  </Row>
                </Collapse.Panel>
              ))}

            </Collapse>
          )}
        </Col>
      </Row>
    </Card>
  )
}
