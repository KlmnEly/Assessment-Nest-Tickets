import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  // Create a new user
  async create(user: CreateUserDto) {
    try {
      const { email } = user;

    if (!user || !user.email || !user.email.trim()) {
      throw new Error('User data must be provided');
    }

    const existingUser = await this.userRepository.findOne({
        where: { email: user.email },
      });

      if (existingUser) {
        throw new ConflictException(`User with Email "${user.email}" already exists.`);
      }

       // Create and save the new user
      const newUser = this.userRepository.create(user);
      return await this.userRepository.save(newUser);
      
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      throw new InternalServerErrorException('Error creating user.');
    }

  }

  async getAll() {
    try {
      const users = await this.userRepository.find();

      if (!users || users.length === 0) {
        throw new NotFoundException('No users found.');
      }

      return users;
    } catch (err: any) {
      if (err.response?.statusCode) throw err;
      throw new InternalServerErrorException('Error fetching users.');
    }
  }

  async getById(id: number) {
    if (!id || id <= 0) {
      throw new BadRequestException('A valid id is required.');
    }

    try {
      const users = await this.userRepository.findOne({
        where: {
          id_user: id
        },
      });

      if (!users) {
        throw new NotFoundException(`Role with id ${id} not found.`);
      }

      return users;
    } catch (err: any) {
      if (err.response?.statusCode) throw err;
      throw new InternalServerErrorException('Error fetching user by id.');
    }
  }

  // Get by email
    async getByEmail(email: string) {
    if (!email || typeof email !== 'string' || !email.trim()) {
      throw new BadRequestException('A valid email is required.');
    }
    try {
      const user = await this.userRepository.findOne({
        where: {
          email: email
        }
      });

      if (!user) {
        throw new NotFoundException(`Access with name "${name}" not found.`);
      }

      return user;
    } catch (err: any) {
      if (err.response?.statusCode) throw err;
      throw new InternalServerErrorException('Error fetching user by email.');
    }
  }

  // Update user by ID
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    if (!id || id <= 0) {
      throw new BadRequestException('A valid ID is required for update.');
    }

    if (Object.keys(updateUserDto).length === 0) {
      throw new BadRequestException('No data provided to update.');
    }

    const updateData: Partial<User> = { ...updateUserDto };
    
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateUserDto.password, salt);
    }
    
    try {
      const result = await this.userRepository.update(
        { id_user: id },
        updateData 
      );

      if (result.affected === 0) {
        throw new NotFoundException(`User with ID ${id} not found.`);
      }

      const updatedUser = await this.userRepository.findOneByOrFail({ id_user: id });
      return updatedUser;

    } catch (error) {
      if (error.name === 'EntityNotFoundError') { // Manejar error de findOneOrFail
        throw new NotFoundException(`User with ID ${id} not found after update.`);
      }
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      if (error.code === '23505') { 
         throw new BadRequestException('The email provided is already in use by another user.');
      }
      console.error(error);
      throw new InternalServerErrorException(`Error updating user with ID ${id}.`);
    }
  }

  // Delete user by ID
  async remove(id: number) {
    if (!id || id <= 0) {
      throw new BadRequestException('A valid ID is required for deletion.');
    }

    try {
        const result = await this.userRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`User with ID ${id} not found.`);
        }
        
    } catch (err: any) {
        if (err.response?.statusCode) throw err;
        throw new InternalServerErrorException(`Error deleting user with ID ${id}.`);
    }
  }
}
