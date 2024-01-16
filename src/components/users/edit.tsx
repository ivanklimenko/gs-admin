import {useTranslate} from "@pankod/refine-core";

import {
  Edit,
  Drawer,
  DrawerProps,
  Form,
  FormProps,
  Input,
  Select,
  ButtonProps,
  Grid,
  useSelect, Divider, Button, Switch, BooleanField, Tag, Descriptions,
} from "@pankod/refine-antd";

import {IMarket} from "interfaces/markets";
import {IOutlet} from "interfaces/outlets";

import React, { useState } from "react";
import {FORM_COMMON_RULES} from "common/constants";
import {USER_ROLES} from "interfaces/users";
import {getRoleTranscriptionValue} from "../../utils";
import {MaskedInput} from "antd-mask-input";
import {UserForm} from "./UserForm";
import {CustomBooleanField} from "../customBooleanField";

type EditProductProps = {
  drawerProps: DrawerProps;
  formProps: FormProps;
  saveButtonProps: ButtonProps;
  showMode?: boolean;
};

export const EditUser: React.FC<EditProductProps> = ({
                                                       drawerProps,
                                                       formProps,
                                                       saveButtonProps,
                                                       showMode = false
                                                     }) => {
  const t = useTranslate();
  const breakpoint = Grid.useBreakpoint();

  const [selectMarkets, setSelectMarkets] = useState(null);
  const [selectOutlets, setSelectOutlets] = useState(null);

  const [showPasswordFields, setShowPassword] = useState(false);
  const {selectProps: marketsSelectProps} = useSelect<IMarket>({
    resource: "markets",
    dataProviderName: "autocompleteProvider"
  });

  const {selectProps: outletsSelectProps} = useSelect<IOutlet>({
    resource: "outlets",
    dataProviderName: "autocompleteProvider"
  });

  return (
    <Drawer
      {...drawerProps}
      onClose={(e) => {
        setShowPassword(false);
        // @ts-ignore
        drawerProps.onClose(e)
      }}
      width={breakpoint.sm ? "500px" : "100%"}
      bodyStyle={{padding: 0}}
      className={"action-drawer-layout"}
      zIndex={1001}
    >
      <Edit
        saveButtonProps={saveButtonProps}
        pageHeaderProps={{
          extra: null,
          title: showMode ? "" : t('actions.edit')
        }}
        resource="users"
      >

        {showMode ? (
          <Descriptions title="" column={1} size={"middle"} style={{padding: 0}}>
            <Descriptions.Item label={t("users.fields.username")}>
              {formProps?.initialValues?.username || "--"}
            </Descriptions.Item>

            <Descriptions.Item label={t("users.fields.firstName")}>
              {formProps?.initialValues?.firstName || "--"}
            </Descriptions.Item>

            <Descriptions.Item label={t("users.fields.lastName")}>
              {formProps?.initialValues?.lastName || "--"}
            </Descriptions.Item>

            <Descriptions.Item label={t("users.fields.email")}>
              {formProps?.initialValues?.email || "--"}
            </Descriptions.Item>

            <Descriptions.Item label={t("users.fields.phone")}>
              {formProps?.initialValues?.phone || "--"}
            </Descriptions.Item>

            <Descriptions.Item label={t("users.fields.isActive")}>
              <CustomBooleanField value={formProps?.initialValues?.isActive}/>
            </Descriptions.Item>

            <Descriptions.Item label={t("users.fields.role.label")}>
              {formProps?.initialValues?.roles?.map((r:string) => <Tag>
                {t(`users.fields.role.${getRoleTranscriptionValue(r|| "none")}`)}
              </Tag>) || null}
            </Descriptions.Item>

            <Descriptions.Item label={t("users.fields.markets")}>
              {formProps?.initialValues?.markets?.map((m:any) => <Tag>{m?.title}</Tag>) || null}
            </Descriptions.Item>

            <Descriptions.Item label={t("users.fields.outlets")}>
              {formProps?.initialValues?.outlets?.map((o:any) => <Tag>{o?.title}</Tag>) || null}
            </Descriptions.Item>

          </Descriptions>
        ) : (
          <UserForm formProps={{
            ...formProps,
            initialValues: {
              ...formProps.initialValues,
              markets: formProps.initialValues?.markets?.map((m: any) => ({value: m.id, label: m.title})) || [],
              outlets: formProps.initialValues?.outlets?.map((o: any) => ({value: o.id, label: o.title, ...o})) || []
            }
          }}/>
        )}
      </Edit>
    </Drawer>
  );
};
