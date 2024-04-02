import { DiscountService } from './discount.service';
import {
  Body,
  Controller,
  Patch,
  Post,
  Delete,
  Get,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApplyDiscountDto,
  CreateDiscountDto,
  UpdateDiscountDto,
} from './discount.dto';
import { Roles } from 'src/roles/roles.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';

@Controller('discount')
export class DiscountController {
  constructor(private discountService: DiscountService) {}

  @Roles(['admin'])
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Post()
  async createDiscount(@Body() data: CreateDiscountDto) {
    const result = await this.discountService.create(data);
    return result;
  }

  @Roles(['user', 'admin'])
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get()
  async getAllDiscount() {
    const result = this.discountService.getAll();
    return result;
  }

  @Roles(['user', 'admin'])
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getDiscount(@Param('id') id: number) {
    const result = this.discountService.get(id);
    return result;
  }

  @Roles(['admin'])
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async deleteDiscount(@Param('id') id: number) {
    const result = this.discountService.delete(id);
    return result;
  }

  @Roles(['admin'])
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() data: UpdateDiscountDto) {
    const result = this.discountService.update(id, data);
    return result;
  }

  @Roles(['user', 'admin'])
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Post('apply-discount/:id')
  async applyDiscount(@Param('id') id: number, @Body() data: ApplyDiscountDto) {
    const result = this.discountService.applyDiscount(id, data.userId);
    return result;
  }

  @Roles(['user', 'admin'])
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get('remaining/user/:userId')
  async remaining(@Param('userId') userId: number, @Req() req) {
    if (req.user.roles === 'user') {
      return {
        userId: req.user.sub,
        remaining: await this.discountService.userDiscountQuota(req.user.sub),
      };
    }
    const number = await this.discountService.userDiscountQuota(userId);
    return {
      userId: userId,
      remaining: number,
    };
  }
}
