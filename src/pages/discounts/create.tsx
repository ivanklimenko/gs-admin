import {useTranslate} from "@pankod/refine-core";

import {
  Create, useForm, SaveButton
} from "@pankod/refine-antd";

import "moment/locale/ru";
import React from "react";
import {IMarket} from "interfaces/markets";
import {DiscountForm} from "components/discounts/DiscountForm";
import {EAppResources, EPageActions} from "interfaces/common";
import {AccessWrapperForPage} from "components/accessWrapper";

export const DiscountCreate: React.FC = () => {
  const t = useTranslate();

  const { saveButtonProps, formProps } = useForm<IMarket>({
    resource: EAppResources.DISCOUNTS,
    action: EPageActions.CREATE,
    dataProviderName: "customProvider",
    redirect: EPageActions.SHOW
  });

  return (
    <AccessWrapperForPage resource={EAppResources.DISCOUNTS} action={EPageActions.CREATE}>
      <Create saveButtonProps={saveButtonProps}
              actionButtons={false}
              pageHeaderProps={{
                className: "action-page-layout",
                extra: <SaveButton {...saveButtonProps} htmlType="submit"/>
              }}>
        <DiscountForm formProps={{
          ...formProps
        }}
        />
      </Create>
    </AccessWrapperForPage>
  );
};
