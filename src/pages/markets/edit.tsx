import React  from "react";
import { IResourceComponentsProps } from "@pankod/refine-core";
import {
  Edit, ListButton, SaveButton, Typography, useForm
} from "@pankod/refine-antd";

import "react-mde/lib/styles/css/react-mde-all.css";
import { IMarket } from "interfaces/markets";
import { MarketForm } from "components/markets/MarketForm";
import {DATE_FORMAT, TIME_FORMAT} from "../../common/constants";
import dayjs from "dayjs";
import {Link} from "react-router-dom";
import {formatZones, getUserLabel} from "utils";
import moment from "moment";
import {EAppResources, EPageActions} from "interfaces/common";
import { AccessWrapperForPage } from "components/accessWrapper";


export const MarketEdit: React.FC<IResourceComponentsProps> = () => {

  const { formProps, saveButtonProps } = useForm<IMarket>({
    resource: EAppResources.MARKETS,
    action: EPageActions.EDIT,
    dataProviderName: "customProvider",
    redirect: EPageActions.SHOW
  });

  return (
    <AccessWrapperForPage resource={EAppResources.MARKETS} action={EPageActions.EDIT}>
      <Edit saveButtonProps={saveButtonProps}
            actionButtons={true}
            pageHeaderProps={{
              className: "action-page-layout",
              title: <div className={"flex-column"}>
                <Typography.Title level={3} style={{margin: 0}}>{formProps.initialValues?.title}</Typography.Title>
                <Link style={{fontSize: '13px', fontWeight: '300', lineHeight: '20px'}}
                      to={`/outlets?market_id=${formProps.initialValues?.id}`}>Перейти к точам продаж</Link>
              </div>,
              extra: <>
                <ListButton
                  data-testid="edit-list-button"
                  resourceNameOrRouteName={"markets"}
                />
                <SaveButton {...saveButtonProps} htmlType="submit"/>
              </>
            }}>
        <MarketForm
          formProps={{
            ...formProps,
            initialValues: {
              ...formProps.initialValues,
              zones: formatZones(formProps),
              users: formProps.initialValues?.users?.map((u: any) => ({
                ...u,
                value: u.id,
                label: getUserLabel(u)
              })),
              contractDate: !formProps.initialValues?.contractDate ? null : moment(formProps.initialValues?.contractDate, DATE_FORMAT),
              workHoursStart: !formProps.initialValues?.workHoursStart ? null : dayjs(formProps.initialValues?.workHoursStart, TIME_FORMAT),
              workHoursEnd: !formProps.initialValues?.workHoursEnd ? null : dayjs(formProps.initialValues?.workHoursEnd, TIME_FORMAT),
            }
          }}
        />
      </Edit>
    </AccessWrapperForPage>
  );
};
