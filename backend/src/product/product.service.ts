import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Product } from '@prisma/client';
import { UpdateProductDto } from './dto/update-product.dto';
import { unlink } from 'fs/promises';
import path from 'path';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const product = await this.prisma.product.create({
      data: {
        ...dto,
      },
    });
    return product;
  }

  async findAll(): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return products;
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
    });
    if (!product) throw new NotFoundException();
    return product;
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const existProduct = await this.prisma.product.findUnique({
      where: {
        id,
      },
    });
    if (!existProduct) throw new NotFoundException('Продукт не найден!');

    if (dto.image) {
      try {
        await unlink(path.join(process.cwd(), existProduct.image));
      } catch (err) {
        console.log('Ошибка удаление старой изображении продукта', err);
      }
    }
    const updateProduct = await this.prisma.product.update({
      where: {
        id,
      },
      data: dto,
    });
    return updateProduct;
  }

  async delete(id: number): Promise<boolean> {
    await this.prisma.product.delete({
      where: {
        id: id,
      },
    });
    return true;
  }
}
