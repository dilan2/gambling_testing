import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  async get() {}

  async getByUsername() {}

  async create() {}

  async update() {}
  async findOne(username: string) {
    return { password: 'hello', userId: 5, username };
  }
}
