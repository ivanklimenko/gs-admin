import {useTranslate} from "@pankod/refine-core";

import {
  Create, useForm, SaveButton
} from "@pankod/refine-antd";

import "moment/locale/ru";
import React from "react";
import {IMarket} from "interfaces/markets";
import {TextPageForm} from "../../components/textPages/TextPageForm";
import {ITextPage} from "@interfaces/textPages";
import {EAppResources, EPageActions} from "interfaces/common";
import { AccessWrapperForPage } from "components/accessWrapper";

export const TextPageCreate: React.FC = () => {
  const t = useTranslate();

  const { saveButtonProps, formProps } = useForm<ITextPage>({
    resource: EAppResources.PAGES,
    action: EPageActions.CREATE,
    dataProviderName: "customProvider",
    redirect: EPageActions.SHOW
  });

  return (
    <AccessWrapperForPage resource={EAppResources.PAGES} action={EPageActions.CREATE}>
      <Create saveButtonProps={saveButtonProps}
              actionButtons={false}
              pageHeaderProps={{
                className: "action-page-layout",
                extra: <SaveButton {...saveButtonProps} htmlType="submit"/>
              }}>
        <TextPageForm formProps={{
          ...formProps
        }}
        />
      </Create>
    </AccessWrapperForPage>
  );
};
