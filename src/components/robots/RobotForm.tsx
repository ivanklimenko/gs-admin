import React from "react";
import {useTranslate} from "@pankod/refine-core";
import {
  Form,
  Input,
  Row,
  Card,
  Col,
  FormProps,
  Switch, Descriptions, BooleanField, Table, Avatar, Image
} from "@pankod/refine-antd";
import moment from "moment";

import {FORM_COMMON_RULES, PLACEHOLDER_TIME_FORMAT} from "common/constants";

import dayjs from "dayjs";
import {TimePicker} from "antd";
import {Link} from "react-router-dom";
import {IProduct} from "interfaces/products";
import {EmptyContainer} from "../notFound/NotFound";
import {CustomBooleanField} from "../customBooleanField";

type FormMarketProps = {
  formProps: FormProps;
  readonlyMode?: boolean
};

export const RobotForm: React.FC<FormMarketProps> = ({formProps, readonlyMode= false}) => {
  const t = useTranslate();

  const days = moment.weekdays(true, 'ddd');
  const defaultWeekdays = Array.apply(null, Array(7)).map(function (_, i) {
    return moment(i, 'e', 'en').startOf('week').weekday(i + 1).format('ddd');
  });

  return (
    <Form {...formProps}
      onFinish={(values) => {

        let timeTable = {};

        defaultWeekdays.forEach((_, i) => {
          timeTable = {
            ...timeTable,
            [`start${i + 1}`]: values[`allTime${i + 1}`] ? '00:00' : values[`disabled${i + 1}`] ? null : dayjs(values?.[`day${i + 1}`][0]).isValid() ? values?.[`day${i + 1}`][0].format('HH:mm') : null,
            [`end${i + 1}`]: values[`allTime${i + 1}`] ? '00:00' : values[`disabled${i + 1}`] ? null : dayjs(values?.[`day${i + 1}`][1]).isValid() ? values?.[`day${i + 1}`][1].format('HH:mm') : null,
          }
        })

        let requestValues: any = {
          //...values,
          name: values.name,
          ...timeTable
        };

        if (values?.id) {
          requestValues = {
            ...requestValues,
            id: values?.id
          };
        }

        if (formProps.onFinish) {
          formProps.onFinish(requestValues)
        }
      }}
      layout="vertical"
      validateTrigger={"submit"}
    >

      {formProps.initialValues?.id && (
        <Form.Item
          hidden={true}
          name="id"
        >
        </Form.Item>
      )}

      <Form.Item
          hidden={true}
          name="isNetwork"
      >
      </Form.Item>

      <Row gutter={[16, 16]} wrap align="stretch" style={{marginBottom: '16px'}}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Card>
            {readonlyMode ? (
              <Descriptions title="" column={1}  bordered={true} size={"middle"}
                            layout={"vertical"}>
                <Descriptions.Item label={t("timetables.fields.title")}>
                  {formProps?.initialValues?.name || "--"}
                </Descriptions.Item>

                <Descriptions.Item label={t("timetables.fields.isActive")}>
                  <CustomBooleanField value={formProps?.initialValues?.isActive}/>
                </Descriptions.Item>

              </Descriptions>
            ) : (
              <>
                <Form.Item
                  label={t("timetables.fields.title")}
                  name="name"
                  rules={[...FORM_COMMON_RULES]}>
                  <Input style={{width: '300px'}}/>
                </Form.Item>

                <Form.Item
                  label={t("timetables.fields.isActive")}
                  name="isActive"
                  valuePropName="checked"
                >
                  <Switch size={"small"}/>
                </Form.Item>
              </>
            )}

          </Card>
        </Col>

        <Col xs={24} sm={24} md={24} lg={24}>
          <Card style={{height: '100%'}}>
            {readonlyMode ? (
              <Descriptions title="" column={5}  bordered={true} size={"middle"}
                            layout={"vertical"}>
                {defaultWeekdays.map((day, i) => (
                  <Descriptions.Item label={days[i]}>
                    {formProps?.initialValues?.[`day${i + 1}`]?.[0]?.format('HH:mm')}-{formProps?.initialValues?.[`day${i + 1}`]?.[1]?.format('HH:mm')}
                  </Descriptions.Item>
                ))}
              </Descriptions>
            ) : (
              <>
                <Row gutter={[16, 16]}>
                  {(defaultWeekdays).map((day, i) => (
                    <Col xs={24} sm={24} md={24} lg={24} className={"timetables-date-wrapper"}>
                      <div className={"timetables-date-label"}>{days[i]}:</div>
                      <Row gutter={[8, 8]}>
                        <Col xs={24} sm={24} md={8} lg={6}>
                          <Form.Item
                            label={"Расписание"}
                            className={"robot-week-day"}
                            name={[`day${i + 1}`]}>
                            <TimePicker.RangePicker style={{width: '205px'}} inputReadOnly={readonlyMode}
                                                    disabled={(!!formProps?.form?.getFieldValue(`allTime${i + 1}`) || !!formProps?.form?.getFieldValue(`disabled${i + 1}`))}
                                                    placeholder={['Начало', 'Окончание']}
                                                    format={PLACEHOLDER_TIME_FORMAT} size={"small"}/>
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={4}>
                          <Form.Item
                            valuePropName="checked"
                            label={"Круглосуточно"}
                            className={"robot-week-day"}
                            name={[`allTime${i + 1}`]}>
                            <Switch size={"small"} disabled={!!formProps?.form?.getFieldValue(`disabled${i + 1}`)}/>
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={4}>
                          <Form.Item
                            valuePropName="checked"
                            label={"Недоступно"}
                            className={"robot-week-day"}
                            name={[`disabled${i + 1}`]}>
                            <Switch size={"small"} disabled={!!formProps?.form?.getFieldValue(`allTime${i + 1}`)}/>
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                  ))}
                </Row>
              </>
            )}
          </Card>
        </Col>
      </Row>


      <Card className={"card-block-with-margin"}>
        <Row gutter={[16, 16]} wrap align="stretch">
          <Col span={24}>
            <Row wrap>
              <div className="ant-form-item-label">
                <label>Товары</label>
              </div>
            </Row>

            <Row>
              {!formProps?.initialValues?.products?.length ? (
                <EmptyContainer/>
              ) : (
                <Table className={"width-100-pr"} rowKey="id" dataSource={formProps?.initialValues?.products}>
                  <Table.Column
                    dataIndex="id"
                    key="id"
                    title="ID"
                    render={(value) => value}
                  />

                  <Table.Column<IProduct>
                    dataIndex="title"
                    key="title"
                    title="Название"
                    render={(value, record) => <div>
                      <Avatar shape="square" className={"table-preview-image"} src={<Image src={record?.image} />} />
                      <span style={{marginLeft: '12px'}}>
                      <Link to={`/products/show/${record?.id || ''}`} target={"_blank"}>{record?.title || '--'}</Link>
                    </span>
                    </div>}
                  />

                  <Table.Column
                    dataIndex="outlet"
                    key="outlet"
                    title="Точка продажи"
                    render={(value) => (<Link to={`/outlets/show/${value?.id || ''}`} target={"_blank"}>{value?.title || '--'}</Link>)}
                  />

                </Table>
              )}

            </Row>

          </Col>
        </Row>
      </Card>



    </Form>
  );
};
