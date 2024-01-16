import React from "react";
import {IResourceComponentsProps, usePermissions} from "@pankod/refine-core";
import {
  useForm, Show,
} from "@pankod/refine-antd";

import {EProductType, IProduct} from "interfaces/products";
import {ProductForm} from "components/products/ProductForm";
import {EUserRole} from "interfaces/users";
import {useProductInfo} from "../../hooks/products";
import {ProductBreadcrumbs} from "../../components/products/productBreadcrumb";
import {EAppResources, EPageActions} from "interfaces/common";
import { AccessWrapperForPage } from "components/accessWrapper";


export const ProductShow: React.FC<IResourceComponentsProps> = () => {

  const {data: permissions} = usePermissions<string>();

  const {formProps} = useForm<IProduct>({
    resource: "products",
    action: "edit",
    dataProviderName: "customProvider"
  });

  const {outletProps, marketProps, changeOutlet} = useProductInfo(formProps?.initialValues?.outletId, formProps?.initialValues?.categoryId);

  return (
    <AccessWrapperForPage resource={EAppResources.PRODUCTS} action={EPageActions.SHOW}>
      <Show canDelete={permissions?.includes(EUserRole.ADMIN)}
            pageHeaderProps={{
              className: "action-page-layout",
              breadcrumb: <ProductBreadcrumbs action={"show"} outlet={outletProps || null} market={marketProps || null}/>,
              title: formProps.initialValues?.title
            }}>
        <ProductForm readonlyMode={true}
                     outletProps={!outletProps ? null : {...outletProps, market: marketProps}}
                     changeOutlet={changeOutlet}
                     formProps={{
                       ...formProps,
                       initialValues: {
                         ...formProps.initialValues,
                         type: formProps.initialValues?.soldByWeight ? EProductType.WEIGHT : EProductType.PORTION,
                       }
                     }}/>
      </Show>
    </AccessWrapperForPage>
  )
};
