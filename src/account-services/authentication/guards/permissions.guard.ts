import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PermissionsService } from "../../../permissions/permissions.service";
@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly permissionService: PermissionsService
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        console.log('PermissionGuard');
        const req = context.switchToHttp().getRequest();
        const userPermissions = await this.permissionService.getPermissionByRolesName(req?.user?.roles);
        console.log('userPermissions', userPermissions);
        const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler()) || [];
        console.log('requiredPermissions', requiredPermissions);
        const hasAllRequiredPermissions = requiredPermissions.every((permission) => userPermissions.includes(permission));

        if(requiredPermissions.length && hasAllRequiredPermissions) {
            return true;
        }
        throw new ForbiddenException('You do not have permission to access this resource');
    }
}