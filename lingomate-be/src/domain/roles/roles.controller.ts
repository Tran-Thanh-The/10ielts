import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from "@/utils/dto/infinity-pagination-response.dto";
import { infinityPagination } from "@/utils/infinity-pagination";
import { PermissionGuard } from "@/guards/permission.guard";
import { Permissions } from "@/utils/decorators/permission.decorator";
import { PermissionEnum } from "@/common/enums/permissions.enum";
import { RolesService } from "./roles.service";
import { Role } from "./domain/role";
import { CreateRoleDto } from "./dto/create-role.dto";
import { FindAllRolesDto } from "./dto/find-all-roles.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";

@ApiTags("Roles")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"), PermissionGuard)
@Controller({
  path: "roles",
  version: "1",
})
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Permissions(PermissionEnum.CREATE_ROLE)
  @ApiCreatedResponse({
    type: Role,
  })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @Permissions(PermissionEnum.READ_ROLE)
  @ApiOkResponse({
    type: InfinityPaginationResponse(Role),
  })
  async findAll(
    @Query() query: FindAllRolesDto,
  ): Promise<InfinityPaginationResponseDto<Role>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.rolesService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Get(":id")
  @Permissions(PermissionEnum.READ_ROLE)
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Role,
  })
  findOne(@Param("id") id: string) {
    return this.rolesService.findOne(Number(id));
  }

  @Patch(":id")
  @Permissions(PermissionEnum.UPDATE_ROLE)
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Role,
  })
  update(
    @Param("id") id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.rolesService.update(Number(id), updateRoleDto);
  }

  @Delete(":id")
  @Permissions(PermissionEnum.DELETE_ROLE)
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  remove(@Param("id") id: string) {
    return this.rolesService.remove(Number(id));
  }
}
