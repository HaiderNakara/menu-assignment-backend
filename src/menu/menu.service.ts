import { Injectable, NotFoundException } from '@nestjs/common';
import { MenuItem, Prisma } from '@prisma/client';
import { CreateMenuItemDto } from './dto/create-menu.dto';
import { UpdateMenuItemDto } from './dto/update-menu.dto';
import { PrismaService } from 'prisma.service';

@Injectable()
export class MenuItemService {
  constructor(private prisma: PrismaService) { }

  async create(data: CreateMenuItemDto): Promise<MenuItem> {
    try {
      // If parentId is provided, verify it exists first
      if (data.parentId) {
        const parentItem = await this.prisma.menuItem.findUnique({
          where: { id: data.parentId },
        });

        if (!parentItem) {
          throw new NotFoundException(`Parent menu item with ID ${data.parentId} not found`);
        }
      }
      return this.prisma.menuItem.create({
        data: {
          name: data.name,
          parentId: data.parentId,
          depth: data.depth,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<MenuItem[]> {
    return this.prisma.menuItem.findMany({
      include: {
        children: true,
      },
    });
  }

  async findOne(id: string): Promise<MenuItem> {
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id },
      include: {
        children: true,
      },
    });

    if (!menuItem) {
      throw new NotFoundException(`Menu item with ID ${id} not found`);
    }

    return menuItem;
  }

  async update(id: string, data: UpdateMenuItemDto): Promise<MenuItem> {
    try {
      return await this.prisma.menuItem.update({
        where: { id },
        data: {
          name: data.name,
          parent: data.parentId ? {
            connect: { id: data.parentId }
          } : undefined,
          depth: data.depth,
        },
        include: {
          children: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Menu item with ID ${id} not found`);
        }
      }
      throw error;
    }
  }

  async remove(id: string): Promise<MenuItem> {
    try {
      return await this.prisma.menuItem.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Menu item with ID ${id} not found`);
        }
      }
      throw error;
    }
  }

  async getMenuTree(): Promise<MenuItem[]> {
    // Helper function to recursively include all children
    const includeChildren = (depth: number = 10): any => ({
      children: {
        include: depth > 0 ? includeChildren(depth - 1) : false
      }
    });

    const rootItems = await this.prisma.menuItem.findMany({
      where: {
        parentId: null,
      },
      include: includeChildren(),
    });

    return rootItems;
  }
}
