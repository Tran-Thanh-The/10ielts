import { Injectable, NestMiddleware, ForbiddenException } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { JwtService } from "@nestjs/jwt";
import { RoleEnum as Role } from "@/domain/roles/roles.enum";
import { ROLE_PERMISSIONS } from "./role-permissions.const";
import { ENDPOINT_PERMISSIONS } from "./endpoint-permissions.const";

@Injectable()
export class PermissionMiddleware implements NestMiddleware {
  private readonly publicPaths = [
    "/api/v1/auth/email/login",
    "/api/v1/auth/email/register",
    "/api/v1/auth/email/confirm",
    "/api/v1/auth/email/confirm/new",
    "/api/v1/auth/forgot/password",
    "/api/v1/auth/reset/password",
    "/api/v1/auth/refresh",
    "/api/v1/auth/logout",
    "/api/v1/auth/me",
  ];

  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    try {
      // Check if path is public
      if (this.publicPaths.some((path) => req.path.startsWith(path))) {
        return next();
      }

      // Extract base path
      const basePathMatch = req.path.match(/^\/api\/v1\/[^/]+/);
      if (!basePathMatch) {
        return next();
      }

      const basePath = basePathMatch[0];
      const endpointKey = `${req.method}:${basePath}`;
      const endpointKeyWithId = `${req.method}:${basePath}/:id`;

      // Check required permission
      const requiredPermission =
        ENDPOINT_PERMISSIONS[endpointKeyWithId] ||
        ENDPOINT_PERMISSIONS[endpointKey];

      if (!requiredPermission) {
        return next();
      }

      // Validate token
      const authHeader = req.headers["authorization"];
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ForbiddenException("Token is required");
      }

      const token = authHeader.split(" ")[1];
      const decodedToken = this.jwtService.decode(token) as {
        role: { id: number; name: string };
      };
      const roleValue = decodedToken?.role?.id;

      // Admin has full access
      if (roleValue === Role.admin) {
        return next();
      }

      // Check user permissions
      const userPermissions = ROLE_PERMISSIONS[roleValue as Role] || [];
      const hasPermission = userPermissions.includes(requiredPermission);

      if (!hasPermission) {
        throw new ForbiddenException(
          `Insufficient permissions. Required: ${requiredPermission}`,
        );
      }

      next();
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new ForbiddenException("Permission check failed");
    }
  }
}
