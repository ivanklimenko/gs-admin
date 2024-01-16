import {HttpError, Refine} from "@pankod/refine-core";
import {ErrorComponent, Icons, notificationProvider, ReadyPage,} from "@pankod/refine-antd";
import dataProvider from "@pankod/refine-simple-rest";
import routerProvider from "@pankod/refine-react-router-v6";
import BrowserRouterComponent from "@pankod/refine-react-router-v6";
import {useTranslation} from "react-i18next";
import "styles/antd.less";
import {Footer, Header, Layout, OffLayoutArea, Sider, Title,} from "components/layout";
import {authProvider} from "./authProvider";
import {MarketCreate, MarketEdit, MarketList, MarketShow} from "pages/markets";
import {LoginPage} from "pages/login";
import {UserList} from "./pages/users";
import {
  AutocompleteServer,
  CategoriesServer,
  CustomServer,
  OrdersServer,
  OutletsServer,
  ProductsServer,
  TimetablesServer
} from "./customProviders";
import {OutletsList} from "./pages/outlets/list";
import {OutletsCreate} from "./pages/outlets/create";
import {settings} from "common/settings";
import {OutletEdit} from "./pages/outlets/edit";
import {NetworkCreate, NetworkEdit, NetworkList, NetworkShow} from "./pages/networks";
import {ProductCreate, ProductList, ProductShow} from "./pages/products";
import {OutletShow} from "./pages/outlets/show";
import {ContractCreate, ContractEdit, ContractList, ContractShow} from "./pages/contracts";
import {CategoryList} from "./pages/tags";
import {RobotCreate, RobotEdit, RobotList, RobotShow} from "./pages/robots";
import {ProductEdit} from "./pages/products/edit";
import {DiscountList} from "./pages/discounts";
import {OrderList} from "./pages/orders";
import {OrderShow} from "./pages/orders/show";
import {DiscountCreate} from "./pages/discounts/create";
import {DiscountEdit} from "./pages/discounts/edit";
import {DiscountShow} from "./pages/discounts/show";
import {TextPagesList} from "./pages/textPages";
import {TextPageCreate} from "./pages/textPages/create";
import {TextPageEdit} from "./pages/textPages/edit";
import {TextPageShow} from "./pages/textPages/show";
import axios from "axios";
import Cookies from "js-cookie";
import {EUserRole} from "interfaces/users";
import {EAppResources, EAppResourcesForCorner, EPageActions} from "interfaces/common";
import DashboardPage from "./pages/dashboard/dashboard";

