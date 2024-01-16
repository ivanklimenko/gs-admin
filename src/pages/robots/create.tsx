import React  from "react";
import { IResourceComponentsProps, useTranslate } from "@pankod/refine-core";
import {
  Create, useForm, SaveButton
} from "@pankod/refine-antd";

import { IMarket } from "interfaces/markets";
import {RobotForm} from "../../components/robots/RobotForm";
import {EAppResources, EPageActions} from "interfaces/common";
import { AccessWrapperForPage } from "components/accessWrapper";


export const RobotCreate: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();

  const { saveButtonProps, formProps } = useForm<IMarket>({
    resource: "timetables",
    action: "create",
    dataProviderName: "customProvider",
    redirect: "show"
  });

  return (
    <AccessWrapperForPage resource={EAppResources.TIMETABLES} action={EPageActions.CREATE}>
      <Create saveButtonProps={saveButtonProps}
              actionButtons={false}
              pageHeaderProps={{
                className: "action-page-layout",
                extra: <SaveButton {...saveButtonProps} htmlType="submit"/>
              }}>
        <RobotForm formProps={{
          ...formProps,
          initialValues: {
            ...formProps.initialValues,

            // day1: [formProps.initialValues?.start1 ? dayjs(formProps.initialValues.start1, TIME_FORMAT) : null, formProps.initialValues?.end1 ? dayjs(formProps.initialValues.end1, TIME_FORMAT) : null],
            // day2: [formProps.initialValues?.start2 ? dayjs(formProps.initialValues.start2, TIME_FORMAT) : null, formProps.initialValues?.end2 ? dayjs(formProps.initialValues.end2, TIME_FORMAT) : null],
            // day3: [formProps.initialValues?.start3 ? dayjs(formProps.initialValues.start3, TIME_FORMAT) : null, formProps.initialValues?.end3 ? dayjs(formProps.initialValues.end3, TIME_FORMAT) : null],
            // day4: [formProps.initialValues?.start4 ? dayjs(formProps.initialValues.start4, TIME_FORMAT) : null, formProps.initialValues?.end4 ? dayjs(formProps.initialValues.end4, TIME_FORMAT) : null],
            // day5: [formProps.initialValues?.start5 ? dayjs(formProps.initialValues.start5, TIME_FORMAT) : null, formProps.initialValues?.end5 ? dayjs(formProps.initialValues.end5, TIME_FORMAT) : null],
            // day6: [formProps.initialValues?.start6 ? dayjs(formProps.initialValues.start6, TIME_FORMAT) : null, formProps.initialValues?.end6 ? dayjs(formProps.initialValues.end6, TIME_FORMAT) : null],
            // day7: [formProps.initialValues?.start7 ? dayjs(formProps.initialValues.start7, TIME_FORMAT) : null, formProps.initialValues?.end7 ? dayjs(formProps.initialValues.end7, TIME_FORMAT) : null],
          }
        }}

        />
      </Create>
    </AccessWrapperForPage>
  );
};
