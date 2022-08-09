import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Body,
  Param,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { errorConstants } from './constants';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Body() LoginDto: LoginDto, @Request() req) {
    return this.authService.login(req.user);
  }

  @Post('auth/refresh/:token')
  async refreshToken(@Param('token') tokenValue: string, @Res() res) {
    const response = await this.authService.refresh(tokenValue);
    if (response === errorConstants.refreshError) {
      return res.status(HttpStatus.FORBIDDEN).json(response);
    }
    return res.status(HttpStatus.OK).json(response);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
