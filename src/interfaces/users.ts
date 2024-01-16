
export enum EUserRole {
  ADMIN = 'Admin',
  CORNER = 'Corner',
  USER = 'User',
  RUNNER = 'Runner',
  CONTENT_MANAGER = 'ContentManager'
}

export interface IUserRole {
  label?: string;
  label_key?: string;
  value: EUserRole;
}

export const USER_ROLES: IUserRole[] = [
  {
    label_key: 'admin',
    value: EUserRole.ADMIN
  },
  {
    label_key: 'corner',
    value: EUserRole.CORNER,
  },
  {
    label_key: 'user',
    value: EUserRole.USER
  },
  {
    label_key: 'runner',
    value: EUserRole.RUNNER
  },
  {
    label_key: 'content_manager',
    value: EUserRole.CONTENT_MANAGER
  },
]


export interface IUsers {
  count: number;
  users: Array<IUser>
}

export interface IUser {
  id: number;
  name?: string;
  isActive: boolean;
  email: string;
  password: string;
  username: string;
  phone: string;
  firstName: string;
  lastName: string;
  roles: Array<EUserRole>;

  markets: Array<{id: number; title: string}>;
  outlets: Array<{id: number; title: string}>;
}

export interface IUserFilterVariables {
  textSearch: string;
  role: string;
}
