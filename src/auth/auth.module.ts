import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginStrategy } from './strategies/login.strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.access_expire },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LoginStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
