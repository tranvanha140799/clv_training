import { SetMetadata } from '@nestjs/common';

//* Custom decorator for marking if a route requires specific permission
export const HasPermission = (...permissions: string[]) =>
  SetMetadata('PERMISSIONS', permissions);

//* Notice: In this case, we don't need a custom param decorator like "CheckPermissions" for checking user permissions because we can get it in AuthReq
