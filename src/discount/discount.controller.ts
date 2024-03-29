import { DiscountService } from './discount.service';
import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateDiscountDto } from './discount.dto';

@Controller('discount')
export class DiscountController {
  constructor(private discountService: DiscountService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  async createDiscount(@Body() data: CreateDiscountDto) {
    const result = this.discountService.create(data);
    return result;
  }
}
