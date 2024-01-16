import axios, {AxiosInstance} from "axios";
import {CrudFilters, CrudOperators, CrudSorting, DataProvider, HttpError} from "@pankod/refine-core";
import {stringify} from "query-string";
import Cookies from "js-cookie";
import dataProvider from "@pankod/refine-simple-rest";
import {settings} from "common/settings";
import {resizeFile} from "../utils";


export const axiosInstance = axios.create({
  headers: {
    'Authorization': `Bearer ${Cookies.get(settings.auth.token)}`
  }
});

// axiosInstance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     console.log(error.response)
//     const customError: HttpError = {
//       ...error,
//       message: error.response?.data?.inn ? 'Неверный формат ИНН' : error.response?.data?.phone ? 'Неверный формат номера телефона' :
//         error.response?.status === 400 ? 'Проверьте отправляемые данные, возможно в них содержится ошибка' : 'Непредвиденная ошибка',
//       statusCode: error.response?.status,
//     };
//
//     return Promise.reject(customError);
//   },
// );

const RESOURCE_WITH_MULTIPART: Array<string> = ["markets", "networks",  "outlets", "products", "tags"]

const mapOperator = (operator: CrudOperators): string => {
  switch (operator) {
    case "ne":
    case "gte":
    case "lte":
      return `_${operator}`;
    case "contains":
      return "_like";
    case "eq":
    default:
      return "";
  }
};

const generateFilter = (filters?: CrudFilters) => {
  const queryFilters: { [key: string]: string } = {};
  if (filters) {
    filters.map((filter) => {
      if (filter.operator !== "or") {
        const { field, operator, value } = filter;

        if (field === "q") {
          queryFilters[field] = value;
          return;
        }

        const mappedOperator = mapOperator(operator);
        queryFilters[`${field}${mappedOperator}`] = value;
      }
    });
  }

  return queryFilters;
};

const getResourceLabel = (resource: string) => {
  return {
    "markets": "list",
    "outlets": "list",
    "users": "list"
  }[resource] || "list"
}

const buildFormData = async (formData: any, data: any, parentKey: any) => {
  if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
    for (let key in data) {
      await buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
    }
  } else {
    if (data instanceof File) {
      const value = data == null ? null : await resizeFile(data);
      formData.append(parentKey, value);
    } else {
      const value = data == null ? '' : data;
      formData.append(parentKey, value);
    }
  }

  return formData;
}

export const CustomServer = (
  apiUrl: string,
  httpClient: AxiosInstance = axiosInstance,
): Omit<DataProvider, | "createMany" | "updateMany" | "deleteOne" | "deleteMany" | "getApiUrl" | "custom">  => ({
  getList: async ({
                    resource,
                    hasPagination = true,
                    pagination = { current: 1, pageSize: 20 },
                    filters,
                    sort,
                  }) => {

    let { current = 1, pageSize = 20 } = pagination ?? {};
    let queryFilters = generateFilter(filters);
    pageSize = queryFilters?.marketId ? 1000 : pageSize

    if (queryFilters.hasOwnProperty('isPermissions') && !queryFilters.isPermissions) {
      return {
        data: [],
        total: 0,
      }
    }

    const query: {
      take?: number;
      skip?: number;
    } = hasPagination
        ? {
          skip: (current - 1) * pageSize,
          take: pageSize,
        }
        : {};

    if (queryFilters.marketId) {
      queryFilters = {
        ...queryFilters,
        orderBy: 'sort_ASC'
      }
    }

    const url = `${apiUrl}/${resource === "networks" ? "markets" : resource}`;

    const { data, headers } = await httpClient.get(
      `${url}?${stringify(query)}&${stringify(queryFilters)}`,
    );

    return {
      data: data?.list,
      total: data.count,
    };
  },

  getMany: async ({ resource, ids }) => {
    let allData: any = []

    for (const id of ids) {
      const { data } = await httpClient.get(
        `${apiUrl}/${resource}/${id}`,
      );
      allData = [...allData, data]
    }

    return {
      data: allData,
    };
  },

  getOne: async ({ resource, id }) => {
    const url = `${apiUrl}/${resource === "networks" ? "markets" : resource}/${id}`;

    if (!id) {
      return {
        data: null,
      };
    }

    const { data } = await httpClient.get(url);

    return {
      data,
    };
  },

  create: async ({ resource, variables }) => {
    const url = `${apiUrl}/${resource === "networks" ? "markets" : resource}`;

    const formData = new FormData();
    const body = !RESOURCE_WITH_MULTIPART.includes(resource) ? variables : await buildFormData(formData, variables, '');

    const { data } = await httpClient.post(url, body, {
      headers: {
        'Authorization': `Bearer ${Cookies.get(settings.auth.token)}`,
        'Content-Type': !RESOURCE_WITH_MULTIPART.includes(resource) ? "application/json" : "multipart/form-data"
      }
    });

    return {
      data,
    };
  },

  update: async ({ resource, id, variables }) => {
    const url = `${apiUrl}/${resource === "networks" ? "markets" : resource}`;

    const formData = new FormData();
    const body = !RESOURCE_WITH_MULTIPART.includes(resource) ? variables : await buildFormData(formData, variables, '');

    const { data } = await httpClient.post(url, body, {
      headers: {
        'Authorization': `Bearer ${Cookies.get('hn_u')}`,
        'Content-Type': !RESOURCE_WITH_MULTIPART.includes(resource) ? "application/json" : "multipart/form-data"
      }
    });

    return {
      data,
    };
  },
})


