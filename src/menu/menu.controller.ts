import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MenuItemService } from './menu.service';
import { CreateMenuItemDto } from './dto/create-menu.dto';
import { UpdateMenuItemDto } from './dto/update-menu.dto';

@Controller('menu-items')
export class MenuItemController {
  constructor(private readonly menuItemService: MenuItemService) { }

  @Post()
  create(@Body() createMenuItemDto: CreateMenuItemDto) {
    return this.menuItemService.create(createMenuItemDto);
  }

  @Get()
  findAll() {
    return this.menuItemService.findAll();
  }

  @Get('tree')
  getMenuTree() {
    return this.menuItemService.getMenuTree();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuItemService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMenuItemDto: UpdateMenuItemDto,
  ) {
    return this.menuItemService.update(id, updateMenuItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuItemService.remove(id);
  }
}
