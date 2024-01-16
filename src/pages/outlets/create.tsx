import React from "react";
import {IResourceComponentsProps, useTranslate} from "@pankod/refine-core";
import {
  Create,
  useForm, SaveButton,
} from "@pankod/refine-antd";

import {EOutletType, IOutlet} from "interfaces/outlets";
import {OutletForm} from "components/outlets/OutletForm";
import {useParams} from "react-router-dom";
import dayjs from "dayjs";
import {TIME_FORMAT} from "../../common/constants";
import {useOutletInfo} from "../../hooks/products";
import {OutletBreadcrumbs} from "components/outlets/outletBreadcrumb";
import {EAppResources, EPageActions} from "interfaces/common";
import {AccessWrapperForPage} from "components/accessWrapper";


export const OutletsCreate: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();

  const routeParams = useParams();

  const { saveButtonProps, formProps } = useForm<IOutlet>({
    resource: EAppResources.OUTLETS,
    action: routeParams?.id ? EPageActions.CLONE : EPageActions.CREATE,
    dataProviderName: "customProvider",
    redirect: EPageActions.SHOW
  });

  const {marketProps, changeMarket} = useOutletInfo(formProps?.initialValues || null);

  return (
    <AccessWrapperForPage resource={EAppResources.OUTLETS} action={routeParams?.id ? EPageActions.CLONE : EPageActions.CREATE}>
      <Create saveButtonProps={saveButtonProps}
              title={!routeParams?.id ? t('outlets.titles.create') : t('outlets.titles.clone')}
              actionButtons={false}
              pageHeaderProps={!routeParams?.id ? {
                className: "action-page-layout",
                extra: <SaveButton {...saveButtonProps} htmlType="submit"/>
              } : {
                className: "action-page-layout",
                breadcrumb: <OutletBreadcrumbs action={"create"} market={marketProps || null}/>,
                extra: <SaveButton {...saveButtonProps} htmlType="submit"/>
              }}>
        <OutletForm
          marketProps={marketProps}
          changeMarket={changeMarket}
          formProps={{
            ...formProps,
            initialValues: routeParams?.id ? {
              ...formProps.initialValues,
              id: null,
              sourceId: formProps?.initialValues?.id,
              copy: !!formProps?.initialValues?.id,
              type: !formProps.initialValues?.marketId ? EOutletType.POINT : formProps.initialValues?.isNetwork ? EOutletType.NETWORK : EOutletType.MARKET,
              workHoursStart: !formProps.initialValues?.workHoursStart ? null : dayjs(formProps.initialValues?.workHoursStart, TIME_FORMAT),
              workHoursEnd: !formProps.initialValues?.workHoursEnd ? null : dayjs(formProps.initialValues?.workHoursEnd, TIME_FORMAT),
            } : {
                "title": "",
                "type": EOutletType.MARKET,
                "isActive": false,
                "isEnabled": false,
                "imageBkgSite": null,
                "imageBkgMobile": null,
                "imageLogoWhite": null,
                "imageLogoColor": null,
                "workHoursStart": "",
                "workHoursEnd": "",
                "users": [],
                "contracts": [],
                "location": {
                    "type": "Point",
                    "coordinates": [
                        0, 0
                    ]
                }
            }
        }}/>
      </Create>
    </AccessWrapperForPage>
  );
};
