import { TypeOf, object, string } from 'zod';

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

export type ChangePassword = {
  email: string;
  currentPassword: string;
  newPassword: string;
};

export type ResetPassword = {
  email: string;
  newPassword: string;
};

export type ValidSession = {
  email: string;
  token: string;
};

export type UpdateProfile = {
  firstName: string;
  lastName: string;
  email: string;
  country?: string;
  globalId?: string;
  officeCode?: string;
};

// Schema for validating update user information
export const updateProfileSchema = object({
  email: string()
    .min(1, 'Email address is required')
    .email('Email Address is invalid'),
  firstName: string().min(1, 'First name is required').max(100),
  lastName: string().min(1, 'Last name is required').max(100),
  globalId: string().max(10),
  country: string().max(20),
  officeCode: string().max(10),
});

export type UpdateProfileInput = TypeOf<typeof updateProfileSchema>;

export const loginSchema = object({
  email: string()
    .min(1, 'Email address is required')
    .email('Email Address is invalid'),
  password: string()
    .min(1, 'Password is required')
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
});

export type LoginInput = TypeOf<typeof loginSchema>;

// Schema for validating register information
export const registerSchema = object({
  firstName: string().min(1, 'First name is required').max(100),
  lastName: string().min(1, 'Last name is required').max(100),
  email: string()
    .min(1, 'Email address is required')
    .email('Email Address is invalid'),
  password: string()
    .min(1, 'Password is required')
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
  passwordConfirm: string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.passwordConfirm, {
  path: ['passwordConfirm'],
  message: 'Passwords do not match!',
});

export type RegisterInput = TypeOf<typeof registerSchema>;

export const changePasswordSchema = object({
  email: string()
    .min(1, 'Email address is required')
    .email('Email Address is invalid'),
  currentPassword: string()
    .min(1, 'Password is required')
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
  newPassword: string()
    .min(1, 'New password is required')
    .min(8, 'New password must be more than 8 characters')
    .max(32, 'New password must be less than 32 characters'),
  confirmNewPassword: string()
    .min(1, 'Confirm new password is required')
    .min(8, 'Confirm new password must be more than 8 characters')
    .max(32, 'Confirm new password must be less than 32 characters'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  path: ['confirmNewPassword'],
  message: 'New passwords do not match!',
});

export type ChangePasswordInput = TypeOf<typeof changePasswordSchema>;

export const forgotPasswordSchema = object({
  email: string()
    .min(1, 'Email address is required')
    .email('Email Address is invalid'),
});

export type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>;

export const resetPasswordSchema = object({
  email: string()
    .min(1, 'Email address is required')
    .email('Email Address is invalid'),
  newPassword: string()
    .min(1, 'New password is required')
    .min(8, 'New password must be more than 8 characters')
    .max(32, 'New password must be less than 32 characters'),
  confirmNewPassword: string()
    .min(1, 'Confirm new password is required')
    .min(8, 'Confirm new password must be more than 8 characters')
    .max(32, 'Confirm new password must be less than 32 characters'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  path: ['confirmNewPassword'],
  message: 'New passwords do not match!',
});

export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>;
