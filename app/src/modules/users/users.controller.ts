import { Controller, UseGuards, ParseIntPipe, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('users')
// Apply both JWT authentication and role authorization guards
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}


  @Get()
  @Roles(Role.Admin)
  getAll() {
    return this.usersService.getAll();
  }

  @Get(':id')
  @Roles(Role.Admin)
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getById(+id);
  }

  @Get('email/:email')
  getByUsername(@Param('email') email: string) {
    return this.usersService.getByEmail(email);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(+id);
  }
}
