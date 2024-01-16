import React  from "react";
import { IResourceComponentsProps, useTranslate } from "@pankod/refine-core";
import {
  Edit, ListButton, SaveButton,
  useForm,
} from "@pankod/refine-antd";

import "react-mde/lib/styles/css/react-mde-all.css";
import { IMarket } from "interfaces/markets";
import {TIME_FORMAT} from "../../common/constants";
import dayjs from "dayjs";
import {RobotForm} from "../../components/robots/RobotForm";
import {EAppResources, EPageActions} from "interfaces/common";
import { AccessWrapperForPage } from "components/accessWrapper";


export const RobotEdit: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();

  const { formProps, saveButtonProps } = useForm<IMarket>({
    resource: EAppResources.TIMETABLES,
    action: EPageActions.EDIT,
    dataProviderName: "customProvider",
    redirect: EPageActions.SHOW
  });

  return (
    <AccessWrapperForPage resource={EAppResources.TIMETABLES} action={EPageActions.EDIT}>
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
        <RobotForm formProps={{
          ...formProps,
          initialValues: {
            ...formProps.initialValues,

            ...([1, 2, 3, 4, 5, 6, 7]).reduce((obj: any, curr, i) => {
              return {
                ...obj,
                [`allTime${i + 1}`]: formProps.initialValues?.[`start${i + 1}`] === '00:00' && formProps.initialValues?.[`end${i + 1}`] === '00:00',
                [`disabled${i + 1}`]: !formProps.initialValues?.[`start${i + 1}`] && !formProps.initialValues?.[`end${i + 1}`],
                [`day${i + 1}`]: [formProps.initialValues?.[`start${i + 1}`] ? dayjs(formProps.initialValues[`start${i + 1}`], TIME_FORMAT) : null,
                  formProps.initialValues?.[`end${i + 1}`] ? dayjs(formProps.initialValues[`end${i + 1}`], TIME_FORMAT) : null],
              }
            }, {}),

            // day2: [formProps.initialValues?.start2 ? dayjs(formProps.initialValues.start2, TIME_FORMAT) : null, formProps.initialValues?.end2 ? dayjs(formProps.initialValues.end2, TIME_FORMAT) : null],
            // day3: [formProps.initialValues?.start3 ? dayjs(formProps.initialValues.start3, TIME_FORMAT) : null, formProps.initialValues?.end3 ? dayjs(formProps.initialValues.end3, TIME_FORMAT) : null],
            // day4: [formProps.initialValues?.start4 ? dayjs(formProps.initialValues.start4, TIME_FORMAT) : null, formProps.initialValues?.end4 ? dayjs(formProps.initialValues.end4, TIME_FORMAT) : null],
            // day5: [formProps.initialValues?.start5 ? dayjs(formProps.initialValues.start5, TIME_FORMAT) : null, formProps.initialValues?.end5 ? dayjs(formProps.initialValues.end5, TIME_FORMAT) : null],
            // day6: [formProps.initialValues?.start6 ? dayjs(formProps.initialValues.start6, TIME_FORMAT) : null, formProps.initialValues?.end6 ? dayjs(formProps.initialValues.end6, TIME_FORMAT) : null],
            // day7: [formProps.initialValues?.start7 ? dayjs(formProps.initialValues.start7, TIME_FORMAT) : null, formProps.initialValues?.end7 ? dayjs(formProps.initialValues.end7, TIME_FORMAT) : null],
          }
        }}

        />
      </Edit>
    </AccessWrapperForPage>
  );
};
