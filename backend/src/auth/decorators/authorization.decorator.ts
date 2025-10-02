import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';

export function Authorization() {
  return applyDecorators(UseGuards(JwtGuard, RolesGuard));
}
