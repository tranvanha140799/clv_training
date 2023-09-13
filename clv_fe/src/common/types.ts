export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  accessToken: string;
  country?: string;
  createdAt?: string;
  createdBy?: string;
  globalId?: string;
  isDisable?: boolean;
  isPending?: boolean;
  officeCode?: string;
  password?: string;
  roles?: Role[];
};

export type Role = {
  id: string;
  name: string;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
  deletedAt?: string;
  permissions: Permission[];
};

export type Permission = {
  id: string;
  name: string;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
  deletedAt?: string;
  description: string;
  roles: Role[];
};

export type RegisterInfo = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type LoginInfo = {
  email: string;
  password: string;
};

export type LoginWithGoogle = {
  access_token: string;
  authuser: string;
  expires_in: number;
  prompt: string;
  scope: string;
  token_type: string;
};

export type UpdateUser = {
  firstName: string;
  lastName: string;
  email: string;
  country?: string;
  globalId?: string;
  officeCode?: string;
};