export const AutocompleteServer = (
  apiUrl: string,
  httpClient: AxiosInstance = axiosInstance,
): Omit<DataProvider, | "getMany" | "update" | "getOne" | "create" | "createMany" | "updateMany" | "deleteOne" | "deleteMany" | "getApiUrl" | "custom">  => ({
  getList: async ({
                    resource,
                    hasPagination = true,
                    pagination = { current: 1, pageSize: 10 },
                    filters,
                    sort,
    ...props
                  }) => {
    const url = `${apiUrl}/${resource === "networks" ? "markets" : resource}/autocomplete`;

    const queryFilters = generateFilter(filters);

    //console.log('filters', filters)

    const query: {
      starts_with?: string;
    } = {starts_with: queryFilters?.title_like || ''};

    if (queryFilters?.title_like) {
      delete queryFilters?.title_like;
    }

    const { data, headers } = await httpClient.get(
      `${url}?${stringify({...query, ...queryFilters})}`,
    );

    const total = data.count;

    return {
      data: data[getResourceLabel(resource)],
      total,
    };
  },

})


export const ProductsServer = (
  apiUrl: string,
  httpClient: AxiosInstance = axiosInstance,
): Omit<DataProvider, | "getMany" | "getOne" | "create" | "createMany" | "updateMany" | "deleteOne" | "deleteMany" | "getApiUrl" | "custom">  => ({
  getList: async ({
                    resource,
                    hasPagination = true,
                    pagination = { current: 1, pageSize: 10 },
                    filters,
                    sort,
                    ...props
                  }) => {
    const url = `${apiUrl}/${resource}/tree`;

    const queryFilters = generateFilter(filters);

    if (!queryFilters.outletId) {
      return {
        data: [],
        total: 0,
      };
    }

    const { data, headers } = await httpClient.get(
      `${url}?${stringify(queryFilters)}`,
    );

    const total = data.count;

    return {
      data: data,
      total,
    };
  },

  update: async ({ resource, id, variables }) => {
    const url = `${apiUrl}/${resource}/sort`;

    const { data } = await httpClient.post(url, variables, {
      headers: {
        'Authorization': `Bearer ${Cookies.get('hn_u')}`,
        'Content-Type': "application/json"
      }
    });

    return {
      data,
    };
  },

})


export const OutletsServer = (
  apiUrl: string,
  httpClient: AxiosInstance = axiosInstance,
): Omit<DataProvider, | "getList" | "getMany" | "getOne" | "create" | "createMany" | "updateMany" | "deleteOne" | "deleteMany" | "getApiUrl" | "custom">  => ({

  update: async ({ resource, id, variables }) => {
    const url = `${apiUrl}/${resource}/sort`;

    const { data } = await httpClient.post(url, variables, {
      headers: {
        'Authorization': `Bearer ${Cookies.get('hn_u')}`,
        'Content-Type': "application/json"
      }
    });

    return {
      data,
    };
  },

})



