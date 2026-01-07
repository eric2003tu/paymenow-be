import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],  // Add this line
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}