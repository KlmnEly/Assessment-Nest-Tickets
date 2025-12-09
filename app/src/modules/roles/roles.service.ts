import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}
  // Create a new role
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    try {
      // find if role with the same name exists
      const existingRole = await this.roleRepository.findOne({
        where: { name: createRoleDto.name },
      });

      if (existingRole) {
        throw new ConflictException(`Role with Name "${createRoleDto.name}" already exists.`);
      }

      const newRole = this.roleRepository.create(createRoleDto);
      return await this.roleRepository.save(newRole);
      
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      throw new InternalServerErrorException('Error creating role.');
    }
  }

  // Get all roles including soft-deleted ones
  async getAll() {
    try {
      const roles = await this.roleRepository.find();

      if (!roles || roles.length === 0) {
        throw new NotFoundException('No roles found.');
      }

      return roles;
    } catch (err: any) {
      if (err.response?.statusCode) throw err;
      throw new InternalServerErrorException('Error fetching roles.');
    }
  }

    // Get role by ID
  async getById(id: number) {
    if (!id || id <= 0) {
      throw new BadRequestException('A valid id is required.');
    }

    try {
      const roles = await this.roleRepository.findOne({
        where: {
          id_role: id
        },
      });

      if (!roles) {
        throw new NotFoundException(`Role with id ${id} not found.`);
      }

      return roles;
    } catch (err: any) {
      if (err.response?.statusCode) throw err;
      throw new InternalServerErrorException('Error fetching role by id.');
    }
  }
}
