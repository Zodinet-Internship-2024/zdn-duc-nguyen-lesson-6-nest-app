import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [JwtModule, UserModule],
})
export class CategoriesModule {}
