import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/account-services/authentication/guards/jwt.guard';
import { PermissionGuard } from 'src/account-services/authentication/guards/permissions.guard';

export const Permission = (permissions: string[]) => {
    return applyDecorators(
        UseGuards(JwtAuthGuard, PermissionGuard),
        SetMetadata('permissions', permissions),
        ApiBearerAuth(),
        ApiForbiddenResponse({ description: 'Forbidden' }),
        );
};
