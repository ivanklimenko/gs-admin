import React, {useEffect, useState} from "react";
import { useTranslate } from "@pankod/refine-core";
import {
  Form,
  Input,
  Select,
  useSelect,
  Row,
  Card,
  Col,
  FormProps, Descriptions, BooleanField, Tag, Switch
} from "@pankod/refine-antd";
import {UploadArea} from "components/uploadArea";

import {FORM_COMMON_RULES} from "common/constants";
import {IUser} from "interfaces/users";
import {CustomBooleanField} from "../customBooleanField";


type FormMarketProps = {
  formProps: FormProps;
  readonlyMode?: boolean;
};

export const NetworkForm: React.FC<FormMarketProps> = ({formProps, readonlyMode= false}) => {
  const t = useTranslate();

  //const [showDeliveryStreets, setShowDeliveryStreets] = useState(false);
  const [readyForPublishing, setReadyForPublishing] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setReadyForPublishing(formProps.initialValues?.isReadyForPublishing)
    setIsActive(formProps.initialValues?.isActive)
  }, [formProps.initialValues])

  const {selectProps: userSelectProps} = useSelect<IUser>({
    resource: "users",
    optionLabel: "username",
    dataProviderName: "customProvider",
  });


  return (
    <Form {...formProps}
      onFinish={(values) => {
        let requestValues = {
          ...values,
          cityId: 2,
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
      }}
      //onFieldsChange={(changedFields, all) => {
        // @ts-ignore
        // if (changedFields.length && changedFields[0].name?.length && changedFields[0].name.includes("delivery") && changedFields[0].name.includes("types")) {
        //   setShowDeliveryStreets(changedFields[0].value.includes(EDeliveryType.TO_CAR))
        // }
      //}}
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
          name="isNetwork"
      >
      </Form.Item>

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
              <Descriptions title="Информация о сети" column={1} bordered={true} size={"middle"}
                            layout={"vertical"}>
                <Descriptions.Item label={t("markets.fields.title")}>
                  {formProps?.initialValues?.title || "--"}
                </Descriptions.Item>
                <Descriptions.Item label={t("markets.fields.type.label")}>
                  {formProps?.initialValues?.type || "--"}</Descriptions.Item>

                <Descriptions.Item label={t("markets.fields.is_accept_published")}>
                  <CustomBooleanField value={formProps?.initialValues?.isReadyForPublishing}/></Descriptions.Item>
                <Descriptions.Item label={t("markets.fields.is_published")}>
                  <CustomBooleanField value={formProps?.initialValues?.isActive}/></Descriptions.Item>


                <Descriptions.Item label={t("markets.fields.users")}>
                  {formProps?.initialValues?.users?.map((t: any) => <Tag>{t.title}</Tag>) || "--"}
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


                <Form.Item
                  label={t("markets.fields.is_accept_published")}
                  name="isReadyForPublishing"
                  valuePropName="checked"
                >
                  <Switch size={"small"} disabled={isActive}/>
                </Form.Item>

                <Form.Item
                  label={t("markets.fields.is_published")}
                  name="isActive"
                  valuePropName="checked"
                >
                  <Switch size={"small"} disabled={!readyForPublishing}/>
                </Form.Item>

                <Form.Item
                  label={t("markets.fields.isForYandex")}
                  name="isForYandex"
                  valuePropName="checked"
                >
                  <Switch size={"small"}/>
                </Form.Item>


                <Form.Item
                  label={t("markets.fields.users")}
                  name="users"
                >
                  <Select
                    showSearch
                    mode={"multiple"}
                    notFoundContent={null}
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                    onSearch={(value) => {
                      if (userSelectProps.onSearch) {
                        userSelectProps.onSearch(value);
                      }
                    }}
                  >
                    {userSelectProps?.options?.map(d => <Select.Option key={d.value} value={d.value}>{d.label}</Select.Option>)}
                  </Select>
                </Form.Item>

              </>
            )}
          </Col>

          <Col xs={24} sm={24} md={8} span={8}>
          </Col>

        </Row>
      </Card>
    </Form>
  );
};
