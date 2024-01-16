import React  from "react";
import { IResourceComponentsProps, useTranslate } from "@pankod/refine-core";
import {
  Edit, ListButton, SaveButton, Typography, useForm
} from "@pankod/refine-antd";

import "react-mde/lib/styles/css/react-mde-all.css";
import { IMarket } from "interfaces/markets";
import { NetworkForm } from "components/networks/NetworkForm";
import {Link} from "react-router-dom";
import {EAppResources, EPageActions} from "interfaces/common";
import { AccessWrapperForPage } from "components/accessWrapper";


export const NetworkEdit: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();

  const { formProps, saveButtonProps } = useForm<IMarket>({
    resource: EAppResources.NETWORKS,
    action: EPageActions.EDIT,
    dataProviderName: "customProvider"
  });

  return (
    <AccessWrapperForPage resource={EAppResources.NETWORKS} action={EPageActions.EDIT}>
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
        <NetworkForm
          formProps={{
            ...formProps,
            initialValues: {
              ...formProps.initialValues,
                "isNetwork": true
            }
          }}
        />
      </Edit>
    </AccessWrapperForPage>
  );
};
