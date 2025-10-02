// src/modules/cart/cart.controller.ts
import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { CartService } from './cart.service';
import { Authorization } from 'src/auth/decorators/authorization.decorator';
import { Authorized } from 'src/auth/decorators/autorized.decorator';

@Authorization()
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Authorized('id') id: number) {
    return this.cartService.getCart(id);
  }
  @Post('add')
  addToCart(
    @Authorized('id') id: string,
    @Body() body: { productId: number; quantity?: number },
  ) {
    return this.cartService.addToCart(+id, {
      productId: body.productId,
      quantity: body.quantity || 1,
    });
  }

  @Delete('item/:id')
  removeItem(@Authorized('id') id: string, @Param('id') itemId: string) {
    return this.cartService.removeItem(+id, +itemId);
  }

  @Delete('clear')
  clearCart(@Authorized('id') id: string) {
    return this.cartService.clearCart(+id);
  }
}
