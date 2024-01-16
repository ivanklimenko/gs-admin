import {CanAccess, usePermissions, useTranslate} from "@pankod/refine-core";

import {ErrorComponent, Tag} from "@pankod/refine-antd";
import React from "react";
import {EAppResources, EPageActions} from "@interfaces/common";
import {EmptyContainer} from "../notFound/NotFound";


export const AccessWrapperForPage: React.FC<{
    resource: EAppResources,
    action: EPageActions
}> = ({ children, resource, action }) => {
    const t = useTranslate();
    const { data: permissions } = usePermissions<string>();

    //t(`enum.publish.${status}`)
    return (
      <CanAccess resource={resource} action={action} params={{userRoles: permissions}} fallback={<ErrorComponent/>}>
          {children}
      </CanAccess>
    )
};
