import React from "react";
import {IMarket} from "interfaces/markets";
import {useTranslate} from "@pankod/refine-core";
import {Breadcrumb} from "antd";
import {Icons} from "@pankod/refine-antd";

export const OutletBreadcrumbs: React.FC<{market: IMarket | null, action: string}> = ({action, market}) => {

  const t = useTranslate();
  return (
    <Breadcrumb>
      <Breadcrumb.Item href="/markets">
        <Icons.ShopOutlined />
        <span>Локации</span>
      </Breadcrumb.Item>
      <Breadcrumb.Item href={`/markets/show/${market?.id}`}>
        {market?.title}
      </Breadcrumb.Item>
      <Breadcrumb.Item href="/outlets">
        <Icons.ShoppingOutlined />
        <span>Точки продаж</span>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        {t(`actions.${action}`)}
      </Breadcrumb.Item>
    </Breadcrumb>
  )
}