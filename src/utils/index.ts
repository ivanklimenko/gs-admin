import {RcFile} from "@pankod/refine-antd";
import {EUserRole, IUser} from "interfaces/users";
import moment from "moment";
import {ORDER_STATUSES} from "interfaces/orders";
import Resizer from "react-image-file-resizer";

export const _checkFullP = (permissions: Array<string> | undefined) => {
  return (permissions?.includes(EUserRole.ADMIN) || permissions?.includes(EUserRole.CONTENT_MANAGER))
}

type RoleTranscriptionFunction = (role: string) => string | undefined;
export const getRoleTranscriptionValue: RoleTranscriptionFunction = (role) => {
  return {
    [EUserRole.ADMIN]: "admin",
    [EUserRole.CORNER]: "corner",
    [EUserRole.USER]: "user",
    [EUserRole.RUNNER]: "runner",
    [EUserRole.CONTENT_MANAGER]: "content_manager",
    "none": "none"
  }[role || "none"]
}

export const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

export const getDateInReadableFormat = (date: string, customFormat?: string | null): string => {
  if (customFormat) {
    return moment(date, customFormat).format('D MMMM YYYY')
  }
  return moment(date).format('D MMMM YYYY')
}

export const getDatetimeInReadableFormat = (date: string, customFormat?: string | null): string => {
  if (customFormat) {
    return moment(date, customFormat).format('D MMMM YYYY HH:mm')
  }
  return moment(date).format('D MMMM YYYY HH:mm')
}

export const getStatus = (value: string, field: "label" | "color" | "className" | "value" | "colorText") => {
  return ORDER_STATUSES.find(t => t.value === value)?.[field] || '--'
}


export const getReadyTimeList: () => Array<any> = () => {
  // @ts-ignore
  const numbers: Array<number> = Array.from({length: 12}, (_, i) => i * 5);
  const values: Array<any> = numbers.reduce((arr, cur) => (cur < 10 ? arr : [...arr, {
    label: `${cur} мин.`,
    value: cur
  }]), Array.from({length: 0}))
  return values
}

export const resizeFile = (file: any) => {
  const formatArr = file.type?.split('/')
  const format = !formatArr || !formatArr?.length ? 'jpeg' : formatArr[formatArr?.length - 1]
  return new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      1080,
      1080,
      format,
      300,
      0,
      (uri) => {
        resolve(uri);
      },
      "file"
    );
  });
}


export const formatZones = (formProps: any) => {
  const zone1 = !formProps.initialValues?.deliveryZone1 ? [] : [{name: formProps.initialValues?.deliveryZoneName1, price: +formProps.initialValues?.deliveryZoneCost1, limit: +formProps.initialValues?.deliveryZoneFreeMinCost1}]
  const zone2 = !formProps.initialValues?.deliveryZone2 ? [] : [{name: formProps.initialValues?.deliveryZoneName2, price: +formProps.initialValues?.deliveryZoneCost2, limit: +formProps.initialValues?.deliveryZoneFreeMinCost2}]
  const zone3 = !formProps.initialValues?.deliveryZone3 ? [] : [{name: formProps.initialValues?.deliveryZoneName3, price: +formProps.initialValues?.deliveryZoneCost3, limit: +formProps.initialValues?.deliveryZoneFreeMinCost3}]
  return [
    ...zone1,
    ...zone2,
    ...zone3
  ]
}

export const getUserLabel = (u: IUser) => {
  return u.username ? u.username : u.firstName ? `${u.firstName} ${u.lastName}` : u.email || u.phone || u.id
}