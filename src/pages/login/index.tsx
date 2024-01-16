import { useLogin, useTranslate } from "@pankod/refine-core";

import {
    Row,
    Col,
    AntdLayout,
    Card,
    Typography,
    Form,
    Input,
    Button,
    Checkbox,
} from "@pankod/refine-antd";

import { Trans } from "react-i18next";
import React from "react";

const { Text, Title } = Typography;

export interface ILoginForm {
    username: string;
    password: string;
    remember: boolean;
}

export const LoginPage: React.FC = () => {
    const [form] = Form.useForm<ILoginForm>();
    const t = useTranslate();

    const { mutate: login } = useLogin<ILoginForm>();

    const CardTitle = (
        <Title level={3} className="layout-title">
            <Trans
                i18nKey="pages.login.signin"
                defaults="<0>Sign in</0> your account"
                components={[<Text key="0" style={{ color: "#67be23" }} />]}
            />
        </Title>
    );

    return (
        <AntdLayout
            style={{
                background:
                    "radial-gradient(50% 50% at 50% 50%,rgba(255, 255, 255, 0) 0%,rgba(0, 0, 0, 0.5) 100%),url('images/login-bg.png')",
                backgroundSize: "cover",
            }}
        >
            <Row
              justify="center"
              align="middle"
              style={{
                  height: "100vh",
              }}
            >
                <Col xs={22}>
                    <div style={{maxWidth: "408px", margin: "auto"}}>
                        <h1 style={{color: 'white', padding: '6px 10px', fontSize: '24px', textAlign: 'center'}}>
                            HungryNinja
                        </h1>
                        <Card title={CardTitle} headStyle={{borderBottom: 0}}>
                            <Form<ILoginForm>
                              layout="vertical"
                              form={form}
                              onFinish={(values) => {
                                  login(values);
                              }}
                              requiredMark={false}
                              initialValues={{
                                  remember: false,
                                  username: "",
                                  password: "",
                              }}
                            >
                                <Form.Item
                                  name="username"
                                  label={t("pages.login.username", "Username")}
                                  rules={[{required: true}]}
                                >
                                    <Input
                                      size="large"
                                      placeholder="Email"
                                    />
                                </Form.Item>
                                <Form.Item
                                  name="password"
                                  label={t(
                                    "pages.login.password",
                                    "Password",
                                  )}
                                  rules={[{required: true}]}
                                  style={{marginBottom: "12px"}}
                                >
                                    <Input.Password
                                      visibilityToggle={true}
                                      type="password"
                                      placeholder="●●●●●●●●"
                                      size="large"
                                    />
                                </Form.Item>
                                <div style={{marginBottom: "12px"}}>
                                    <Form.Item
                                      name="remember"
                                      valuePropName="checked"
                                      noStyle
                                    >
                                        <Checkbox
                                          style={{
                                              fontSize: "12px",
                                          }}
                                        >
                                            {t(
                                              "pages.login.remember",
                                              "Remember me",
                                            )}
                                        </Checkbox>
                                    </Form.Item>
                                </div>
                                <Button
                                  type="primary"
                                  size="large"
                                  htmlType="submit"
                                  block
                                >
                                    {t("pages.login.signin", "Sign in")}
                                </Button>
                            </Form>
                        </Card>
                    </div>
                </Col>
            </Row>
        </AntdLayout>
    );
};


