// src/modules/category/category.service.ts

import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { name } = createCategoryDto;

    try {
      const existingCategory = await this.categoryRepository.findOneBy({ name });
      if (existingCategory) {
        throw new ConflictException(`Category with name "${name}" already exists.`);
      }

      const newCategory = this.categoryRepository.create(createCategoryDto);
      return await this.categoryRepository.save(newCategory);

    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Error creating category.');
    }
  }

  async findAll(): Promise<Category[]> {
    try {
      const categories = await this.categoryRepository.find();
      if (!categories || categories.length === 0) {
        throw new NotFoundException('No categories found.');
      }
      return categories;
    } catch (err: any) {
      if (err.response?.statusCode) throw err;
      throw new InternalServerErrorException('Error fetching categories.');
    }
  }

  async findOne(id: number): Promise<Category> {
    if (!id || id <= 0) {
        throw new BadRequestException('A valid ID is required.');
    }

    try {
        const category = await this.categoryRepository.findOneBy({ id_category: id });

        if (!category) {
            throw new NotFoundException(`Category with id ${id} not found.`);
        }
        return category;
    } catch (err: any) {
        if (err.response?.statusCode) throw err;
        throw new InternalServerErrorException('Error fetching category by id.');
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    if (!id || id <= 0) {
        throw new BadRequestException('A valid ID is required for update.');
    }
    if (Object.keys(updateCategoryDto).length === 0) {
        throw new BadRequestException('No data provided to update.');
    }

    try {
        const result = await this.categoryRepository.update(
            { id_category: id }, 
            updateCategoryDto  
        );

        if (result.affected === 0) {
            throw new NotFoundException(`Category with ID ${id} not found.`);
        }

        return await this.categoryRepository.findOneByOrFail({ id_category: id });

    } catch (error) {
        if (error instanceof NotFoundException || error instanceof BadRequestException) {
            throw error;
        }
        if (error.code === '23505') { 
            throw new ConflictException('The name provided is already in use by another category.');
        }
        throw new InternalServerErrorException(`Error updating category with ID ${id}.`);
    }
  }

  async remove(id: number): Promise<void> {
    if (!id || id <= 0) {
        throw new BadRequestException('A valid ID is required for deletion.');
    }
    
    try {
        const result = await this.categoryRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Category with ID ${id} not found.`);
        }
    } catch (err: any) {
        if (err.response?.statusCode) throw err;
        throw new InternalServerErrorException(`Error deleting category with ID ${id}.`);
    }
  }
}