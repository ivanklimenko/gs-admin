import React, {useEffect} from "react";
import {IResourceComponentsProps, useList, useMany, usePermissions, useShow} from "@pankod/refine-core";
import {ErrorComponent, Show, Typography} from "@pankod/refine-antd";

import {EUserRole} from "interfaces/users";
import {Order} from "components/orders/Order";
import {IOrder, IOrderOutlet} from "interfaces/orders";
import {getDatetimeInReadableFormat} from "utils";
import {EAppResources, EPageActions} from "interfaces/common";
import {AccessWrapperForPage} from "components/accessWrapper";


export const OrderShow: React.FC<IResourceComponentsProps> = () => {

  const { queryResult } = useShow<IOrder>();
  const { data, isLoading, error } = queryResult;
  const { data: permissions } = usePermissions<string>();

  const outletStatuses = useList<IOrderOutlet>({
    resource: "orders/status",
    dataProviderName: "ordersProvider",
    config: {
      filters: [{
        field: "orderId",
        operator: "eq",
        value: data?.data?.id,
      }]
    }
  });

  const outletLogs = useMany<any>({
    resource: "orders/status/log",
    // @ts-ignore
    ids: !outletStatuses?.data?.data ? [] : outletStatuses?.data?.data?.map(o => o.id),
    dataProviderName: "ordersProvider",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      outletStatuses?.refetch()
      outletLogs?.refetch()
      queryResult?.refetch()
    }, 30000)
    return () => clearTimeout(timer);
  }, []);

  return (
    <AccessWrapperForPage resource={EAppResources.ORDERS} action={EPageActions.SHOW}>
      <Show canDelete={permissions?.includes(EUserRole.ADMIN)}
            isLoading={isLoading}
            pageHeaderProps={{
              className: "action-page-layout",
              title: <div className={"flex-column"}>
                <Typography.Title level={3} style={{margin: 0}}>{`Заказ #${data?.data?.id || ''}`}</Typography.Title>
                <Typography.Text type="secondary" style={{fontSize: '13px', fontWeight: '300', lineHeight: '20px'}}>
                  {!data?.data?.createdAt ? '' : `От ${getDatetimeInReadableFormat(data?.data?.createdAt || '')}`}
                </Typography.Text>
              </div>
      }}>
        {  /* @ts-ignore*/}
        {error?.statusCode === 404 ? (
          // <NotFound/>
          <ErrorComponent/>
        ) : (
          <Order
            onRefetchOrder={() => {
              outletStatuses?.refetch()
              outletLogs?.refetch()
              queryResult?.refetch()
            }}
            order={!data?.data  ? null : {
              ...data?.data,
              changelog: [],
              statuses: outletStatuses?.data?.data?.map(s => ({
                ...s,
                logs:outletLogs?.data?.data?.[0] ? outletLogs?.data?.data?.[0]?.[s.id] : []
              })) || [],
            }}/>
        )}
      </Show>
    </AccessWrapperForPage>
  );
};
