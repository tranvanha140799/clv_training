export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  accessToken: string;
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
