import React, {useState} from "react";
import {useTranslate} from "@pankod/refine-core";
import {
  Form,
  Input,
  FormProps,
  Switch, Select, useSelect, Divider, Button
} from "@pankod/refine-antd";

import {FORM_COMMON_RULES} from "common/constants";

import {MaskedInput} from "antd-mask-input";
import {USER_ROLES} from "interfaces/users";
import {useOutletsList} from "../../hooks/products";
import {IMarket} from "interfaces/markets";
import {IOutlet} from "@interfaces/outlets";
import {initial} from "lodash";

type FormUserProps = {
  formProps: FormProps;
  readonlyMode?: boolean
};

export const UserForm: React.FC<FormUserProps> = ({formProps, readonlyMode= false}) => {
  const t = useTranslate();

  const { outletsSelectProps, setSearchOutletValue } = useOutletsList();

  const [showPasswordFields, setShowPassword] = useState(false);
  const {selectProps: marketsSelectProps} = useSelect<IMarket>({
    resource: "markets",
    dataProviderName: "autocompleteProvider"
  });

  return (
    <Form
      {...formProps}
      autoComplete={"off"}
      onFinish={(values) => {
        // @ts-ignore
        formProps.onFinish({
          ...values,
          username: values?.username?.trim(),
          email: values?.email?.trim(),
          firstName: values?.firstName?.trim(),
          lastName: values?.lastName?.trim(),
          phone: values.phone?.replace(/ |_|\(|-|\)|/g, '')?.trim(),
          markets: values.markets?.map((m: any) => m.value ? m.value : m),
          outlets: values.outlets?.map((o: any) => o.value ? o.value : o),
        })
      }}
      layout="vertical"
    >

      {!!formProps?.initialValues?.id && (
        <Form.Item
          hidden={true}
          name="id"
        >
        </Form.Item>
      )}

      <Form.Item
        label={t("users.fields.username")}
        name="username"
        initialValue={''}
        rules={[
          ...FORM_COMMON_RULES,
          {
            min: 4,
            message: 'Длина логина должна быть больше четырех символов'
          }
        ]}
      >
        <Input type={"text"} min={4}/>
      </Form.Item>

      <Form.Item
        label={t("users.fields.firstName")}
        name="firstName"
      >
        <Input/>
      </Form.Item>

      <Form.Item
        label={t("users.fields.lastName")}
        name="lastName"
      >
        <Input/>
      </Form.Item>

      <Form.Item
        label={t("users.fields.email")}
        name="email"
        rules={[...FORM_COMMON_RULES]}
      >
        <Input type={"email"}/>
      </Form.Item>

      <Form.Item
        label={t("users.fields.isActive")}
        name="isActive"
        valuePropName="checked"
      >
        <Switch size={"small"}/>
      </Form.Item>

      <Form.Item
        label={t("users.fields.phone")}
        name="phone"
        rules={[...FORM_COMMON_RULES]}
      >
        <MaskedInput
          mask={
            //  https://imask.js.org/guide.html#masked-pattern
            [
              {mask: '+7(900)000-00-00'}
            ]
          }
        />
        {/*<Input type={"tel"}/>*/}
      </Form.Item>

      <Form.Item
        label={t("users.fields.role.label")}
        name="roles"
        rules={[...FORM_COMMON_RULES]}
      >
        <Select
          mode="multiple"
          allowClear
          placeholder={t("users.fields.role.placeholder")}
          options={USER_ROLES.map(r => ({
            label: t(`users.fields.role.${r.label_key}`),
            value: r.value
          }))}
        />
      </Form.Item>

      <Form.Item
        label={t("users.fields.markets")}
        name="markets"
      >
        <Select
          showSearch
          mode={"multiple"}
          notFoundContent={null}
          defaultActiveFirstOption={false}
          showArrow={false}
          filterOption={false}
          onSearch={(value) => {
            if (marketsSelectProps.onSearch) {
              marketsSelectProps.onSearch(value);
            }
          }}
        >
          {marketsSelectProps?.options?.map(d => <Select.Option key={d.value} value={d.value}>{d.label}</Select.Option>)}
        </Select>
      </Form.Item>

      <Form.Item
        label={t("users.fields.outlets")}
        name="outlets"
      >
        <Select
          showSearch
          mode={"multiple"}
          notFoundContent={null}
          defaultActiveFirstOption={false}
          showArrow={false}
          filterOption={false}
          onSearch={(value) => {
            setSearchOutletValue(value)
            // if (outletsSelectProps.onSearch) {
            //   outletsSelectProps.onSearch(value);
            // }
          }}
        >
          { (formProps?.initialValues?.outlets && !outletsSelectProps?.data?.data?.length) ? (
            [...formProps?.initialValues?.outlets].map(d => <Select.Option key={d?.id} value={d?.id}>{`${d.title} (${d?.market?.title})`}</Select.Option>)
          ) : (
            <>
              {!formProps?.initialValues?.outlets?.length ? (
                outletsSelectProps?.data?.data?.map(d => <Select.Option key={d?.id} value={d?.id}>{`${d.title} (${d?.market?.title})`}</Select.Option>)
              ) : (
                <>
                  {(outletsSelectProps?.data?.data?.length && formProps?.initialValues?.outlets) && [...formProps?.initialValues?.outlets.filter((o: IOutlet) => !outletsSelectProps?.data?.data.some(go => go.id === o.id)), ...outletsSelectProps?.data?.data]?.map(d => <Select.Option key={d.id} value={d.id}>
                    {`${d.title} (${d?.market?.title})`}
                  </Select.Option>)}
                </>
              ) }
            </>

          )}
        </Select>
      </Form.Item>

      {!formProps?.initialValues?.id ? (
        <>
          <Form.Item
            label={t("users.fields.password")}
            key={"hn-user-password"}
            name="password"
            rules={[
              ...FORM_COMMON_RULES,
              {
                min: 6,
                message: 'Длина пароля должна быть больше шести символов'
              }
            ]}
          >
            <Input.Password key={"hn-user-password"} type={"password"} visibilityToggle={true} min={6} autoComplete="off" />
          </Form.Item>

          <Form.Item
            label={t("users.fields.repeatPassword")}
            name="repeatPassword"
            rules={[
              ...FORM_COMMON_RULES,
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Пароли не совпадают'));
                },
              }),
            ]}
          >
            <Input.Password type={"password"} visibilityToggle={true} autoComplete="off" />
          </Form.Item>
        </>
      ) : (
        <>
          <Divider/>

          {showPasswordFields ? (
            <Button style={{maxWidth: '100%', marginBottom: "12px"}} type={"default"} size={"small"}
                    onClick={() => setShowPassword(false)}>
              Скрыть форму изменения пароля
            </Button>
          ) : (
            <Button style={{maxWidth: '100%'}} type={"primary"} size={"small"}
                    onClick={() => setShowPassword(true)}>
              Изменить пароль
            </Button>
          )}


          {showPasswordFields && (
            <>
              <Form.Item
                label={t("users.fields.password")}
                name="password"
                rules={[
                  ...FORM_COMMON_RULES,
                  {
                    min: 6,
                    message: 'Длина пароля должна быть больше шести символов'
                  }
                ]}
              >
                <Input.Password type={"password"} visibilityToggle={true}/>
              </Form.Item>

              <Form.Item
                label={t("users.fields.repeatPassword")}
                name="repeatPassword"
                rules={[
                  ...FORM_COMMON_RULES,
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Пароли не совпадают'));
                    },
                  }),
                ]}
              >
                <Input.Password type={"password"} visibilityToggle={true}/>
              </Form.Item>
            </>
          )}
        </>
      )}
    </Form>
  );
};
