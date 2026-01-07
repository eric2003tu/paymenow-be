import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // Replace this with your actual admin check logic
    const request = context.switchToHttp().getRequest();
    if (request.user && request.user.role === 'ADMIN') {
      return true;
    }
    throw new ForbiddenException('Only admin can perform this action');
  }
}
