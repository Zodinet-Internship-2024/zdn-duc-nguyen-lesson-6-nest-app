import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { Role } from 'src/commondata/role-dto';
import { Permission } from 'src/commondata/permission-dto';
import { Permission_Role } from 'src/commondata/permission_role';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from './entities/permisson.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  private readonly dataRoleFilePath = path.join(
    __dirname,
    '..',
    '../../src/db/roles.json',
  );
  private readonly dataPermissionFilePath = path.join(
    __dirname,
    '..',
    '../../src/db/permission.json',
  );
  private readonly dataPermissionRoleFilePath = path.join(
    __dirname,
    '..',
    '../../src/db/permission_role.json',
  );
  public getRoles(): Role[] {
    return this.readJsonFile<Role>(this.dataRoleFilePath);
  }

  public getPermissions(): Permission[] {
    return this.readJsonFile<Permission>(this.dataPermissionFilePath);
  }

  public getPermissionRoles(): Permission_Role[] {
    return this.readJsonFile<Permission_Role>(this.dataPermissionRoleFilePath);
  }
  private readJsonFile<T>(filePath: string): T[] {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent) as T[];
  }
  public getValuePermissionsByRoleId(roleId: number): string[] {
    const permissionRoles = this.getPermissionRoles();
    const permissions = this.getPermissions();

    const permissionIds = permissionRoles
      .filter((pr) => pr.roleId === roleId)
      .map((pr) => pr.permissionId);

    const valuePermissions = permissions
      .filter((permission) => permissionIds.includes(permission.id))
      .map((permission) => permission.valuePermission)
      .flat();

    return valuePermissions;
  }

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    console.log(requiredPermissions);
    if (!requiredPermissions) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    const userPermissions = this.getValuePermissionsByRoleId(user.roleId);
    console.log(userPermissions);
    return requiredPermissions.some((permission) =>
      userPermissions.includes(permission),
    );
  }
}
