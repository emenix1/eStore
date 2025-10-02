import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Patch,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Authorization } from 'src/auth/decorators/authorization.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Authorization()
  @Roles(Role.ADMIN)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  upload(
    @UploadedFile()
    image: Express.Multer.File,
    @Body() body: CreateProductDto,
  ) {
    const imagePath = `/uploads/${image.filename}`;
    return this.productService.create({ ...body, image: imagePath });
  }

  @Authorization()
  @Roles(Role.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.productService.findOne(id);
  }

  @Authorization()
  @Roles(Role.ADMIN)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @UploadedFile()
    image: Express.Multer.File | undefined,
    @Body() body: UpdateProductDto,
    @Param('id') id: number,
  ) {
    let imagePath: string | undefined;
    if (image) {
      imagePath = `/uploads/${image.filename}`;
    }

    const updateData: UpdateProductDto = {
      ...body,
      ...(imagePath && { image: imagePath }),
    };
    return this.productService.update(id, updateData);
  }

  @Authorization()
  @Roles(Role.ADMIN)
  @Delete('delete/:id')
  remove(@Param('id') id: number) {
    return this.productService.delete(id);
  }
}
