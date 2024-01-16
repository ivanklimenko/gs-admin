import {useTranslate, usePermissions} from "@pankod/refine-core";

import {
  useForm, Show,
} from "@pankod/refine-antd";

import "moment/locale/ru";
import React from "react";
import {IMarket} from "interfaces/markets";
import {DiscountForm} from "components/discounts/DiscountForm";
import {EUserRole} from "interfaces/users";
import {EAppResources, EPageActions} from "interfaces/common";
import { AccessWrapperForPage } from "components/accessWrapper";


export const DiscountShow: React.FC = () => {
  const t = useTranslate();
  const { data: permissions } = usePermissions<string>();

  const { formProps } = useForm<IMarket>({
    resource: EAppResources.DISCOUNTS,
    action: EPageActions.EDIT,
    dataProviderName: "customProvider"
  });

  return (
    <AccessWrapperForPage resource={EAppResources.DISCOUNTS} action={EPageActions.SHOW}>
      <Show canDelete={permissions?.includes(EUserRole.ADMIN)} pageHeaderProps={{
        className: "action-page-layout",
        // title: <div className={"flex-column"}>
        //   <Typography.Title level={3} style={{margin: 0}}>{formProps.initialValues?.title}</Typography.Title>
        //   <Link style={{fontSize: '13px', fontWeight: '300', lineHeight: '20px'}}
        //         to={`/products?outlet_id=${formProps.initialValues?.id}`}>Перейти к товарам</Link>
        // </div>,
      }}>
        <DiscountForm
          readonlyMode={true}
          formProps={{
            ...formProps
          }}
        />
      </Show>
    </AccessWrapperForPage>
  );
};