function App() {
  const { t, i18n } = useTranslation();

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  const axiosInstance = axios.create({
    headers: {
      'Authorization': `Bearer ${Cookies.get(settings.auth.token)}`
    }
  });

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      let key = Object.keys(error.response?.data)[0] || ''

      if (key === 'state') {
        key = error.response?.data[key] || ''
      }

      const text = {
        email: 'Email невалидный',
        username: error.response?.data?.username === 'Username must be unique' ? 'Логин должен быть уникальным' : 'В поле Логин содержится ошибка',
        inn: 'Неверный формат ИНН',
        phone: 'Неверный формат номера телефона',
        contract_dates_overlaps: 'Прикрепляемые договоры пересекаются по датам'
      }[key] || (error.response?.status === 400 ? 'Проверьте отправляемые данные, возможно в них содержится ошибка' : 'Непредвиденная ошибка')

      const customError: HttpError = {
        ...error,
        message: text,
        statusCode: error.response?.status,
      };

      return Promise.reject(customError);
    },
  );


  return (
    <Refine
      notificationProvider={notificationProvider}
      ReadyPage={ReadyPage}
      syncWithLocation={true}
      catchAll={<ErrorComponent />}
      routerProvider={routerProvider}
      dataProvider={{
        default: dataProvider(settings.api.url, axiosInstance),
        customProvider: CustomServer(settings.api.url, axiosInstance),
        autocompleteProvider: AutocompleteServer(settings.api.url, axiosInstance),
        categoriesProvider: CategoriesServer(settings.api.url, axiosInstance),
        productsProvider: ProductsServer(settings.api.url, axiosInstance),
        ordersProvider: OrdersServer(settings.api.url, axiosInstance),
        outletsProvider: OutletsServer(settings.api.url, axiosInstance),
        timetablesProvider: TimetablesServer(settings.api.url, axiosInstance),
      }}
      authProvider={authProvider}
      LoginPage={LoginPage}
      accessControlProvider={{
        can: async ({ resource, action, params }) => {
          if (params?.userRoles?.includes(EUserRole.ADMIN) || params?.userRoles?.includes(EUserRole.CONTENT_MANAGER)) {
            return Promise.resolve({ can: true });
          }

          if (params?.userRoles?.includes(EUserRole.RUNNER) && (resource !== EAppResources.MARKETS) && (action !== EPageActions.LIST)) {
            return Promise.resolve({
              can: false,
              reason: "Unauthorized",
            });
          }

          if (params?.userRoles?.includes(EUserRole.CORNER)) {
            if (Object.values<string>(EAppResourcesForCorner).includes(resource)) {
              if ((resource === EAppResources.MARKETS || resource === EAppResources.NETWORKS || resource === EAppResources.USERS || resource === EAppResources.DIRECTORIES)) {
                return Promise.resolve({
                  can: false,
                  reason: "Unauthorized",
                });
              }

              if (resource === EAppResources.OUTLETS && (action === EPageActions.CREATE || action === EPageActions.CLONE)) {
                return Promise.resolve({
                  can: false,
                  reason: "Unauthorized",
                });
              }
              return Promise.resolve({ can: true });
            } else {
              return Promise.resolve({
                can: false,
                reason: "Unauthorized",
              });
            }
          }

          if (params?.userRoles?.includes(EUserRole.USER)) {
            return Promise.resolve({
              can: false,
              reason: "Unauthorized",
            });
          }

          return Promise.resolve({ can: true });
        },
      }}
      DashboardPage={DashboardPage}
      resources={[
        {
          name: EAppResources.MARKETS,
          list: MarketList,
          edit: MarketEdit,
          create: MarketCreate,
          show: MarketShow,
          icon: <Icons.ShopOutlined />,
        },
        {
          name: EAppResources.NETWORKS,
          list: NetworkList,
          edit: NetworkEdit,
          create: NetworkCreate,
          show: NetworkShow,
          icon: <Icons.PartitionOutlined />,
        },
        {
          name: EAppResources.USERS,
          list: UserList,
          icon: <Icons.UserOutlined />,
        },
        {
          name: EAppResources.OUTLETS,
          list: OutletsList,
          create: OutletsCreate,
          edit: OutletEdit,
          show: OutletShow,
          icon: <Icons.ShoppingOutlined />,
        },
        {
          name: EAppResources.PRODUCTS,
          list: ProductList,
          create: ProductCreate,
          edit: ProductEdit,
          show: ProductShow,
          icon: <Icons.CoffeeOutlined />,
        },
        {
          name: EAppResources.ORDERS,
          list: OrderList,
          show: OrderShow,
          icon: <Icons.ShoppingCartOutlined />,
        },
        {
          name: EAppResources.CONTRACTS,
          list: ContractList,
          create: ContractCreate,
          edit: ContractEdit,
          show: ContractShow,
          icon: <Icons.SolutionOutlined />,
        },
        {
          name: EAppResources.TIMETABLES,
          list: RobotList,
          create: RobotCreate,
          edit: RobotEdit,
          show: RobotShow,
          icon: <Icons.RobotOutlined />,
        },
        {
          name: EAppResources.DISCOUNTS,
          list: DiscountList,
          create: DiscountCreate,
          edit: DiscountEdit,
          show: DiscountShow,
          icon: <Icons.ScheduleOutlined />,
        },

        {
          name: EAppResources.DIRECTORIES,
          options: {
            canAccess: [EUserRole.ADMIN, EUserRole.CONTENT_MANAGER],
          }
        },
        {
          name: EAppResources.OUTLET_TAGS,
          parentName: EAppResources.DIRECTORIES,
          list: CategoryList,
          icon: <Icons.DatabaseOutlined />,
        },
        {
          name: EAppResources.PRODUCT_TAGS,
          parentName: EAppResources.DIRECTORIES,
          list: CategoryList,
          icon: <Icons.DatabaseOutlined />,
        },
        // {
        //   name: "logs",
        //   list: LogList,
        //   icon: <Icons.ReadOutlined />,
        // },

        {
          name: EAppResources.PAGES,
          list: TextPagesList,
          create: TextPageCreate,
          edit: TextPageEdit,
          show: TextPageShow,
          icon: <Icons.DatabaseOutlined />,
        },

        // {
        //   name: "aboutUs",
        //   parentName: "textPage",
        //   list: SimpleTextPage,
        //   icon: <Icons.FileTextOutlined />,
        // },
      ]}
      Title={Title}
      Header={Header}
      Sider={Sider}
      Footer={Footer}
      Layout={Layout}
      OffLayoutArea={OffLayoutArea}
      i18nProvider={i18nProvider}
    />
  );
}

export default App;
