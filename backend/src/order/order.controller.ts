import { Controller, Get, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { Authorization } from 'src/auth/decorators/authorization.decorator';
import { Authorized } from 'src/auth/decorators/autorized.decorator';

@Authorization()
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  getOrders(@Authorized('id') id: number) {
    return this.orderService.getOrders(id);
  }

  @Post('create')
  createOrders(@Authorized('id') id: number) {
    return this.orderService.createOrder(id);
  }
}
