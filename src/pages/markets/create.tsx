import React from "react";
import { IResourceComponentsProps, useTranslate } from "@pankod/refine-core";
import {
  Create, useForm, SaveButton
} from "@pankod/refine-antd";

import { IMarket } from "interfaces/markets";
import { MarketForm } from "components/markets/MarketForm";
import {useParams} from "react-router-dom";
import dayjs from "dayjs";
import {DATE_FORMAT, TIME_FORMAT} from "../../common/constants";
import {formatZones} from "../../utils";
import moment from "moment";
import {EAppResources, EPageActions} from "interfaces/common";
import { AccessWrapperForPage } from "components/accessWrapper";


export const MarketCreate: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();

  const routeParams = useParams();

  const { saveButtonProps, formProps } = useForm<IMarket>({
    resource: EAppResources.MARKETS,
    action: routeParams?.id ? EPageActions.CLONE : EPageActions.CREATE,
    dataProviderName: "customProvider"
  });

  return (
    <AccessWrapperForPage resource={EAppResources.MARKETS} action={routeParams?.id ? EPageActions.CLONE : EPageActions.CREATE}>
      <Create saveButtonProps={saveButtonProps}
              title={!routeParams?.id ? t('markets.titles.create') : t('markets.titles.clone')}
              actionButtons={false}
              pageHeaderProps={{
                className: "action-page-layout",
                extra: <SaveButton {...saveButtonProps} htmlType="submit"/>
              }}>
        <MarketForm formProps={{
          ...formProps,
          initialValues: routeParams?.id ? {
            ...formProps.initialValues,
            id: null,
            zones: formatZones(formProps),
            sourceId: formProps?.initialValues?.id,
            copy: !!formProps?.initialValues?.id,
            contractDate: !formProps.initialValues?.contractDate ? null : moment(formProps.initialValues?.contractDate, DATE_FORMAT),
            workHoursStart: !formProps.initialValues?.workHoursStart ? null : dayjs(formProps.initialValues?.workHoursStart, TIME_FORMAT),
            workHoursEnd: !formProps.initialValues?.workHoursEnd ? null : dayjs(formProps.initialValues?.workHoursEnd, TIME_FORMAT),
          } : {
            "title": "",
            "isReadyForPublishing": false,
            "isActive": false,
            "imageVector": null,
            "imageRaster": null,
            "workHoursStart": "",
            "workHoursEnd": "",
            "users": [],
            "location": {
              "type": "Point",
              "coordinates": [55.75, 37.57]
            },
          }
        }}/>
      </Create>
    </AccessWrapperForPage>
  );
};
