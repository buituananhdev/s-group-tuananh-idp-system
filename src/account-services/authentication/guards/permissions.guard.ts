import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { user } = context.switchToHttp().getRequest();
        const userPermissions = user?.permissions || [];
        const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler()) || [];
        const hasAllRequiredPermissions = requiredPermissions.every((permission) => userPermissions.includes(permission));
        console.log('userPermissions', user);
        console.log('userPermissions', requiredPermissions);

        if (!userPermissions.length || !hasAllRequiredPermissions) {
            throw new ForbiddenException(requiredPermissions);
        }
        return true;
    }
}
