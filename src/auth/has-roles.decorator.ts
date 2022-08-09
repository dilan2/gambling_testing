import { SetMetadata } from '@nestjs/common';
import { Roles } from './roles.enum';

export const HasRole = (role: string) => SetMetadata('role', role);
