import React from "react";
import { IResourceComponentsProps, usePermissions } from "@pankod/refine-core";
import {
  Show, Typography, useForm
} from "@pankod/refine-antd";

import "react-mde/lib/styles/css/react-mde-all.css";
import { IMarket } from "interfaces/markets";
import {PLACEHOLDER_TIME_FORMAT, TIME_FORMAT} from "common/constants";
import dayjs from "dayjs";
import {EUserRole} from "interfaces/users";
import {OutletForm} from "components/outlets/OutletForm";
import {EOutletType, OUTLETS_TYPES} from "interfaces/outlets";
import {useOutletInfo} from "../../hooks/products";
import {OutletBreadcrumbs} from "../../components/outlets/outletBreadcrumb";
import {Link} from "react-router-dom";
import {EAppResources, EPageActions} from "interfaces/common";
import {AccessWrapperForPage} from "../../components/accessWrapper";


export const OutletShow: React.FC<IResourceComponentsProps> = () => {

  const { data: permissions } = usePermissions<string>();

  const { formProps } = useForm<IMarket>({
    resource: EAppResources.OUTLETS,
    action: EPageActions.EDIT,
    dataProviderName: "customProvider"
  });

  const {marketProps, changeMarket} = useOutletInfo(formProps?.initialValues || null);

  return (
    <AccessWrapperForPage resource={EAppResources.OUTLETS} action={EPageActions.SHOW}>
      <Show canDelete={permissions?.includes(EUserRole.ADMIN)} pageHeaderProps={{
        breadcrumb: <OutletBreadcrumbs action={"show"} market={marketProps || null}/>,
        className: "action-page-layout",
        title: <div className={"flex-column"}>
          <Typography.Title level={3} style={{margin: 0}}>{formProps.initialValues?.title}</Typography.Title>
          <Link style={{fontSize: '13px', fontWeight: '300', lineHeight: '20px'}}
                to={`/products?outlet_id=${formProps.initialValues?.id}`}>Перейти к товарам</Link>
        </div>,
      }}>
        <OutletForm
          readonlyMode={true}
          marketProps={marketProps}
          changeMarket={changeMarket}
          formProps={{
            ...formProps,
            initialValues: {
              ...formProps.initialValues,
              type: !formProps.initialValues?.marketId ? (OUTLETS_TYPES.find(t => t.value === EOutletType.POINT))?.label:
                formProps.initialValues?.isNetwork ? (OUTLETS_TYPES.find(t => t.value === EOutletType.NETWORK))?.label :
                  (OUTLETS_TYPES.find(t => t.value === EOutletType.MARKET))?.label,
              workHoursStart: !formProps.initialValues?.workHoursStart ? null : dayjs(formProps.initialValues?.workHoursStart, TIME_FORMAT).format(PLACEHOLDER_TIME_FORMAT),
              workHoursEnd: !formProps.initialValues?.workHoursEnd ? null : dayjs(formProps.initialValues?.workHoursEnd, TIME_FORMAT).format(PLACEHOLDER_TIME_FORMAT),
            }
          }}
        />
      </Show>
    </AccessWrapperForPage>
  );
};
