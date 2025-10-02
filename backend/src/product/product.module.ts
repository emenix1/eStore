import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { extname, join } from 'path';
import { diskStorage } from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads'),
        filename: (
          req: Express.Request,
          image: Express.Multer.File,
          callback: (error: Error | null, filename: string) => void,
        ) => {
          const uniquePart = Date.now() + '-' + Math.round(Math.random() * 1e6);
          const fileExt = extname(image.originalname);
          const filename = `${uniquePart}${fileExt}`;
          callback(null, filename);
        },
      }),
    }),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
