import React, { useState } from "react";
import { IResourceComponentsProps, useTranslate } from "@pankod/refine-core";
import {
  Create,
  useForm, SaveButton,
} from "@pankod/refine-antd";

import {EProductType, IProduct} from "interfaces/products";
import {ProductForm} from "components/products/ProductForm";
import {useParams} from "react-router-dom";
import {useProductInfo} from "../../hooks/products";
import {ProductBreadcrumbs} from "../../components/products/productBreadcrumb";
import {EAppResources, EPageActions} from "interfaces/common";
import { AccessWrapperForPage } from "components/accessWrapper";


export const ProductCreate: React.FC<IResourceComponentsProps> = () => {
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");
  const t = useTranslate();
  const routeParams = useParams();

  const { saveButtonProps, formProps } = useForm<IProduct>({
    resource: EAppResources.PRODUCTS,
    action: routeParams?.id ? EPageActions.CLONE : EPageActions.CREATE,
    dataProviderName: "customProvider",
    redirect: EPageActions.SHOW
  });

  const {outletProps, marketProps, changeOutlet} = useProductInfo(!localStorage.getItem("outlet_id") ? null : JSON.parse(localStorage.getItem("outlet_id") || ''), formProps?.initialValues?.categoryId);

  return (
    <AccessWrapperForPage resource={EAppResources.PRODUCTS} action={routeParams?.id ? EPageActions.CLONE : EPageActions.CREATE}>
      <Create saveButtonProps={saveButtonProps}
              title={!routeParams?.id ? t('products.titles.create') : t('products.titles.clone')}
              actionButtons={false}
              pageHeaderProps={!routeParams?.id ? {
                className: "action-page-layout",
                extra: <SaveButton {...saveButtonProps} htmlType="submit"/>
              } : {
                className: "action-page-layout",
                breadcrumb: <ProductBreadcrumbs action={"clone"} outlet={outletProps || null} market={marketProps || null}/>,
                extra: <SaveButton {...saveButtonProps} htmlType="submit"/>
              }}>
        <ProductForm
          outletProps={!outletProps ? null : {...outletProps, market: marketProps}}
          changeOutlet={changeOutlet}
          formProps={{
            ...formProps,
            initialValues: routeParams?.id ? {
              ...formProps.initialValues,
              id: null,
              sourceId: formProps?.initialValues?.id,
              copy: true,
              tags: formProps.initialValues?.tags.map((t: any )=> ({...t, value: t.id, label: t.title})),
              type: formProps.initialValues?.soldByWeight ? EProductType.WEIGHT : EProductType.PORTION,
              weightOrVolume: +formProps.initialValues?.weightOrVolume
            } : {
                title: "",
                type: EProductType.PORTION,
                isActive: false,
                isEnabled: false,
                outletId: !localStorage.getItem("outlet_id") ? null : JSON.parse(localStorage.getItem("outlet_id") || ''),
                image: null,
            }
        }}/>
      </Create>
    </AccessWrapperForPage>
  );
};
