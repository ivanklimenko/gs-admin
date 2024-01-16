import React from "react";
import {
  IResourceComponentsProps,
  GetListResponse,
  CrudFilters,
  HttpError,
  useTranslate, useDelete
} from "@pankod/refine-core";
import {
  List,
  Table,
  useTable,
  Icons,
  Dropdown,
  Row,
  Col
} from "@pankod/refine-antd";

import "moment/locale/ru";

import {IDiscount, IDiscountFilterVariables} from "interfaces/discounts";
import {TableMenu} from "../../components/tableMenu/tableMenu";
import {ITextPage} from "@interfaces/textPages";
import {EAppResources, EPageActions} from "interfaces/common";
import { AccessWrapperForPage } from "components/accessWrapper";


export const TextPagesList: React.FC<
  IResourceComponentsProps<GetListResponse<IDiscount>>
> = ({ initialData }) => {

  const t = useTranslate();

  const { mutate: mutateDelete } = useDelete();

  const { tableProps, sorter, searchFormProps } = useTable<IDiscount, HttpError, IDiscountFilterVariables>({
    dataProviderName: "customProvider",
    resource: EAppResources.PAGES,
    hasPagination: true,
    initialPageSize: 10,
    queryOptions: {
      initialData,
    },
    onSearch: (params) => {
      const filters: CrudFilters = [];

      return filters;
    },
    syncWithLocation: false,
  });


  return (
    <AccessWrapperForPage resource={EAppResources.PAGES} action={EPageActions.LIST}>
      <Row gutter={[16, 16]}>
        <Col xl={24} xs={24}>
          <List>
            <Table rowKey="id" {...tableProps}>
              <Table.Column
                dataIndex="id"
                key="id"
                title="ID"
                render={(value) => value}
              />

              <Table.Column<ITextPage>
                dataIndex="title"
                key="title"
                title="Заголовок"
                render={(value) => value || '--'}
              />

              <Table.Column<ITextPage>
                dataIndex="slug"
                key="slug"
                title="Человекочитаемый URL"
                render={(value) => value || '--'}
              />

              <Table.Column<ITextPage>
                fixed="right"
                title={t("table.actions")}
                dataIndex="actions"
                key="actions"
                align="center"
                render={(_, record) => (
                  <Dropdown
                    overlay={<TableMenu record={record}
                                        showShowButton={true}
                                        showCloneButton={false}
                                        deleteItem={() => {
                                          mutateDelete({
                                            resource: "discounts",
                                            id: record.id,
                                            mutationMode: "undoable",
                                          });
                                        }}/>}
                    trigger={["click"]}
                  >
                    <Icons.MoreOutlined className={"table-dropdown-icon"}/>
                  </Dropdown>
                )}
              />

            </Table>
          </List>
        </Col>
      </Row>
    </AccessWrapperForPage>
  );
};

