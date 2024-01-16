import React from "react";
import { IResourceComponentsProps, useTranslate } from "@pankod/refine-core";
import {
  Create, useForm, SaveButton
} from "@pankod/refine-antd";

import { IMarket } from "interfaces/markets";
import { NetworkForm } from "components/networks/NetworkForm";
import {useParams} from "react-router-dom";
import {EAppResources, EPageActions} from "interfaces/common";
import { AccessWrapperForPage } from "components/accessWrapper";


export const NetworkCreate: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();

  const routeParams = useParams();

  const { saveButtonProps, formProps } = useForm<IMarket>({
    resource: EAppResources.NETWORKS,
    action: routeParams?.id ? EPageActions.CLONE : EPageActions.CREATE,
    dataProviderName: "customProvider",
    redirect: EPageActions.SHOW
  });

  return (
    <AccessWrapperForPage resource={EAppResources.NETWORKS} action={routeParams?.id ? EPageActions.CLONE : EPageActions.CREATE}>
      <Create saveButtonProps={saveButtonProps}
              title={!routeParams?.id ? t('markets.titles.create') : t('markets.titles.clone')}
              actionButtons={false}
              pageHeaderProps={{
                className: "action-page-layout",
                extra: <SaveButton {...saveButtonProps} htmlType="submit"/>
              }}>
        <NetworkForm formProps={{
          ...formProps,
          initialValues: routeParams?.id ? {
            ...formProps.initialValues,
            id: null,
            sourceId: formProps?.initialValues?.id,
            copy: !!formProps?.initialValues?.id,
          } : {
            "title": "",
            "isNetwork": true,
            "isReadyForPublishing": false,
            "isActive": false,
            "imageVector": null,
            "imageRaster": null,
            "users": [],
          }
        }}/>
      </Create>
    </AccessWrapperForPage>
  );
};
