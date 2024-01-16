import {Link, useSearchParams} from "react-router-dom";
import React, {useEffect, useState} from "react";

import {
  IResourceComponentsProps,
  GetListResponse,
  CrudFilters,
  useTranslate, useDelete, useOne, usePermissions
} from "@pankod/refine-core";
import {
  List,
  Table,
  Avatar,
  Menu,
  Icons,
  Dropdown,
  Select,
  Card,
  Input,
  Form,
  Button,
  FormProps,
  Row,
  Col, Image, useEditableTable, useForm
} from "@pankod/refine-antd";
import {ColumnsType} from "antd/es/table";
import {SortableHandle} from "react-sortable-hoc";
import {MenuOutlined} from "@ant-design/icons";

import {IMarket} from "interfaces/markets";
import {IOutlet} from "interfaces/outlets";
import {TableMenu} from "../../components/tableMenu/tableMenu";
import {SortableTable} from "../sortableTable";
import {useMarketsList} from "../../hooks/products";
import {EmptyContainer} from "../../components/notFound/NotFound";
import {FILTER_ACTIVE_OPTION, FILTER_ENABLED_OPTION} from "common/constants";
import moment from "moment";
import {CustomBooleanField} from "components/customBooleanField";
import {EAppResources, EPageActions} from "interfaces/common";
import {AccessWrapperForPage} from "components/accessWrapper";
import {EUserRole} from "interfaces/users";


const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);


export const OutletsList: React.FC<
  IResourceComponentsProps<GetListResponse<IOutlet>>
