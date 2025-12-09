// src/modules/roles/roles.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity'; 
import { CreateRoleDto } from './dto/create-role.dto';
import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';

// --- MOCK SETUP ---
// Define a mock repository object with methods used by RolesService
const mockRoleRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
};

// Define mock data
const mockRole: Role = { 
    id_role: 1, 
    name: 'Customer', 
    description: 'Default role for customers',
    users: [] as any // Mock relation
};

const mockCreateRoleDto: CreateRoleDto = { 
    name: 'Technician', 
    description: 'Users who resolve tickets' 
};

describe('RolesService', () => {
  let service: RolesService;
  let repository: Repository<Role>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        // Provide the mock repository instead of the real TypeORM repository
        {
          provide: getRepositoryToken(Role),
          useValue: mockRoleRepository,
        },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    repository = module.get<Repository<Role>>(getRepositoryToken(Role));
  });

  // Test 1: Check if the service is defined
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- CREATE METHOD TESTS ---
  describe('create', () => {
    // Test 2: Successful creation of a new role
    it('should successfully create a role if it does not exist', async () => {
      // Setup mock returns for the scenario:
      // 1. findOne returns null (role does not exist)
      // 2. create returns the DTO as a new entity
      // 3. save returns the final saved entity
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'create').mockReturnValue(mockRole);
      jest.spyOn(repository, 'save').mockResolvedValue(mockRole);

      const result = await service.create(mockCreateRoleDto);
      
      // Assertions
      expect(repository.findOne).toHaveBeenCalledWith({ where: { name: mockCreateRoleDto.name } });
      expect(repository.create).toHaveBeenCalledWith(mockCreateRoleDto);
      expect(repository.save).toHaveBeenCalledWith(mockRole);
      expect(result).toEqual(mockRole);
    });

    // Test 3: Conflict exception when the role already exists
    it('should throw a ConflictException if the role already exists', async () => {
      // Setup mock returns for the scenario:
      // 1. findOne returns the existing role
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockRole);

      // We expect the function call to reject/throw the specific exception
      await expect(service.create(mockCreateRoleDto)).rejects.toThrow(ConflictException);
      await expect(service.create(mockCreateRoleDto)).rejects.toThrow(`Role with Name "${mockCreateRoleDto.name}" already exists.`);
    });
    
    // Test 4: Internal server error on database failure
    it('should throw InternalServerErrorException on database error', async () => {
        // Setup mock returns for the scenario:
        // 1. findOne succeeds
        // 2. save fails with a generic error (not ConflictException)
        jest.spyOn(repository, 'findOne').mockResolvedValue(null);
        jest.spyOn(repository, 'create').mockReturnValue(mockRole);
        jest.spyOn(repository, 'save').mockRejectedValue(new Error('DB connection lost'));
  
        await expect(service.create(mockCreateRoleDto)).rejects.toThrow('Error creating role.');
        await expect(service.create(mockCreateRoleDto)).rejects.toThrow(new Error('Error creating role.'));
      });
  });

  // --- GET ALL METHOD TESTS ---
  describe('getAll', () => {
    // Test 5: Successful retrieval of roles
    it('should return an array of roles', async () => {
      // Setup: find returns an array of roles
      const mockRolesArray = [mockRole, { ...mockRole, id_role: 2, name: 'Admin' }];
      jest.spyOn(repository, 'find').mockResolvedValue(mockRolesArray);

      const result = await service.getAll();
      
      // Assertions
      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(mockRolesArray);
      expect(result.length).toBe(2);
    });

    // Test 6: NotFoundException when no roles are found
    it('should throw NotFoundException if no roles are found', async () => {
      // Setup: find returns an empty array
      jest.spyOn(repository, 'find').mockResolvedValue([]);

      // Expect the function call to reject/throw NotFoundException
      await expect(service.getAll()).rejects.toThrow(NotFoundException);
      await expect(service.getAll()).rejects.toThrow('No roles found.');
    });
  });

  // --- GET BY ID METHOD TESTS ---
  describe('getById', () => {
    // Test 7: Successful retrieval by ID
    it('should return a single role when found by id', async () => {
      // Setup: findOne returns the mock role
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockRole);

      const result = await service.getById(1);
      
      // Assertions
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id_role: 1 } });
      expect(result).toEqual(mockRole);
    });

    // Test 8: NotFoundException when ID is not found
    it('should throw NotFoundException if the role is not found', async () => {
      // Setup: findOne returns null
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      // Expect the function call to reject/throw NotFoundException
      await expect(service.getById(99)).rejects.toThrow(NotFoundException);
      await expect(service.getById(99)).rejects.toThrow('Role with id 99 not found.');
    });

    // Test 9: BadRequestException when ID is invalid
    it('should throw BadRequestException if the ID is invalid (<= 0)', async () => {
      // Expect the function call to reject/throw BadRequestException for invalid input
      await expect(service.getById(0)).rejects.toThrow(BadRequestException);
      await expect(service.getById(0)).rejects.toThrow('A valid id is required.');
    });
  });
});