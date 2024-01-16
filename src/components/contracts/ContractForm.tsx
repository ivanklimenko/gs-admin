import React, {useEffect, useState} from "react";
import { useList, useTranslate} from "@pankod/refine-core";
import {
  Form,
  Input,
  Row,
  Card,
  Col,
  FormProps, Table, Descriptions
} from "@pankod/refine-antd";

import {
  DATE_FORMAT,
  FORM_COMMON_RULES
} from "common/constants";
import {DatePicker, notification} from 'antd';
import 'moment/locale/ru';
import locale from 'antd/es/date-picker/locale/ru_RU';
import moment from "moment";
import {MaskedInput} from "antd-mask-input";
import {Dayjs} from "dayjs";


type FormContractProps = {
  formProps: FormProps;
  readonlyMode?: boolean;
};

type CommissionTableType = {
  deliveryType: string;
  commissionOutlet: string;
  commissionMarket: string
}

export const ContractForm: React.FC<FormContractProps> = ({formProps, readonlyMode = false}) => {
  const t = useTranslate();

  const [tableItems, setTableItems] = useState<Array<CommissionTableType>>([]);

  const {data} = useList({
    resource: "enums/delivery_options"
  });

  useEffect(() => {
    if (data?.data) {
      setTableItems(Object.keys(data?.data)?.map((t: any) => ({
        deliveryType: t,
        deliveryLabel: data?.data[t] || "",
        commissionOutlet: `commissionOutlet${t}`,
        commissionMarket: `commissionMarket${t}`,
      })))
    }
  }, [data])

  return (
    <Form {...formProps}
          onFinish={(values) => {
            try {
              if (!values?.dates || values?.dates.some((d: Dayjs | null) => !d)) {
                notification.error({
                  message: 'Ошибка сохранения',
                  description:
                    'Необходимо заполнить поле Сроки договора',
                });
                return;
              }

              let requestValues = {
                ...values,
                number: values?.number?.trim(),
                person: values?.person?.trim(),
                phone: values.phone?.replace(/ |_|\(|-|\)|/g, '')?.trim(),
                inn: values?.inn?.trim(),
                checkAccount: values?.checkAccount?.trim(),
                bankIdCode: values?.bankIdCode?.trim(),
                signedAt: !values?.dates ? null : moment(values?.dates[0]).format('YYYY-MM-DD'),
                expiresAt: !values?.dates ? null : moment(values?.dates[1]).format('YYYY-MM-DD'),
                comment: values?.comment?.trim(),
                commissions: Object.keys(values).reduce((obj, key) => {
                  return key.includes("commission") ? {...obj, [key]: !values[key] ? "0.00" : values[key]} : obj
                }, {})
              };

              tableItems.forEach(item => {
                delete requestValues[item.commissionMarket]
                delete requestValues[item.commissionOutlet]
              })

              if (formProps.onFinish) {
                formProps.onFinish(requestValues)
              }
            } catch (e) {
              //console.log(e)
            }
          }}

          onFinishFailed={(error) => {
            //console.log('error', error)
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

      <Row gutter={[24, 12]} wrap align="stretch">
        <Col xs={24} sm={24} md={10} lg={8}>
          <Card className={"card-block-with-margin"}>
            <Row gutter={[24, 12]} wrap align="stretch">
              <Col xs={24} sm={24} md={24} span={24}>

                {readonlyMode ? (
                  <Descriptions title="Информация о маркете" column={1} bordered={true} size={"middle"}
                                layout={"vertical"}>
                    <Descriptions.Item label={t("contracts.fields.number")}>
                      {formProps?.initialValues?.number || "--"}
                    </Descriptions.Item>
                    <Descriptions.Item label={t("contracts.fields.person")}>
                      {formProps?.initialValues?.person || "--"}
                    </Descriptions.Item>
                    <Descriptions.Item label={t("contracts.fields.legalAddress")}>
                      {formProps?.initialValues?.legalAddress || "--"}
                    </Descriptions.Item>
                    <Descriptions.Item label={t("contracts.fields.phone")}>
                      {formProps?.initialValues?.phone || "--"}</Descriptions.Item>

                    <Descriptions.Item label={t("contracts.fields.inn")}>
                      {formProps?.initialValues?.inn || "--"}</Descriptions.Item>

                    <Descriptions.Item label={t("contracts.fields.psrn")}>
                      {formProps?.initialValues?.psrn || "--"}</Descriptions.Item>

                    <Descriptions.Item label={t("contracts.fields.checkAccount")}>
                      {formProps?.initialValues?.checkAccount || "--"}</Descriptions.Item>

                    <Descriptions.Item label={t("contracts.fields.bankIdCode")}>
                      {formProps?.initialValues?.bankIdCode || "--"}</Descriptions.Item>

                    <Descriptions.Item label={"Дата подписания"}>
                      {formProps?.initialValues?.signedAt || "--"}
                    </Descriptions.Item>
                    <Descriptions.Item label={"Дата окончания"}>
                      {formProps?.initialValues?.expiresAt || "--"}
                    </Descriptions.Item>

                    <Descriptions.Item label={t("contracts.fields.comment")}>
                      {formProps?.initialValues?.comment || "--"}
                    </Descriptions.Item>

                  </Descriptions>
                ) : (
                  <>
                    <Form.Item
                      label={t("contracts.fields.number")}
                      name="number"
                      rules={[...FORM_COMMON_RULES]}
                    >
                      <Input value={""}/>
                    </Form.Item>

                    <Form.Item
                      label={t("contracts.fields.person")}
                      name="person"
                      rules={[...FORM_COMMON_RULES]}
                    >
                      <Input value={""}/>
                    </Form.Item>

                    <Form.Item
                      label={t("contracts.fields.legalAddress")}
                      name="legalAddress"
                    >
                      <Input value={""} maxLength={256}/>
                    </Form.Item>

                    <Form.Item
                      label={t("contracts.fields.phone")}
                      name="phone"
                      rules={[...FORM_COMMON_RULES]}
                    >
                      {/*<Input value={""}/>*/}
                      <MaskedInput
                        mask={
                          //  https://imask.js.org/guide.html#masked-pattern
                          [
                            {mask: '+7(000)000-00-00'},
                          ]
                        }
                      />
                    </Form.Item>

                    <Form.Item
                      label={t("contracts.fields.psrn")}
                      name="psrn"
                      rules={[...FORM_COMMON_RULES]}
                    >
                      <Input value={""} maxLength={256}/>
                    </Form.Item>

                    <Form.Item
                      label={t("contracts.fields.inn")}
                      name="inn"
                      rules={[...FORM_COMMON_RULES]}
                    >
                      <Input value={""}/>
                    </Form.Item>

                    <Form.Item
                      label={t("contracts.fields.checkAccount")}
                      name="checkAccount"
                    >
                      <Input value={""}/>
                    </Form.Item>

                    <Form.Item
                      label={t("contracts.fields.bankIdCode")}
                      name="bankIdCode"
                    >
                      <Input value={""}/>
                    </Form.Item>

                    <Form.Item
                      label={t("contracts.fields.dates")}
                      name={["dates"]}
                      rules={[...FORM_COMMON_RULES]}
                      className={"width-100-pr"}
                    >
                      <DatePicker.RangePicker className={"width-100-pr"} format={[DATE_FORMAT, DATE_FORMAT]} locale={locale}/>
                    </Form.Item>


                    <Form.Item
                      label={t("contracts.fields.comment")}
                      name="comment"
                    >
                      <Input.TextArea value={""}/>
                    </Form.Item>
                  </>
                )}


              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={14} lg={16} className={"flex-column"}>
          <Card className={"card-block-with-margin"}>
            <Row gutter={[24, 12]} wrap align="stretch">
              <Col xs={24} sm={24} md={24} span={24}>
                <Descriptions title="Комиссии по доставке" column={1} size={"middle"}
                              layout={"vertical"}>
                </Descriptions>
                <Table dataSource={tableItems} pagination={false}>
                  <Table.Column
                    dataIndex="deliveryLabel"
                    key="deliveryLabel"
                    title="Типы доставки"
                    render={(value) => value || '--'}
                  />

                  <Table.Column
                    dataIndex="commissionOutlet"
                    key="commissionOutlet"
                    title="Комиссия по точкам продаж"
                    render={(value) => {
                      if (readonlyMode) {
                        return formProps?.initialValues?.[value]
                      }
                      return (
                        <Form.Item
                          name={[value]}
                          className={"block-without-margin"}
                        >
                          <Input />
                        </Form.Item>
                      )
                    }}
                  />

                  <Table.Column
                    dataIndex="commissionMarket"
                    key="commissionMarket"
                    title="Комиссия по локациям"
                    render={(value) => {
                      if (readonlyMode) {
                        return formProps?.initialValues?.[value]
                      }
                      return (
                        <Form.Item
                          name={value}
                          className={"block-without-margin"}
                        >
                          <Input />
                        </Form.Item>
                      )
                    }}
                  />
                </Table>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Form>
  );
};
