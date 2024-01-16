import React, {useState} from "react";
import {IResourceComponentsProps, useTranslate} from "@pankod/refine-core";
import {Create, SaveButton, useForm} from "@pankod/refine-antd";
import moment from "moment";
import {useParams} from "react-router-dom";

import {IContract} from "interfaces/contracts";
import {ContractForm} from "components/contracts/ContractForm";
import {DATE_FORMAT} from "common/constants";
import {AccessWrapperForPage} from "components/accessWrapper";
import {EAppResources, EPageActions} from "interfaces/common";


export const ContractCreate: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();
  const routeParams = useParams();

  const { saveButtonProps, formProps } = useForm<IContract>({
    resource: EAppResources.CONTRACTS,
    action: routeParams?.id ? EPageActions.CLONE : EPageActions.CREATE,
    dataProviderName: "customProvider",
    redirect: EPageActions.SHOW
  });

  return (
    <AccessWrapperForPage resource={EAppResources.CONTRACTS} action={routeParams?.id ? EPageActions.CLONE : EPageActions.CREATE}>
      <Create saveButtonProps={saveButtonProps}
              title={!routeParams?.id ? t('contracts.titles.create') : t('contracts.titles.clone')}
              actionButtons={false}
              pageHeaderProps={{
                className: "action-page-layout",
                extra: <SaveButton {...saveButtonProps} htmlType="submit"/>
              }}>
        <ContractForm formProps={{
          ...formProps,
          initialValues: !routeParams?.id ? formProps.initialValues : {
            ...formProps.initialValues,
            id: null,
            sourceId: formProps?.initialValues?.id,
            copy: !!formProps?.initialValues?.id,
            dates: [!formProps.initialValues?.signedAt ? null : moment(formProps.initialValues?.signedAt, DATE_FORMAT),
              !formProps.initialValues?.expiresAt ? null : moment(formProps.initialValues?.expiresAt, DATE_FORMAT)],
            signedAt: !formProps.initialValues?.signedAt ? null : moment(formProps.initialValues?.signedAt, DATE_FORMAT),
            expiresAt: !formProps.initialValues?.expiresAt ? null : moment(formProps.initialValues?.expiresAt, DATE_FORMAT),
          }
        }}/>
      </Create>
    </AccessWrapperForPage>
  );
};
