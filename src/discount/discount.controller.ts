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
} from '@nestjs/common';
import {
  ApplyDiscountDto,
  CreateDiscountDto,
  UpdateDiscountDto,
} from './discount.dto';

@Controller('discount')
export class DiscountController {
  constructor(private discountService: DiscountService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  async createDiscount(@Body() data: CreateDiscountDto) {
    const result = this.discountService.create(data);
    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async getAllDiscount() {
    const result = this.discountService.getAll();
    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getDiscount(@Param('id') id: number) {
    const result = this.discountService.get(id);
    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async deleteDiscount(@Param('id') id: number) {
    const result = this.discountService.delete(id);
    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() data: UpdateDiscountDto) {
    const result = this.discountService.update(id, data);
    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Post('apply-discount/:id')
  async applyDiscount(@Param('id') id: number, @Body() data: ApplyDiscountDto) {
    const result = this.discountService.applyDiscount(id, data.userId);
    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Get('remaining/:discountId/user/:userId')
  async remaining(
    @Param('discountId') discountId: number,
    @Param('userId') userId: number,
  ) {
    const number = await this.discountService.userDiscountQuota(
      discountId,
      userId,
    );
    return {
      userId: userId,
      discountId: discountId,
      remaining: number,
    };
  }
}