export const OrdersServer = (
  apiUrl: string,
  httpClient: AxiosInstance = axiosInstance,
): Omit<DataProvider, | "getOne" | "createMany" | "updateMany" | "deleteMany" | "getApiUrl" | "custom">  => ({
  getList: async ({
                    resource,
                    hasPagination = true,
                    pagination = { current: 1, pageSize: 10 },
                    filters,
                    sort,
                    ...props
                  }) => {
    const url = `${apiUrl}/${resource}`;

    const queryFilters = generateFilter(filters);

    if (!queryFilters.orderId) {
      return {
        data: [],
        total: 0,
      };
    }

    const {data} = await httpClient.get(
      `${url}?${stringify(queryFilters)}`,
    );

    const total = data.count || 0;

    return {
      data: resource === 'orders/status' ? data?.orderOutlets : data || [],
      total,
    };
  },

  deleteOne: async ({ resource, id, variables }) => {
    const url = id ? `${apiUrl}/${resource}/${id}` : `${apiUrl}/${resource}`;
    const { data } = id ? await httpClient.delete(url, variables) : await httpClient.post(url, variables)
    return {
      data,
    };

  },

  create: async ({ resource, variables }) => {
    const url = `${apiUrl}/${resource}/products/add`;

    const { data } = await httpClient.post(url, variables, {
      headers: {
        'Authorization': `Bearer ${Cookies.get(settings.auth.token)}`,
        'Content-Type': "application/json"
      }
    });

    return {
      data,
    };
  },

  update: async ({ resource, id, variables }) => {
    let url = `${apiUrl}/${resource}`;
///products/change_quantity
    // @ts-ignore
    if (variables?.orderProductId) {
      url = `${apiUrl}/${resource}/products/change_quantity`;
    }
    const { data } = await httpClient.post(url, variables, {
      headers: {
        'Authorization': `Bearer ${Cookies.get('hn_u')}`,
        'Content-Type': "application/json"
      }
    });

    return {
      data,
    };
  },

  getMany: async ({ resource, ids }) => {
    const url = `${apiUrl}/${resource}`;

    let logs: any = {};

    for (const id of ids) {
      const { data } = await httpClient.get(
        `${apiUrl}/${resource}?orderOutletId=${id}`,{
          headers: {
            'Authorization': `Bearer ${Cookies.get('hn_u')}`,
            'Content-Type': "application/json"
          }
        }
      );
      logs = {
        ...logs,
        [id]: data
      }
    }

    return {
      data: [logs],
    };
  },
})


export const CategoriesServer = (
  apiUrl: string,
  httpClient: AxiosInstance = axiosInstance,
): Omit<DataProvider, | "getMany" | "update" | "getOne" | "create" | "createMany" | "updateMany" | "deleteOne" | "deleteMany" | "getApiUrl" | "custom">  => ({
  getList: async ({
                    resource,
                    hasPagination = true,
                    pagination = { current: 1, pageSize: 10 },
                    filters,
                    sort,
                    ...props
                  }) => {
    const url = `${apiUrl}/${resource}`;

    const queryFilters = generateFilter(filters);

    if (!queryFilters?.outletId) {
      return {
        data: [],
        total: 0
      }
    }

    // const query: {
    //   starts_with?: string;
    // } = {starts_with: queryFilters?.title_like || ''};

    const { data, headers } = await httpClient.get(
      `${url}?${stringify(queryFilters)}`,
    );

    const total = data.count;

    return {
      data: data,
      total,
    };
  },

})


export const TimetablesServer = (
  apiUrl: string,
  httpClient: AxiosInstance = axiosInstance,
): Omit<DataProvider, | "getMany" | "update" | "getOne" | "create" | "createMany" | "updateMany" | "deleteOne" | "deleteMany" | "getApiUrl" | "custom">  => ({
  getList: async ({
                    resource,
                    hasPagination = true,
                    pagination = { current: 1, pageSize: 10 },
                    filters,
                    sort,
                    ...props
                  }) => {
    const url = `${apiUrl}/${resource}`;

    const queryFilters = generateFilter(filters);

    // const query: {
    //   starts_with?: string;
    // } = {starts_with: queryFilters?.title_like || ''};

    const { data, headers } = await httpClient.get(
      `${url}?${stringify(queryFilters)}`,
    );

    return {
      data: data,
      total: 0
    };
  },

})

