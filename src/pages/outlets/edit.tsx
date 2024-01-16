import React from "react";
import {IResourceComponentsProps, useTranslate} from "@pankod/refine-core";
import {Edit, ListButton, SaveButton, Typography, useForm,} from "@pankod/refine-antd";

import "react-mde/lib/styles/css/react-mde-all.css";
import {TIME_FORMAT} from "../../common/constants";
import {OutletForm} from "../../components/outlets/OutletForm";
import dayjs from "dayjs";
import {EOutletType, IOutlet} from "interfaces/outlets";
import {useOutletInfo} from "../../hooks/products";
import {OutletBreadcrumbs} from "../../components/outlets/outletBreadcrumb";
import {Link} from "react-router-dom";
import {EAppResources, EPageActions} from "interfaces/common";
import { AccessWrapperForPage } from "components/accessWrapper";


export const OutletEdit: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();

  const { formProps, saveButtonProps } = useForm<IOutlet>({
    resource: EAppResources.OUTLETS,
    action: EPageActions.EDIT,
    dataProviderName: "customProvider",
    redirect: EPageActions.SHOW
  });

  const {marketProps, changeMarket} = useOutletInfo(formProps?.initialValues || null);

  return (
    <AccessWrapperForPage resource={EAppResources.OUTLETS} action={EPageActions.EDIT}>
      <Edit saveButtonProps={saveButtonProps}
            actionButtons={true}
            pageHeaderProps={{
              className: "action-page-layout",
              title: <div className={"flex-column"}>
                <Typography.Title level={3} style={{margin: 0}}>{formProps.initialValues?.title}</Typography.Title>
                <Link style={{fontSize: '13px', fontWeight: '300', lineHeight: '20px'}}
                      to={`/products?outlet_id=${formProps.initialValues?.id}`}>Перейти к товарам</Link>
              </div>,
              breadcrumb: <OutletBreadcrumbs action={"edit"} market={marketProps || null}/>,
              extra: <>
                <ListButton
                  data-testid="edit-list-button"
                  resourceNameOrRouteName={"outlets"}
                />
                <SaveButton {...saveButtonProps} htmlType="submit"/>
              </>
            }}>
        <OutletForm
          marketProps={marketProps}
          changeMarket={changeMarket}
          formProps={{
            ...formProps,
            initialValues: {
              ...formProps.initialValues,
              users: formProps.initialValues?.users?.map((u: any) => ({
                ...u,
                value: u.id,
                label: u.username ? u.username : `${u.firstName} ${u.lastName}`
              })),
              type: !formProps.initialValues?.marketId ? EOutletType.POINT : formProps.initialValues?.isNetwork ? EOutletType.NETWORK : EOutletType.MARKET,
              workHoursStart: !formProps.initialValues?.workHoursStart ? null : dayjs(formProps.initialValues?.workHoursStart, TIME_FORMAT),
              workHoursEnd: !formProps.initialValues?.workHoursEnd ? null : dayjs(formProps.initialValues?.workHoursEnd, TIME_FORMAT),
            }
          }}
        />
      </Edit>
    </AccessWrapperForPage>
  );
};
