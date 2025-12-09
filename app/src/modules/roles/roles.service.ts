import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { INITIAL_ROLES } from 'src/database/seeders/initial-roles';
@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  // --- Seeder ---
  async seedRoles(): Promise<{ inserted: number, total: number }> {
    let insertedCount = 0;

    console.log('--- Starting Role Seeder ---');

    for (const roleData of INITIAL_ROLES) {
      try {
        const existingRole = await this.roleRepository.findOne({
          where: { name: roleData.name },
        });

        if (!existingRole) {
          const newRole = this.roleRepository.create(roleData);
          await this.roleRepository.save(newRole);
          insertedCount++;
          console.log(`[SEED] Rol created: ${roleData.name}`);
        } else {
          console.log(`[SKIP] Rol already exist: ${roleData.name}`);
        }

      } catch (error) {
        console.error(`Error trying seed ${roleData.name}:`, error.message);
      }
    }

    console.log(`--- Seeding de Roles finalizado. Insertados: ${insertedCount} de ${INITIAL_ROLES.length} ---`);
    return { inserted: insertedCount, total: INITIAL_ROLES.length };
  }

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
