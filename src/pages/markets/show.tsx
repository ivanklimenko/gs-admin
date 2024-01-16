import React  from "react";
import { IResourceComponentsProps, usePermissions, useTranslate } from "@pankod/refine-core";
import {
  Show, Typography, useForm,
} from "@pankod/refine-antd";
import {Link} from "react-router-dom";
import moment from "moment";
import "react-mde/lib/styles/css/react-mde-all.css";
import dayjs from "dayjs";

import { IMarket } from "interfaces/markets";
import { MarketForm } from "components/markets/MarketForm";
import {DATE_FORMAT, PLACEHOLDER_TIME_FORMAT, TIME_FORMAT} from "common/constants";
import {EUserRole} from "interfaces/users";
import {formatZones} from "utils";
import {EAppResources, EPageActions} from "interfaces/common";
import { AccessWrapperForPage } from "components/accessWrapper";


export const MarketShow: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();
  const { data: permissions } = usePermissions<string>();

  const { formProps } = useForm<IMarket>({
    resource: EAppResources.MARKETS,
    action: EPageActions.EDIT,
    dataProviderName: "customProvider"
  });


  return (
    <AccessWrapperForPage resource={EAppResources.MARKETS} action={EPageActions.SHOW}>
      <Show canDelete={permissions?.includes(EUserRole.ADMIN)} pageHeaderProps={{
        className: "action-page-layout",
        title: <div className={"flex-column"}>
          <Typography.Title level={3} style={{margin: 0}}>{formProps.initialValues?.title}</Typography.Title>
          <Link style={{fontSize: '13px', fontWeight: '300', lineHeight: '20px'}}
                to={`/outlets?market_id=${formProps.initialValues?.id}`}>Перейти к точам продаж</Link>
        </div>
      }}>
        <MarketForm
          readonlyMode={true}
          formProps={{
            ...formProps,
            initialValues: {
              ...formProps.initialValues,
              zones: formatZones(formProps),
              contractDate: !formProps.initialValues?.contractDate ? null : moment(formProps.initialValues?.contractDate, DATE_FORMAT),
              workHoursStart: !formProps.initialValues?.workHoursStart ? null : dayjs(formProps.initialValues?.workHoursStart, TIME_FORMAT).format(PLACEHOLDER_TIME_FORMAT),
              workHoursEnd: !formProps.initialValues?.workHoursEnd ? null : dayjs(formProps.initialValues?.workHoursEnd, TIME_FORMAT).format(PLACEHOLDER_TIME_FORMAT),
            }
          }}
        />
      </Show>
    </AccessWrapperForPage>
  );
};
