import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  SerializeOptions,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from "@/utils/dto/infinity-pagination-response.dto";
import { infinityPagination } from "@/utils/infinity-pagination";
import { NullableType } from "@/utils/types/nullable.type";
import { RolesGuard } from "../roles/roles.guard";
import { User } from "./domain/user";
import { QueryUserDto } from "./dto/query-user.dto";
import { RolesRestrictionGuard } from "./guards/roles.restriction.guard";
import { UsersService } from "./users.service";
import { PermissionGuard } from "@/guards/permission.guard";
import { Permissions } from "@/utils/decorators/permission.decorator";
import { PermissionEnum } from "@/common/enums/permissions.enum";

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), PermissionGuard)
@ApiTags("Users")
@Controller({
  path: "users",
  version: "1",
})
  export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    @Post()
    @UseGuards(RolesRestrictionGuard)
    @Permissions(PermissionEnum.CREATE_USER)
    @ApiCreatedResponse({
      type: User,
    })
    @SerializeOptions({
      groups: ["admin"],
    })
    @HttpCode(HttpStatus.CREATED)
    create(@Req() req, @Body() createProfileDto: CreateUserDto): Promise<User> {
      const userId = req.user.id;
      return this.usersService.create(userId, createProfileDto);
    }

  @ApiOkResponse({
    type: InfinityPaginationResponse(User),
  })
  @SerializeOptions({
    groups: ["admin"],
  })
  @Get()
  @Permissions(PermissionEnum.READ_USER)
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryUserDto,
  ): Promise<InfinityPaginationResponseDto<User>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.usersService.findManyWithPagination({
        filterOptions: query?.filters,
        sortOptions: query?.sort,
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @ApiOkResponse({
    type: User,
  })
  @SerializeOptions({
    groups: ["admin"],
  })
  @Get(":id")
  @Permissions(PermissionEnum.READ_USER)
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  findOne(@Param("id") id: User["id"]): Promise<NullableType<User>> {
    return this.usersService.findById(id);
  }

  @ApiOkResponse({
    type: User,
  })
  @SerializeOptions({
    groups: ["admin"],
  })
  @Patch(":id")
  @UseGuards(RolesRestrictionGuard)
  @Permissions(PermissionEnum.UPDATE_USER)
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  update(
    @Req() req,
    @Param("id") id: User["id"],
    @Body() updateProfileDto: UpdateUserDto,
  ): Promise<User | null> {
    const userId = req.user.id;
    return this.usersService.update(userId, id, updateProfileDto);
  }

  @Delete(":id")
  @UseGuards(RolesRestrictionGuard)
  @Permissions(PermissionEnum.DELETE_USER)
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Req() req, @Param("id") id: User["id"]): Promise<void> {
    const userId = req.user.id;
    return this.usersService.remove(userId, id);
  }
}