> = () => {
  const t = useTranslate();
  const { data: permissions } = usePermissions<string>();

  const { mutate: mutateDelete } = useDelete();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedMarketId, setSelectedMarketId] = useState(searchParams.get("market_id") || localStorage.getItem("market_id") || null);

  const [outlets, setOutlets] = useState<Array<IOutlet>>([]);

  const [filterMode, setFilterMode] = useState<boolean>(false)

  useEffect(() => {
    if (searchParams.get("market_id") !== selectedMarketId) {
      setSearchParams(!selectedMarketId ? {} : {market_id: `${selectedMarketId}`});
    }
    localStorage.setItem("market_id", !selectedMarketId ? '' : `${selectedMarketId}`);
  }, [selectedMarketId, searchParams])

  const {
    tableProps,
    searchFormProps} = useEditableTable<IOutlet>({
    hasPagination: true,
    initialPageSize: selectedMarketId ? 1000 : 20,
    initialSorter: [],
    initialFilter: !selectedMarketId ? [] : [{
      field: "marketId",
      operator: "eq",
      value: selectedMarketId,
    }],
    permanentFilter: !selectedMarketId ? [] : [{
      field: "marketId",
      operator: "eq",
      value: selectedMarketId,
    }],
    resource: "outlets",
    dataProviderName: "customProvider",
    onSearch: (params: any) => {
      const filters: CrudFilters = [];
      const { textSearch, isActive, isEnabled } = params;

      const searchMode = !(textSearch === undefined && isActive === undefined && isEnabled === undefined)

      setFilterMode(searchMode)

      filters.push({
        field: "searchMode",
        operator: "eq",
        value: searchMode
      });

      filters.push({
        field: "textSearch",
        operator: "eq",
        value: textSearch,
      });

      filters.push({
        field: "isActive",
        operator: "eq",
        value: isActive,
      });

      filters.push({
        field: "isEnabled",
        operator: "eq",
        value: isEnabled,
      });

      return filters;
    },
    syncWithLocation: false,
  });


  const { marketsSelectProps, setSearchMarketValue } = useMarketsList();
  const marketProps = useOne<IMarket>({
    resource: "markets",
    id: !selectedMarketId ? '' : `${selectedMarketId}`,
    dataProviderName: "customProvider",
  })

  const columns: ColumnsType<IOutlet> = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (value) => value
    },
    {
      title: 'Название',
      dataIndex: 'title',
      className: 'drag-visible',
      render: (value, record) => <div className={"preview-entity-title"}>
        {record?.imageBkgMobile && (<Avatar shape="square" className={"table-preview-image"} src={<Image src={record?.imageBkgMobile} />} />)}
        <Link to={`/outlets/show/${record.id}`} style={{marginLeft: record?.imageBkgMobile ? '12px' : 0}}>{value}</Link>
      </div>
    },
    {
      title: 'Договоры',
      dataIndex: 'contracts',
      render: (values) => !values?.length ? '--' : values?.map((v: {id: number, number: string}, i: number) => (
        <>{i !== 0 ? ', ' : ''} <Link to={`/contracts/show/${v.id}`} target={"_blank"}>№{v?.number}</Link></>
      ))
    },
    {
      title: 'Расположение',
      dataIndex: 'location',
      render: (value, record) => !record?.marketId ? (
        value?.coordinates && (
          <a href={`https://yandex.ru/maps/?pt=${value.coordinates[1]},${value.coordinates[0]}&z=15&l=map`} target={"_blank"}>
            {value.coordinates[0]}, {value.coordinates[1]}</a>
        )
      ) : (
        <Link to={`/markets/show/${record?.marketId || ''}`}>{record?.market?.title || 'Локация (пока без тайтла)'}</Link>
      )
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
      title: 'Доступен по времени',
      dataIndex: 'workHoursStart',
      render: (value, record) => {
        const now = moment()
        const nowDate = now.format('YYYY-MM-DD')
        const start = moment( `${nowDate}T${record?.workHoursStart}`)
        const end = moment( `${nowDate}T${record?.workHoursEnd}`)
        const isWorked = now >= start && now <= end

        return (<Icons.ClockCircleFilled style={{color: isWorked ? '#67be23' : '#fa541c'}}/>)
      }
    },
    {
      title: 'Действия',
      fixed: 'right',
      dataIndex: 'actions',
      key: 'actions',
      align: 'center',
      render: (_text, record) => {
        return (
          <Dropdown
            overlay={<TableMenu
              record={record}
              showLinkButton={true}
              deleteItem={() => {
                mutateDelete({
                  resource: "outlets",
                  id: record.id,
                  mutationMode: "undoable",
                });
              }}
              linkButton={(
                <Menu.Item key="link" icon={<Icons.LinkOutlined className={"menu-item-icon"}/>}
                           className={"table-menu-item"}>
                  <Link to={`/products?outlet_id=${record.id}`}>Перейти к товарам</Link>
                </Menu.Item>
              )}
            />}
            trigger={["click"]}
          >
            <Icons.MoreOutlined className={"table-dropdown-icon"}/>
          </Dropdown>
        );
      }
    },
  ];

  const { onFinish } = useForm({
    resource: "outlets",
    action: "edit",
    dataProviderName: "productsProvider",
    redirect: false
  });

  const handleOutletSort = (sortedProducts: Array<IOutlet>) => {
    onFinish(sortedProducts.map(p => `${p.id}`))
      .then(() => {
        //console.log('handleOutletSort', sortedProducts)
        setOutlets(sortedProducts)
      })
      .catch(() => {
        //setSortableCategoryId(null);
      })
  }

  return (
    <AccessWrapperForPage resource={EAppResources.OUTLETS} action={EPageActions.LIST}>
      <Row justify={"center"} className={"card-block-with-margin"}>
        <Select
          showSearch
          style={{width: '300px', marginBottom: 16}}
          allowClear
          notFoundContent={null}
          defaultActiveFirstOption={false}
          placeholder={"Поиск по маркету"}
          showArrow={true}
          value={!selectedMarketId ? null : {value: selectedMarketId, label: marketProps?.data?.data?.title}}
          filterOption={false}
          onSelect={(value: any) => {
            setSelectedMarketId(value)
          }}
          onClear={() => {
            setSelectedMarketId(null)
          }}
          onSearch={(value) => {
            setSearchMarketValue(value)
          }}
        >
          { (marketProps?.data?.data?.id && !marketsSelectProps?.data?.data?.length) ? (
            [marketProps?.data?.data].map(d => <Select.Option key={d?.id} value={d?.id}>{d.title}</Select.Option>)
          ) : (
            marketsSelectProps?.data?.data?.map(d => <Select.Option key={d.id} value={d.id}>
              {d.title}</Select.Option>)
          )}
        </Select>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xl={6} lg={24} xs={24}>
          <Card title={t("outlets.filter.title")}>
            <Filter formProps={searchFormProps} />
          </Card>
        </Col>
        <Col xl={18} xs={24}>
          <List canCreate={permissions?.includes(EUserRole.ADMIN) || permissions?.includes(EUserRole.CONTENT_MANAGER)}>
            {!tableProps?.dataSource?.length ? (
              <EmptyContainer/>
            ) : (
              <>
                {(!selectedMarketId || filterMode) ? (
                  <Table rowKey="id" {...tableProps}
                         dataSource={outlets?.length ? outlets : tableProps.dataSource}
                         columns={columns}/>
                ) : (
                  //@ts-ignore
                  <SortableTable items={outlets?.length ? outlets : tableProps.dataSource}
                                 columns={[ {
                                   title: '',
                                   dataIndex: 'sort',
                                   sortOrder: "ascend",
                                   render: () => <DragHandle />,
                                 }, ...columns]}
                                 onChange={handleOutletSort}
                                 loading={false}/>
                )}
              </>
            )}

          </List>
        </Col>
      </Row>

    </AccessWrapperForPage>
  );
};


