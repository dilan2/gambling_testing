import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { errorConstants, jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && user.password === pass) {
      const { password, ...result } = user;

      return result;
    }
    return null;
  }

  async login(user: any): Promise<any> {
    const access_payload = {
      email: user['_doc'].email,
      sub: user['_doc']._id,
      role: user['_doc'].role,
    };

    const refresh_payload = {
      id: user['_doc']._id,
    };

    return {
      access_token: this.jwtService.sign(access_payload),
      refresh_token: this.jwtService.sign(refresh_payload, {
        secret: jwtConstants.refresh_secret,
        expiresIn: jwtConstants.refresh_expire,
      }),
    };
  }

  async refresh(refreshToken: string): Promise<any> {
    const payload = this.jwtService.decode(refreshToken);

    try {
      const user = await this.usersService.findById(payload['id']);
      return this.login(user);
    } catch (err) {
      return errorConstants.refreshError;
    }
  }
}
