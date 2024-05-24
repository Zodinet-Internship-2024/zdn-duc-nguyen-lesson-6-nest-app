import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [JwtModule, UserModule],
})
export class ProductsModule {}
