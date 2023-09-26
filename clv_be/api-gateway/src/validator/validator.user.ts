import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { ChangePasswordDTO } from 'src/dto/user.reset-password.dto';

@ValidatorConstraint({ name: 'IsDifferentPassword', async: false })
@Injectable()
export class IsDifferentPassword implements ValidatorConstraintInterface {
  validate(newPassword: string, args: any) {
    const { currentPassword } = args.object as ChangePasswordDTO;
    return newPassword !== currentPassword;
  }

  defaultMessage() {
    return 'New password must be different from the current password.';
  }
}
