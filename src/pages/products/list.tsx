import {
  IResourceComponentsProps,
  GetListResponse,
  HttpError,
  useTranslate, useList, useDelete
} from "@pankod/refine-core";
import {
  List,
  Avatar,
  Image,
  Icons,
  Dropdown,
  Select,
  BooleanField,
  Row,
  Col, Collapse, useForm, Typography, Modal, Input,
} from "@pankod/refine-antd";

import React, {useEffect, useMemo, useState} from "react";
import {Link, useSearchParams} from "react-router-dom";

import {IProduct, IProductCategory} from "interfaces/products";
import debounce from "lodash.debounce";
import {TableMenu} from "../../components/tableMenu/tableMenu";
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  SortEnd
} from "react-sortable-hoc";
import {MenuOutlined} from "@ant-design/icons";
import {ColumnsType} from "antd/es/table";
import {arrayMoveImmutable} from "array-move";
import {EmptyContainer} from "../../components/notFound/NotFound";
import {useOutletsList, useProductInfo} from "../../hooks/products";
import {SortableTable} from "../sortableTable";
import {CustomBooleanField} from "../../components/customBooleanField";
import {EAppResources, EPageActions} from "interfaces/common";
import { AccessWrapperForPage } from "components/accessWrapper";

const { confirm } = Modal;


export const ProductList: React.FC<
  IResourceComponentsProps<GetListResponse<IProduct>>
> = () => {
  const t = useTranslate();

  const [searchParams, setSearchParams] = useSearchParams();
  const [selectOutletId, setSelectOutletId] = useState<number | string | null>(searchParams.get("outlet_id") || localStorage.getItem("outlet_id") || '');

  const [categoriesWithProducts, setCategories] = useState<Array<IProductCategory>>([]);
  const [searchValue, setSearchValue] = useState<string>('')
  const { outletsSelectProps, setSearchOutletValue } = useOutletsList();


  useEffect(() => {
    if (selectOutletId) {
      if (searchParams.get("outlet_id") !== selectOutletId) {
        setSearchParams({outlet_id: `${selectOutletId}`});
      }
      localStorage.setItem("outlet_id", `${selectOutletId}`);
    }
  }, [selectOutletId, searchParams])


  const {outletProps: selectOutlet, marketProps, changeOutlet} = useProductInfo(selectOutletId, null);

  const { data } = useList<IProductCategory, HttpError>({
    config: {
      filters: [{
        field: "outletId",
        operator: "eq",
        value: selectOutletId,
      }]
    },
    resource: EAppResources.PRODUCTS,
    dataProviderName: "productsProvider"
  });

  // useEffect(() => {
  //   if (data?.data) {
  //     setCategories(data?.data.map((c, i) => ({...c, sort: i})))
  //   }
  // }, [data])

  useEffect(() => {
    if (searchValue && data?.data) {
      const lowerValue = searchValue.toLowerCase()
      setCategories(data?.data.filter((c) => c.products.some(p => (p.title.toLowerCase()).includes(lowerValue)))
        .map((cat) => ({
          ...cat,
          products: cat.products?.filter((p) => (p.title.toLowerCase()).includes(lowerValue))
        })))
    } else {
      if (data?.data) {
        setCategories(data?.data.map((c, i) => ({...c, sort: i})))
      }
    }
  }, [data, searchValue])

  const search = (e: any) => {
    setSearchValue(e.target.value)
  }

  const debouncedSearch = useMemo(
    () => debounce(search, 300)
    , [])

  return (
    <AccessWrapperForPage resource={EAppResources.PRODUCTS} action={EPageActions.LIST}>
      <Row justify={"center"} className={"card-block-with-margin"}>
        <Select
          showSearch
          style={{width: '300px', marginBottom: 16}}
          notFoundContent={null}
          defaultActiveFirstOption={false}
          showArrow={true}
          value={{value: selectOutletId, label: !selectOutlet || !marketProps ? '' : `${selectOutlet?.title} (${marketProps?.title})`}}
          filterOption={false}
          onSelect={(value: any) => {
            setSelectOutletId(value)
            changeOutlet(value)
          }}
          onSearch={(value) => {
            setSearchOutletValue(value)
            // if (outletsSelectProps.onSearch) {
            //   outletsSelectProps.onSearch(value);
            // }
          }}
        >
          { (selectOutlet?.id && !outletsSelectProps?.data?.data?.length) ? (
            [selectOutlet].map(d => <Select.Option key={d?.id} value={d?.id}>{`${d.title} (${marketProps?.title})`}</Select.Option>)
          ) : (
            outletsSelectProps?.data?.data?.map(d => <Select.Option key={d.id} value={d.id}>
              {`${d.title} (${d?.market?.title})`}</Select.Option>)
          )}
        </Select>
      </Row>
      <Row gutter={[16, 16]}>
        <Col xl={24} xs={24}>
          <Input.Search onChange={debouncedSearch} allowClear style={{width: '300px'}} placeholder={"Введите название продукта"}/>
        </Col>
        <Col xl={24} xs={24}>
          <List>
            {!categoriesWithProducts?.length ? (
              <EmptyContainer/>
            ) : (
              <CategoryCollapse categories={categoriesWithProducts}
                                searchMode={!!searchValue}
                                onChangeAll={(values: any) => setCategories(values)}
                                onChange={(values: any, id: number) =>
                                  setCategories(categories => categories.map(c => (c.id !== id ? c : {...c, products: values})))}/>

            )}
          </List>
        </Col>
      </Row>
    </AccessWrapperForPage>
  );
};


