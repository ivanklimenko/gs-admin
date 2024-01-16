import {
  Edit, useForm, ListButton, SaveButton,
} from "@pankod/refine-antd";
import "moment/locale/ru";
import React from "react";

import {DiscountForm} from "components/discounts/DiscountForm";
import {IDiscount} from "interfaces/discounts";
import {EAppResources, EPageActions} from "interfaces/common";
import {AccessWrapperForPage} from "components/accessWrapper";


export const DiscountEdit: React.FC = () => {

  const { formProps, saveButtonProps } = useForm<IDiscount>({
    resource: EAppResources.DISCOUNTS,
    action: EPageActions.EDIT,
    dataProviderName: "customProvider",
    redirect: EPageActions.EDIT
  });

  return (
    <AccessWrapperForPage resource={EAppResources.DISCOUNTS} action={EPageActions.EDIT}>
      <Edit saveButtonProps={saveButtonProps}
            actionButtons={true}
            pageHeaderProps={{
              className: "action-page-layout",
              extra: <>
                <ListButton
                  data-testid="edit-list-button"
                  resourceNameOrRouteName={"timetables"}
                />
                <SaveButton {...saveButtonProps} htmlType="submit"/>
              </>
            }}>
        <DiscountForm formProps={{
          ...formProps
        }}

        />
      </Edit>
    </AccessWrapperForPage>
  );
};
