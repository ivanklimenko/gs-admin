export const PLACEHOLDER_DATE_FORMAT = "DD-MM-YYYY"
export const DATE_FORMAT = "YYYY-MM-DD"
export const DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm"
export const USER_DATE_TIME_FORMAT = "DD MMMM YYYY HH:mm"
export const PLACEHOLDER_TIME_FORMAT = "HH:mm"
export const TIME_FORMAT = 'HH:mm'

export const FORM_COMMON_RULES = [
  {
    required: true,
    message: 'Поле обязательно к заполнению'
  }
]


export const FILTER_ACTIVE_OPTION = [
  {
    label: 'Опубликовано',
    value: 'true',
  },
  {
    label:  'Не опубликовано',
    value: 'false',
  },
]


export const FILTER_ENABLED_OPTION = [
  {
    label: 'Доступно',
    value: 'true',
  },
  {
    label:  'Не доступно',
    value: 'false',
  },
]

export const FILTER_NETWORK_OPTION = [
  {
    label:  'Рынок',
    value: 'false',
  },
  {
    label: 'Сеть',
    value: 'true',
  }
]

export const FILTER_FIRST_ORDER_OPTION = [
  {
    label: 'Первый заказ',
    value: 'true',
  },
  {
    label:  'Остальные виды скидок',
    value: 'false',
  },
]