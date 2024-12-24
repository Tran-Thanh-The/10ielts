import { StatusEnum } from "@/common/enums/status.enum";
import { redisConstants } from "@/common/redis/redis.constants";
import { RedisService } from "@/common/redis/redis.service";
import { AllConfigType } from "@/config/config.type";
import { Session } from "@/domain/session/domain/session";
import { SessionService } from "@/domain/session/session.service";
import { User } from "@/domain/users/domain/user";
import { UsersService } from "@/domain/users/users.service";
import { NullableType } from "@/utils/types/nullable.type";
import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { randomStringGenerator } from "@nestjs/common/utils/random-string-generator.util";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import ms from "ms";
import { MailService } from "../../mail/mail.service";
import { AuthProvidersEnum } from "./auth-providers.enum";
import { AuthEmailLoginDto } from "./dto/auth-email-login.dto";
import { AuthRegisterLoginDto } from "./dto/auth-register-login.dto";
import { AuthUpdateDto } from "./dto/auth-update.dto";
import { LoginResponseDto } from "./dto/login-response.dto";
import { JwtPayloadType } from "./strategies/types/jwt-payload.type";
import { JwtRefreshPayloadType } from "./strategies/types/jwt-refresh-payload.type";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private sessionService: SessionService,
    private mailService: MailService,
    private configService: ConfigService<AllConfigType>,
    private readonly redisService: RedisService,
  ) {}

  async validateLogin(loginDto: AuthEmailLoginDto): Promise<LoginResponseDto> {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          email: "notFound",
        },
      });
    }

    if (user.status === StatusEnum.IN_ACTIVE) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          email: "userInactive",
        },
      });
    }

    if (user.provider !== AuthProvidersEnum.email) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          email: `needLoginViaProvider:${user.provider}`,
        },
      });
    }

    if (!user.password) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          password: "incorrectPassword",
        },
      });
    }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          password: "incorrectPassword",
        },
      });
    }

    const hash = crypto
      .createHash("sha256")
      .update(randomStringGenerator())
      .digest("hex");

    const session = await this.sessionService.create({
      user,
      hash,
    });

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: user.id,
      role: user.role,
      permissions: user.role?.permissions || [],
      sessionId: session.id,
      hash,
    });

    console.log("Permission: ", user.role?.permissions);

    return {
      refreshToken,
      token,
      tokenExpires,
      user,
    };
  }

  async register(dto: AuthRegisterLoginDto): Promise<any | Error> {
    try {
      const { confirmPassword, ...restDto } = dto;

      if (dto.password !== confirmPassword) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            password: "passwordsNotMatch",
          },
        });
      }

      const user = await this.usersService.create(null, {
        ...restDto,
        email: dto.email,
        status: StatusEnum.IN_ACTIVE,
      });

      const hash = await this.jwtService.signAsync(
        {
          confirmEmailUserId: user.id,
        },
        {
          secret: this.configService.getOrThrow("auth.confirmEmailSecret", {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow("auth.confirmEmailExpires", {
            infer: true,
          }),
        },
      );

      try {
        console.log("Attempting to send signup email to:", dto.email);
        await this.mailService.userSignUp({
          to: dto.email,
          data: {
            hash,
          },
        });
        console.log("Email sent successfully");
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        throw new Error("Failed to send confirmation email");
      }

      delete user.password;
      const returnObject = {
        user: user,
        hash: hash,
      };

      return returnObject;
    } catch (e) {
      console.error("Error in register function:", e);
      if (e instanceof UnprocessableEntityException) {
        throw e;
      } else if (e.message === "Failed to send confirmation email") {
        throw new InternalServerErrorException(
          "Failed to send confirmation email",
        );
      } else {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            user: "userNotCreated",
          },
        });
      }
    }
  }
  async confirmEmail(hash: string): Promise<void> {
    let userId: User["id"];

    try {
      const jwtData = await this.jwtService.verifyAsync<{
        confirmEmailUserId: User["id"];
      }>(hash, {
        secret: this.configService.getOrThrow("auth.confirmEmailSecret", {
          infer: true,
        }),
      });

      userId = jwtData.confirmEmailUserId;
    } catch {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          hash: `invalidHash`,
        },
      });
    }

    const user = await this.usersService.findById(userId);

    if (!user || user?.status?.toString() !== StatusEnum.IN_ACTIVE.toString()) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: `notFound`,
      });
    }

    user.status = StatusEnum.ACTIVE;

    await this.usersService.update(null, user.id, user);
  }

  async confirmNewEmail(hash: string): Promise<void> {
    let userId: User["id"];
    let newEmail: User["email"];

    try {
      const jwtData = await this.jwtService.verifyAsync<{
        confirmEmailUserId: User["id"];
        newEmail: User["email"];
      }>(hash, {
        secret: this.configService.getOrThrow("auth.confirmEmailSecret", {
          infer: true,
        }),
      });

      userId = jwtData.confirmEmailUserId;
      newEmail = jwtData.newEmail;
    } catch {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          hash: `invalidHash`,
        },
      });
    }

    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: `notFound`,
      });
    }

    user.email = newEmail;
    user.status = StatusEnum.ACTIVE;

    await this.usersService.update(null, user.id, user);
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          email: "emailNotExists",
        },
      });
    }

    const tokenExpiresIn = this.configService.getOrThrow("auth.forgotExpires", {
      infer: true,
    });

    const tokenExpires = Date.now() + ms(tokenExpiresIn);

    const hash = await this.jwtService.signAsync(
      {
        forgotUserId: user.id,
      },
      {
        secret: this.configService.getOrThrow("auth.forgotSecret", {
          infer: true,
        }),
        expiresIn: tokenExpiresIn,
      },
    );

    await this.mailService.forgotPassword({
      to: email,
      data: {
        hash,
        tokenExpires,
      },
    });
  }

  async resetPassword(hash: string, password: string): Promise<void> {
    let userId: User["id"];

    try {
      const jwtData = await this.jwtService.verifyAsync<{
        forgotUserId: User["id"];
      }>(hash, {
        secret: this.configService.getOrThrow("auth.forgotSecret", {
          infer: true,
        }),
      });

      userId = jwtData.forgotUserId;
    } catch {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          hash: `invalidHash`,
        },
      });
    }

    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          hash: `notFound`,
        },
      });
    }

    user.password = password;

    await this.sessionService.deleteByUserId({
      userId: user.id,
    });

    await this.usersService.update(null, user.id, user);
  }

  async me(userJwtPayload: JwtPayloadType): Promise<NullableType<User>> {
    return this.usersService.findById(userJwtPayload.id);
  }

  async update(
    userJwtPayload: JwtPayloadType,
    userDto: AuthUpdateDto,
  ): Promise<NullableType<User>> {
    const currentUser = await this.usersService.findById(userJwtPayload.id);

    if (!currentUser) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          user: "userNotFound",
        },
      });
    }

    if (userDto.password) {
      if (!userDto.oldPassword) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            oldPassword: "missingOldPassword",
          },
        });
      }

      if (!currentUser.password) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            oldPassword: "incorrectOldPassword",
          },
        });
      }

      const isValidOldPassword = await bcrypt.compare(
        userDto.oldPassword,
        currentUser.password,
      );

      if (!isValidOldPassword) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            oldPassword: "incorrectOldPassword",
          },
        });
      } else {
        await this.sessionService.deleteByUserIdWithExclude({
          userId: currentUser.id,
          excludeSessionId: userJwtPayload.sessionId,
        });
      }
    }

    if (userDto.email && userDto.email !== currentUser.email) {
      const userByEmail = await this.usersService.findByEmail(userDto.email);

      if (userByEmail && userByEmail.id !== currentUser.id) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: "emailExists",
          },
        });
      }

      const hash = await this.jwtService.signAsync(
        {
          confirmEmailUserId: currentUser.id,
          newEmail: userDto.email,
        },
        {
          secret: this.configService.getOrThrow("auth.confirmEmailSecret", {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow("auth.confirmEmailExpires", {
            infer: true,
          }),
        },
      );

      await this.mailService.confirmNewEmail({
        to: userDto.email,
        data: {
          hash,
        },
      });
    }

    delete userDto.email;
    delete userDto.oldPassword;

    await this.usersService.update(null, userJwtPayload.id, userDto);

    return this.usersService.findById(userJwtPayload.id);
  }

  async refreshToken(
    data: Pick<JwtRefreshPayloadType, "sessionId" | "hash">,
  ): Promise<Omit<LoginResponseDto, "user">> {
    const session = await this.sessionService.findById(data.sessionId);

    if (!session) {
      throw new UnauthorizedException();
    }

    if (session.hash !== data.hash) {
      throw new UnauthorizedException();
    }

    const hash = crypto
      .createHash("sha256")
      .update(randomStringGenerator())
      .digest("hex");

    const user = await this.usersService.findById(session.user.id);

    if (!user?.role) {
      throw new UnauthorizedException();
    }

    await this.sessionService.update(session.id, {
      hash,
    });

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: session.user.id,
      role: {
        id: user.role.id,
      },
      sessionId: session.id,
      hash,
    });

    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }

  async softDelete(user: User): Promise<void> {
    await this.usersService.remove(null, user.id);
  }

  async logout(data: Pick<JwtRefreshPayloadType, "sessionId">) {
    const sessionHash = await this.sessionService.findById(data.sessionId);

    if (!sessionHash) {
      throw new UnauthorizedException();
    }

    await this.redisService.set(
      `${redisConstants.BLACKLIST_PREFIX}:${data.sessionId}`,
      `${sessionHash.hash}`,
      "EX",
      30 * 24 * 60 * 60, // 30 days
    );

    return this.sessionService.deleteById(data.sessionId);
  }

  private async getTokensData(data: {
    id: User["id"];
    role: User["role"];
    sessionId: Session["id"];
    hash: Session["hash"];
    permissions?: string[];
  }) {
    const tokenExpiresIn = this.configService.getOrThrow("auth.expires", {
      infer: true,
    });

    const tokenExpires = Date.now() + ms(tokenExpiresIn);

    const [token, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          id: data.id,
          role: data.role,
          sessionId: data.sessionId,
        },
        {
          secret: this.configService.getOrThrow("auth.secret", { infer: true }),
          expiresIn: tokenExpiresIn,
        },
      ),
      await this.jwtService.signAsync(
        {
          sessionId: data.sessionId,
          hash: data.hash,
        },
        {
          secret: this.configService.getOrThrow("auth.refreshSecret", {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow("auth.refreshExpires", {
            infer: true,
          }),
        },
      ),
    ]);

    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }
}
