import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { Cache } from 'cache-manager';
import { Reflector } from "@nestjs/core";
import { PermissionsService } from 'src/permissions/permissions.service';

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
		private readonly permissionsService: PermissionsService,
        @Inject('CACHE_MANAGER') private cacheManager: Cache
        ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { user } = context.switchToHttp().getRequest();
        console.log('user', context.switchToHttp().getRequest());
        if(!user) {
            throw new ForbiddenException();
        }
        let userPermissions = [];
        try {
            console.log('From redis cache', userPermissions);
            userPermissions = await this.cacheManager.get(user.id);
        } catch(err) {
            console.log(user);
            userPermissions = await this.permissionsService.getPermissionByUserId(user.id);
            console.log('From db', userPermissions);
        }
        
        const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler()) || [];
        const hasAllRequiredPermissions = requiredPermissions.every((permission) => userPermissions.includes(permission));
        console.log('userPermissions', user);
        console.log('userPermissions', requiredPermissions);

        if (!userPermissions.length || !hasAllRequiredPermissions) {
            throw new ForbiddenException();
        }
        return true;
    }
}
