import React from "react";
import {IResourceComponentsProps, useTranslate} from "@pankod/refine-core";
import {Edit, ListButton, SaveButton, useForm,} from "@pankod/refine-antd";
import {EProductType, IProduct} from "interfaces/products";
import {ProductForm} from "../../components/products/ProductForm";
import {useProductInfo} from "../../hooks/products";
import {ProductBreadcrumbs} from "components/products/productBreadcrumb";
import {EAppResources, EPageActions} from "interfaces/common";
import { AccessWrapperForPage } from "components/accessWrapper";


export const ProductEdit: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();

  const { saveButtonProps, formProps } = useForm<IProduct>({
    resource: EAppResources.PRODUCTS,
    action: EPageActions.EDIT,
    dataProviderName: "customProvider",
    redirect: EPageActions.SHOW
  });

  const {outletProps, marketProps, changeOutlet} = useProductInfo(formProps?.initialValues?.outletId, formProps?.initialValues?.categoryId);

  return (
    <AccessWrapperForPage resource={EAppResources.PRODUCTS} action={EPageActions.EDIT}>
      <Edit saveButtonProps={saveButtonProps}
              actionButtons={false}
            pageHeaderProps={{
              className: "action-page-layout",
              breadcrumb: <ProductBreadcrumbs action={"edit"} outlet={outletProps || null} market={marketProps || null}/>,
              title: formProps.initialValues?.title,
              extra: <>
                <ListButton
                  data-testid="edit-list-button"
                  resourceNameOrRouteName={"products"}
                />
                <SaveButton {...saveButtonProps} htmlType="submit"/>
              </>
            }}>
        <ProductForm
          outletProps={!outletProps ? null : {...outletProps, market: marketProps}}
          changeOutlet={changeOutlet}
          formProps={{
            ...formProps,
            initialValues: {
              ...formProps.initialValues,
              tags: formProps.initialValues?.tags.map((t: any )=> ({...t, value: t.id, label: t.title})),
              type: formProps.initialValues?.soldByWeight ? EProductType.WEIGHT : EProductType.PORTION,
              weightOrVolume: formProps.initialValues?.weightOrVolume
            }
          }}/>
      </Edit>
    </AccessWrapperForPage>
  );
};

