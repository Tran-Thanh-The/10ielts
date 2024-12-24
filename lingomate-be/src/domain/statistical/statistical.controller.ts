import { RoleEnum } from "@/common/enums/roles.enum";
import { PermissionGuard } from "@/guards/permission.guard";
import { Public } from "@/utils/decorators/public.decorator";
import { Roles } from "@/utils/decorators/roles.decorator";
import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { StatisticalService } from "./statistical.service";

@ApiTags("Statistical")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller("v1/statistical")
export class StatisticalController {
  constructor(private readonly statisticalService: StatisticalService) {}

  @Public()
  @Get("/hc")
  healthCheck(@Req() req: Request, @Res() res: Response) {
    res.status(200).json({ message: "Statistical service is up" });
  }

  @Roles(RoleEnum.admin, RoleEnum.staff)
  @ApiQuery({
    name: "year",
    required: true,
    description: "Year to get revenue statistics",
    type: Number,
    example: 2024,
  })
  @Get("/revenue")
  async getRevenueStatistics(@Req() req: Request, @Res() res: Response) {
    try {
      const result = await this.statisticalService.getRevenueStatistics(req);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  @Roles(RoleEnum.admin, RoleEnum.staff)
  @ApiQuery({
    name: "year",
    required: true,
    description: "Year to get student register courses statistics",
    type: Number,
    example: 2024,
  })
  @Get("/student-register-courses")
  async getStudentRegisterCoursesStatistics(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const result =
        await this.statisticalService.getStudentRegisterCoursesStatistics(req);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  @Roles(RoleEnum.admin, RoleEnum.staff)
  @ApiQuery({
    name: "year",
    required: true,
    description: "Year to get all courses register statistics",
    type: Number,
    example: 2024,
  })
  @Get("/all-courses-register-statistics")
  async getAllCoursesRegisterStatistics(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const result =
        await this.statisticalService.getAllCoursesRegisterStatistics(req);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  @Roles(RoleEnum.admin, RoleEnum.staff)
  @ApiQuery({
    name: "year",
    required: true,
    description: "Year to get monthly courses register statistics",
    type: Number,
    example: 2024,
  })
  @ApiQuery({
    name: "month",
    required: false,
    description: "Month to get monthly courses register statistics",
    type: Number,
    example: 1,
  })
  @Get("/monthly-courses-register-statistics")
  async getMonthlyCoursesRegisterStatistics(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const result =
        await this.statisticalService.getMonthlyCoursesRegisterStatistics(req);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
