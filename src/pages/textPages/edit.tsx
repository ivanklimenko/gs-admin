import {
  Edit, useForm, ListButton, SaveButton,
} from "@pankod/refine-antd";

import "moment/locale/ru";
import React from "react";
import {TextPageForm} from "../../components/textPages/TextPageForm";
import {ITextPage} from "interfaces/textPages";
import {EAppResources, EPageActions} from "interfaces/common";
import { AccessWrapperForPage } from "components/accessWrapper";


export const TextPageEdit: React.FC = () => {

  const { formProps, saveButtonProps } = useForm<ITextPage>({
    resource: EAppResources.PAGES,
    action: EPageActions.EDIT,
    dataProviderName: "customProvider",
    //redirect: "edit"
  });

  return (
    <AccessWrapperForPage resource={EAppResources.PAGES} action={EPageActions.EDIT}>
      <Edit saveButtonProps={saveButtonProps}
            actionButtons={true}
            pageHeaderProps={{
              className: "action-page-layout",
              extra: <>
                <ListButton
                  data-testid="edit-list-button"
                  resourceNameOrRouteName={"pages"}
                />
                <SaveButton {...saveButtonProps} htmlType="submit"/>
              </>
            }}>
        <TextPageForm formProps={{
          ...formProps
        }}/>
      </Edit>
    </AccessWrapperForPage>
  );
};