const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);

const SortableCategoryItem = SortableElement((props: React.HTMLAttributes<HTMLTableRowElement> & {
  category: IProductCategory,
  formLoading?: boolean,
  searchMode: boolean,
  sortableCategoryId: number | null,
  handleProductSort: any
}) => (
  <Row gutter={[0, 12]} className={"card-block-with-margin"} {...props}>
    <Row gutter={[0, 16]} align={"middle"} className={"width-100-pr"}>
      {!props.searchMode && <DragHandle/>}
      <Typography.Text strong={true} style={{flex: 1, fontSize: 14, marginLeft: 12}}>{props?.category.title}</Typography.Text>
    </Row>

    {!props.searchMode ? (
      <Collapse defaultActiveKey={[]} collapsible={"header"} className={"width-100-pr"}>
        <Collapse.Panel header={`Продукты (${props?.category.products.length})`}
                        disabled={!props?.category.products.length} key={props?.category.id}>
          <Row gutter={[24, 12]} className={"row-with-margin-12"}>
            <ProductsTable products={props?.category.products}
                           searchMode={props.searchMode}
                           loading={!!props?.formLoading && props?.sortableCategoryId === props?.category.id}
                           onChange={(values: any) => {
                             props?.handleProductSort(values, props?.category.id)
                           }}/>
          </Row>
        </Collapse.Panel>
      </Collapse>
    ) : (
      <Collapse activeKey={[props?.category.id]} collapsible={"header"} className={"width-100-pr"}>
        <Collapse.Panel header={`Продукты (${props?.category.products.length})`}
                        disabled={!props?.category.products.length} key={props?.category.id}>
          <Row gutter={[24, 12]} className={"row-with-margin-12"}>
            <ProductsTable products={props?.category.products}
                           searchMode={props.searchMode}
                           loading={!!props?.formLoading && props?.sortableCategoryId === props?.category.id}
                           onChange={(values: any) => {
                             props?.handleProductSort(values, props?.category.id)
                           }}/>
          </Row>
        </Collapse.Panel>
      </Collapse>
    )}

  </Row>
));


const SortableCategoryBody = SortableContainer((props: React.HTMLAttributes<HTMLTableSectionElement> & {
  categories: Array<IProductCategory>,
  formLoading: boolean,
  searchMode: boolean,
  sortableCategoryId: number | null,
  handleProductSort: any
}) => (
  <span {...props}>
    {props.categories?.map((category) => (
      <SortableCategoryItem category={category}
                            searchMode={props.searchMode}
                            index={category.sort}
                            formLoading={props.formLoading}
                            sortableCategoryId={props.sortableCategoryId}
                            handleProductSort={props.handleProductSort}
      />
    ))}
  </span>
));


