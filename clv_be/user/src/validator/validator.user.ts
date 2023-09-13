import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ResetPwDto } from 'src/modules/user/dto/user.reset-password.dto';

@ValidatorConstraint({ name: 'IsDifferentPassword', async: false })
@Injectable()
export class IsDifferentPassword implements ValidatorConstraintInterface {
  validate(newPassword: string, args: any) {
    const { currentPassword } = args.object as ResetPwDto;
    return newPassword !== currentPassword;
  }

  defaultMessage() {
    return 'New password must be different from the current password.';
  }
}
