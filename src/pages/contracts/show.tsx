import React from "react";
import {IResourceComponentsProps, usePermissions} from "@pankod/refine-core";
import {
  useForm, Show, Typography
} from "@pankod/refine-antd";

import {IContract} from "interfaces/contracts";
import {ContractForm} from "components/contracts/ContractForm";
import {EUserRole} from "interfaces/users";
import {DATE_FORMAT} from "common/constants";
import {getDateInReadableFormat} from "../../utils";
import {Link} from "react-router-dom";
import {EAppResources, EPageActions} from "interfaces/common";
import {AccessWrapperForPage} from "../../components/accessWrapper";


export const ContractShow: React.FC<IResourceComponentsProps> = () => {

  const { data: permissions } = usePermissions<string>();

  const { formProps } = useForm<IContract>({
    resource: EAppResources.CONTRACTS,
    action: EPageActions.EDIT,
    dataProviderName: "customProvider"
  });


  return (
    <AccessWrapperForPage resource={EAppResources.CONTRACTS} action={EPageActions.SHOW}>
      <Show canDelete={permissions?.includes(EUserRole.ADMIN)} pageHeaderProps={{
        className: "action-page-layout",
        title: <div className={"flex-column"}>
          <Typography.Title level={3} style={{margin: 0}}>{`${formProps.initialValues?.person} №${formProps.initialValues?.number}`}</Typography.Title>
          {formProps.initialValues?.outletId && (
            <Link style={{fontSize: '13px', fontWeight: '300', lineHeight: '20px'}} target={'_blank'}
                  to={`/outlets/show/${formProps.initialValues?.outletId}`}>Перейти к точке продаж</Link>
          )}
        </div>,
      }}>
        <ContractForm
          readonlyMode={true}
          formProps={{
            ...formProps,
            initialValues: {
              ...formProps.initialValues,
              signedAt: !formProps.initialValues?.signedAt ? null : getDateInReadableFormat(formProps.initialValues?.signedAt, DATE_FORMAT),
              expiresAt: !formProps.initialValues?.expiresAt ? null : getDateInReadableFormat(formProps.initialValues?.expiresAt, DATE_FORMAT),
            }
          }}/>
      </Show>
    </AccessWrapperForPage>
  );
};
