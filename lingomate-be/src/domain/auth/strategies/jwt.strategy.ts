import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { OrNeverType } from "@/utils/types/or-never.type";
import { JwtPayloadType } from "./types/jwt-payload.type";
import { AllConfigType } from "@/config/config.type";
import { RedisService } from "@/common/redis/redis.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    configService: ConfigService<AllConfigType>,
    private readonly redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get("auth.secret", { infer: true }),
    });
  }

  // Why we don"t check if the user exists in the database:
  // https://github.com/brocoders/nestjs-boilerplate/blob/main/docs/auth.md#about-jwt-strategy
  public async validate(
    payload: JwtPayloadType,
  ): Promise<OrNeverType<JwtPayloadType>> {
    // // Check if the token is blacklisted
    const isBlacklisted = await this.redisService.get(
      `blacklist:${payload.sessionId}`,
    );

    if (isBlacklisted) {
      throw new UnauthorizedException();
    }

    if (!payload.id) {
      throw new UnauthorizedException();
    }

    return {
      ...payload,
      permissions: payload.permissions || [],
    };
  }
}
