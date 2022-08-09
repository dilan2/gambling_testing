import { IsEmail, IsString } from 'class-validator';
import { Roles } from '../../auth/roles.enum';

export class RegisterPlayerDto {
  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
