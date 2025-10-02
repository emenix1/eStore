import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrders(userId: number) {
    const orders = await this.prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                price: true,
                image: true,
              },
            },
          },
        },
      },
    });
    return orders;
  }

  async createOrder(userId: number) {
    const cart = await this.prisma.cart.findUnique({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    console.log(cart);
    if (!cart) {
      throw new NotFoundException('Нет такой корзины!');
    }

    const total = cart.items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0,
    );

    await this.prisma.order.create({
      data: {
        userId,
        total,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
    });
    await this.prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });
    return true;
  }
}
