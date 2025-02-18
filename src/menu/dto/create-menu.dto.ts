import { ApiProperty } from "@nestjs/swagger";

export class CreateMenuItemDto {
  @ApiProperty({ description: 'The name of the menu item' })
  name: string;
  @ApiProperty({ description: 'The parent ID of the menu item' })
  parentId?: string;
  @ApiProperty({ description: 'The depth of the menu item' })
  depth: number;
}

