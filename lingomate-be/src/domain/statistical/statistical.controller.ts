import { PermissionGuard } from "@/guards/permission.guard";
import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiParam, ApiTags } from "@nestjs/swagger";
import { StatisticalService } from "./statistical.service";
import { Public } from "@/utils/decorators/public.decorator";
import { Request, Response } from "express";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { Roles } from "@/utils/decorators/roles.decorator";
import { RoleEnum } from "@/common/enums/roles.enum";

@ApiTags("Statistical")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller("statistical")
export class StatisticalController {
  constructor(private readonly statisticalService: StatisticalService) {}

  @Public()
  @Get("/hc")
  healthCheck(@Req() req: Request, @Res() res: Response) {
    res.status(200).json({ message: "Statistical service is up" });
  }

  @Roles(RoleEnum.admin, RoleEnum.staff)
  @ApiParam({
    name: "year",
    required: true,
    description: "Year to get revenue statistics",
    type: Number,
    example: 2024,
  })
  @Get("/revenue/:year")
  async getRevenueStatistics(@Req() req: Request, @Res() res: Response) {
    try {
      const result = await this.statisticalService.getRevenueStatistics(req);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
