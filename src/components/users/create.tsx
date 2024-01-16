import {useTranslate} from "@pankod/refine-core";

import {
  Create,
  Drawer,
  DrawerProps,
  Form,
  FormProps,
  Input,
  Select,
  ButtonProps,
  Grid,
  useSelect, Switch,
} from "@pankod/refine-antd";
import {MaskedInput} from "antd-mask-input";

import {IMarket} from "interfaces/markets";
import {IOutlet} from "interfaces/outlets";
import React, {useEffect, useState} from "react";
import {FORM_COMMON_RULES} from "common/constants";
import {USER_ROLES} from "interfaces/users";
import {useOutletsList} from "../../hooks/products";
import {UserForm} from "./UserForm";
//import InputMask from "react-input-mask";


type CreateUserProps = {
  drawerProps: DrawerProps;
  formProps: FormProps;
  saveButtonProps: ButtonProps;
};

export const CreateUser: React.FC<CreateUserProps> = ({
                                                        drawerProps,
                                                        formProps,
                                                        saveButtonProps,
                                                      }) => {
  const t = useTranslate();
  const [selectMarket, setSelectMarket] = useState(null);
  const breakpoint = Grid.useBreakpoint();

  // const {selectProps: outletsSelectProps} = useSelect<IOutlet>({
  //   resource: "outlets",
  //   dataProviderName: "autocompleteProvider"
  // });

  return (
    <Drawer
      {...drawerProps}
      destroyOnClose={true}
      width={breakpoint.sm ? "500px" : "100%"}
      bodyStyle={{padding: 0}}
      afterOpenChange={() => {formProps.form?.resetFields();}}
      className={"action-drawer-layout"}
      zIndex={1001}
    >
      <Create resource="users"
              title={t("users.create")}
              saveButtonProps={saveButtonProps}>
        <UserForm formProps={{
          ...formProps,
          initialValues: {
            username: '',
            password: '',
            isActive: false,
          }
        }}/>
      </Create>
    </Drawer>
  );
};