// const TableWithoutSort: React.FC<{ columns: Array<any>}> = () => {
//   return (
//
//   )
// }

const Filter: React.FC<{ formProps: FormProps }> = (props) => {
  const t = useTranslate();

  return (
    <Form layout="vertical" {...props.formProps}>
      <Row gutter={[10, 0]} align="bottom">
        <Col xs={24} xl={24} md={8}>
          <Form.Item label={t("outlets.filter.search.label")} name="textSearch">
            <Input
              allowClear
              placeholder={t("outlets.filter.search.placeholder")}
              prefix={<Icons.SearchOutlined />}
            />
          </Form.Item>
        </Col>
        {/*<Col xs={24} xl={24} md={8}>*/}
        {/*  <Form.Item*/}
        {/*    label={t("outlets.filter.locationType.label")}*/}
        {/*    name="type"*/}
        {/*  >*/}
        {/*    <Select*/}
        {/*      allowClear*/}
        {/*      placeholder={t("outlets.filter.locationType.placeholder")}*/}
        {/*      options={[*/}
        {/*        {*/}
        {/*          label: t("outlets.filter.locationType.market"),*/}
        {/*          value: "food",*/}
        {/*        },*/}
        {/*        {*/}
        {/*          label: t("outlets.filter.locationType.network"),*/}
        {/*          value: "market",*/}
        {/*        },*/}
        {/*        {*/}
        {/*          label: t("outlets.filter.locationType.point"),*/}
        {/*          value: "cafe",*/}
        {/*        },*/}
        {/*      ]}*/}
        {/*    />*/}
        {/*  </Form.Item>*/}
        {/*</Col>*/}
        <Col xs={24} xl={24} md={8}>
          <Form.Item
            label={t("outlets.filter.isActive.label")}
            name="isActive"
            valuePropName="checked"
          >
            <Select
              allowClear
              placeholder={t("outlets.filter.isActive.placeholder")}
              options={FILTER_ACTIVE_OPTION}
            />
          </Form.Item>
        </Col>

        <Col xs={24} xl={24} md={8}>
          <Form.Item
            label={t("outlets.filter.isEnabled.label")}
            name="isEnabled"
            valuePropName="checked"
          >
            <Select
              allowClear
              placeholder={t("outlets.filter.isEnabled.placeholder")}
              options={FILTER_ENABLED_OPTION}
            />
          </Form.Item>
        </Col>

        <Col xs={24} xl={24} md={8}>
          <div style={{display: 'flex'}}>
            <Form.Item style={{flex: '1', marginRight: '12px'}}>
              <Button
                className={"width-100-pr"}
                htmlType="submit"
                type="primary"
              >
                {t("outlets.filter.submit")}
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                className={"width-100-pr"}
                htmlType="button"
                onClick={() => {
                  props.formProps?.form?.resetFields()
                  props.formProps?.form?.submit()
                }}
              >
                <Icons.CloseOutlined />
              </Button>
            </Form.Item>
          </div>

        </Col>
      </Row>
    </Form>
  );
};

