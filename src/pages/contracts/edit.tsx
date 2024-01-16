import React  from "react";
import { IResourceComponentsProps, useTranslate } from "@pankod/refine-core";
import {
  useForm, SaveButton, Edit, ConfigProvider, Typography
} from "@pankod/refine-antd";

import {IContract} from "interfaces/contracts";
import {ContractForm} from "components/contracts/ContractForm";
import {DATE_FORMAT} from "../../common/constants";
import moment from "moment";
import ru_RU from 'antd/lib/locale/ru_RU';
import 'moment/locale/ru';
import {Link} from "react-router-dom";
import {EAppResources, EPageActions} from "interfaces/common";
import {AccessWrapperForPage} from "../../components/accessWrapper";


export const ContractEdit: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();

  const { saveButtonProps, formProps } = useForm<IContract>({
    resource: EAppResources.CONTRACTS,
    action: EPageActions.EDIT,
    dataProviderName: "customProvider",
    redirect: EPageActions.SHOW
  });

  return (
    <AccessWrapperForPage resource={EAppResources.CONTRACTS} action={EPageActions.EDIT}>
      <Edit saveButtonProps={saveButtonProps}
              actionButtons={false}
              pageHeaderProps={{
                className: "action-page-layout",
                extra: <SaveButton {...saveButtonProps} htmlType="submit"/>,
                title: <div className={"flex-column"}>
                  <Typography.Title level={3} style={{margin: 0}}>{`${formProps.initialValues?.person} №${formProps.initialValues?.number}`}</Typography.Title>
                  {formProps.initialValues?.outletId && (
                    <Link style={{fontSize: '13px', fontWeight: '300', lineHeight: '20px'}} target={'_blank'}
                          to={`/outlets/show/${formProps.initialValues?.outletId}`}>Перейти к точке продаж</Link>
                  )}
                </div>,
              }}>
        <ConfigProvider locale={ru_RU}>
          <ContractForm
            formProps={{
              ...formProps,
              initialValues: {
                ...formProps.initialValues,
                dates: [!formProps.initialValues?.signedAt ? null : moment(formProps.initialValues?.signedAt, DATE_FORMAT),
                  !formProps.initialValues?.expiresAt ? null : moment(formProps.initialValues?.expiresAt, DATE_FORMAT)],
                signedAt: !formProps.initialValues?.signedAt ? null : moment(formProps.initialValues?.signedAt, DATE_FORMAT),
                expiresAt: !formProps.initialValues?.expiresAt ? null : moment(formProps.initialValues?.expiresAt, DATE_FORMAT),
              }
            }}/>
        </ConfigProvider>
      </Edit>
    </AccessWrapperForPage>
  );
};
