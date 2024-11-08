import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { AnonymousStrategy } from "./strategies/anonymous.strategy";
import { JwtRefreshStrategy } from "./strategies/jwt-refresh.strategy";
import { MailModule } from "../../mail/mail.module";
import { SessionModule } from "@/domain/session/session.module";
import { UsersModule } from "@/domain/users/users.module";
import { JwtAuthGuard } from "@/domain/auth/guards/jwt.guard";

@Module({
  imports: [
    UsersModule,
    SessionModule,
    PassportModule,
    MailModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    AnonymousStrategy,
    JwtAuthGuard,
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
