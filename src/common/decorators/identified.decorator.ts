import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/account-services/authentication/guards/jwt.guard';
import { PermissionGuard } from 'src/account-services/authentication/guards/permissions.guard';
export const Identified = applyDecorators(
	UseGuards(JwtAuthGuard, PermissionGuard),
	ApiBearerAuth(),
	ApiBearerAuth(),
	ApiUnauthorizedResponse({ description: 'Forbidden' }),
) as MethodDecorator;
