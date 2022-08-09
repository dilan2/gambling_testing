import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  HttpStatus,
  UseGuards,
  UseFilters,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { RegisterPlayerDto } from './dto/register-user.dto';
import { RolesGuard } from '../auth/roles.guard';
import { HasRole } from '../auth/has-roles.decorator';
import { Roles } from '../auth/roles.enum';
import { MongoExceptionFilter } from './users.exceptions';

@Controller('users')
export class UsersController {
  constructor(private readonly UsersService: UsersService) {}

  @Post('/register_player/:email/:password')
  @UseFilters(MongoExceptionFilter)
  async registerPlayer(
    // @Body() registerPlayerDto: RegisterPlayerDto,
    @Param('email') emailValue: string,
    @Param('password') passwordValue: string,
  ) {
    const data = new RegisterPlayerDto(emailValue, passwordValue);
    const playerInstance = await this.UsersService.registerPlayer(data);
    const { password, ...player } = playerInstance['_doc'];
    return player;
  }

  @HasRole(Roles.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('/players')
  @ApiBearerAuth('JWT-auth')
  async getPlayers(@Res() res) {
    const gits = await this.UsersService.getPlayers();
    return res.status(HttpStatus.OK).json(gits);
  }
}
