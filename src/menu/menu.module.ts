import { Module } from '@nestjs/common';
import { MenuItemController } from './menu.controller';
import { MenuItemService } from './menu.service';
import { PrismaService } from 'prisma.service';

@Module({
  controllers: [MenuItemController],
  providers: [MenuItemService, PrismaService],
})
export class MenuModule { }
