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

        if (!user) {
            throw new ForbiddenException();
        }

        let userPermissions = await this.getUserPermissionsFromCache(user.id);
        console.log('test', userPermissions);
        if (!userPermissions) {
            userPermissions = await this.getUserPermissionsFromDatabase(user.id);
            await this.cacheManager.set(user.id.toString(), userPermissions.toString());
        }

        const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler()) || [];
        const hasAllRequiredPermissions = requiredPermissions.every((permission) => userPermissions.includes(permission));

        if (!hasAllRequiredPermissions) {
            throw new ForbiddenException();
        }

        return true;
    }

    private async getUserPermissionsFromCache(userId: number): Promise<string[] | null> {
        try {
            const tmp = await this.cacheManager.get<string>(userId.toString());
            console.log('From redis cache', tmp);
            return JSON.parse(tmp);
        } catch (err) {
            return null;
        }
    }

    private async getUserPermissionsFromDatabase(userId: number): Promise<string[]> {
        const userPermissions = await this.permissionsService.getPermissionByUserId(userId);
        await this.cacheManager.set(userId.toString(), JSON.stringify(userPermissions));
        console.log('From db', userPermissions);
        return userPermissions;
    }
}