const CategoryCollapse: React.FC<{categories: Array<IProductCategory>, searchMode: boolean,
  onChange: any, onChangeAll: any}>  = ({ categories, searchMode, onChange, onChangeAll }) => {

  const [sortableCategoryId, setSortableCategoryId] = useState<number | null>(null)
  const { onFinish, formLoading } = useForm({
    resource: "products",
    action: "edit",
    dataProviderName: "productsProvider",
    redirect: false
  });

  const { onFinish: onCategoryFinish } = useForm({
    resource: "categories",
    action: "edit",
    dataProviderName: "productsProvider",
    redirect: false
  });


  const handleProductSort = (sortedProducts: Array<IProduct>, categoryId: number) => {
    setSortableCategoryId(categoryId);
    onFinish(sortedProducts.map(p => `${p.id}`))
      .then(() => {
        setSortableCategoryId(null);
        onChange(sortedProducts, categoryId)
      })
      .catch(() => {
        setSortableCategoryId(null);
      })
  }

  const handleCategoriesSort = (sortedCategories: Array<IProductCategory>) => {
    onCategoryFinish(sortedCategories.map(p => `${p.id}`))
      .then(() => {
        onChangeAll(sortedCategories)
      })
      .catch(() => {

      })
  }

  const showConfirm = (newData: Array<IProductCategory>) => {
    confirm({
      title: 'Вы точно хотите изменить порядок категорий в точке продаж?',
      icon: <Icons.ExclamationCircleOutlined />,
      content: '',
      okText: 'Да, подтверждаю',
      okType: 'danger',
      cancelText: 'Нет',
      onOk() {
        handleCategoriesSort(newData.map((o, i) => ({...o, sort: i + 1})))
      },
      onCancel() {
        //console.log('Cancel');
      },
    });
  };

  return (
    <>
      <SortableCategoryBody
        useDragHandle={true}
        onClick={(e) => e.stopPropagation()}
        onSortEnd={({ oldIndex, newIndex }: SortEnd, event)=> {
          event.stopPropagation();
          if (oldIndex !== newIndex) {
            const newData = arrayMoveImmutable(categories.slice(), oldIndex, newIndex).filter(
              (el: IProductCategory) => !!el,
            );
            showConfirm(newData)
          }
        }}
        searchMode={searchMode}
        categories={categories}
        formLoading={formLoading}
        sortableCategoryId={sortableCategoryId}
        handleProductSort={handleProductSort}/>
    </>
  )
}


export const ProductsTable: React.FC<{
  products: Array<IProduct>,
  searchMode: boolean,
  onChange?: any,
  loading: boolean}> = ({products, searchMode, onChange, loading}) => {
  const t = useTranslate();

  const { mutate: mutateDelete } = useDelete();

  const columns: ColumnsType<IProduct> = [
    {
      title: '',
      dataIndex: 'sort',
      width: 30,
      className: 'drag-visible',
      sortOrder: "ascend",
      render: () => <DragHandle />,
    },
    {
      title: 'ID',
      dataIndex: 'id',
      width: "1px",
      className: 'drag-visible',
      render: (value) => value
    },
    {
      title: 'Название',
      dataIndex: 'title',
      className: 'drag-visible',
      render: (value, record) => <div className={"preview-entity-title"}>
        {/*// @ts-ignore*/}
        {record?.image && (<Avatar shape="square" className={"table-preview-image"} src={<Image src={record?.image} />} />)}
        <Link to={`/products/show/${record.id}`} style={{marginLeft: record?.image ? '12px' : 0}}>{value}</Link>
      </div>
    },
    {
      title: 'Цена',
      dataIndex: 'price',
      render: (value) => value
    },
    {
      title: 'Цена для Яндекса',
      dataIndex: 'priceYandex',
      render: (value) => value || '--'
    },
    {
      title: 'Вес',
      dataIndex: 'measure',
      render: (value) => value || '--'
    },
    {
      title: 'Активность',
      dataIndex: 'isActive',
      render: (value) => <CustomBooleanField value={value} />
    },
    {
      title: 'Доступен для заказов',
      dataIndex: 'isEnabled',
      render: (value) => <CustomBooleanField value={value} />
    },
    {
      title: 'Действия',
      fixed: "right",
      dataIndex: "actions",
      key: "actions",
      align: "center",
      render: (_text, record) => {
        return (
          <Dropdown
            overlay={<TableMenu
              record={record}
              deleteItem={() => {
                mutateDelete({
                  resource: "products",
                  id: record.id,
                  mutationMode: "undoable",
                });
              }}
            />}
            trigger={["click"]}
          >
            <Icons.MoreOutlined className={"table-dropdown-icon"}/>
          </Dropdown>
        );
      }

    },
  ];

  return (
    <SortableTable items={products} columns={columns} searchMode={searchMode} loading={loading} onChange={onChange} />
  )
}