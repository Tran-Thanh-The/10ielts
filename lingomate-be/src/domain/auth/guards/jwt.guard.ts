import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "@/utils/decorators/public.decorator";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(" ")[1] ?? "";
    const user = this.jwtService.decode(token);
    request.headers.user = user;
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
