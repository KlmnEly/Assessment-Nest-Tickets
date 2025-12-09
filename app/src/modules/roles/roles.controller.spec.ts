// src/modules/roles/roles.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './entities/role.entity'; // Asegúrate de que la ruta sea correcta

// --- MOCK SETUP ---
// 1. Definir un objeto mock para el servicio, simulando sus métodos.
const mockRolesService = {
  create: jest.fn(),
  getAll: jest.fn(),
  getById: jest.fn(),
};

// 2. Definir datos de prueba.
const mockRole: Role = {
  id_role: 1,
  name: 'Admin',
  description: 'System Administrator',
  users: [] as any, 
};

const mockCreateRoleDto: CreateRoleDto = {
  name: 'Editor',
  description: 'Can edit content',
};

describe('RolesController', () => {
  let controller: RolesController;
  let service: RolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        // Proveer el mock del servicio en lugar del servicio real
        {
          provide: RolesService,
          useValue: mockRolesService,
        },
      ],
    }).compile();

    controller = module.get<RolesController>(RolesController);
    service = module.get<RolesService>(RolesService);
  });

  // Test 1: Comprobar que el controlador está definido
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // --- CREATE METHOD TESTS (POST /roles) ---
  describe('create', () => {
    // Test 2: Verifica que el controlador llama al método create del servicio
    it('should call rolesService.create and return the created role', async () => {
      // Configurar el mock para que devuelva un valor simulado
      jest.spyOn(service, 'create').mockResolvedValue(mockRole);

      const result = await controller.create(mockCreateRoleDto);

      // 1. Verificar que el método del servicio fue llamado con los datos correctos
      expect(service.create).toHaveBeenCalledWith(mockCreateRoleDto);
      // 2. Verificar que el controlador retorna lo que el servicio devuelve
      expect(result).toEqual(mockRole);
    });
  });

  // --- FIND ALL METHOD TESTS (GET /roles) ---
  describe('findAll', () => {
    // Test 3: Verifica que el controlador llama al método getAll del servicio
    it('should call rolesService.getAll and return an array of roles', async () => {
      const mockRolesArray = [mockRole, { ...mockRole, id_role: 2, name: 'Customer' }];
      // Configurar el mock para que devuelva una lista de roles
      jest.spyOn(service, 'getAll').mockResolvedValue(mockRolesArray);

      const result = await controller.findAll();

      // 1. Verificar que el método del servicio fue llamado
      expect(service.getAll).toHaveBeenCalled();
      // 2. Verificar que el controlador retorna la lista
      expect(result).toEqual(mockRolesArray);
    });
  });

  // --- FIND ONE METHOD TESTS (GET /roles/:id) ---
  describe('findOne', () => {
    const roleId = 1;
    
    // Test 4: Verifica que el controlador llama al método getById del servicio
    it('should call rolesService.getById and return a single role', async () => {
      // Configurar el mock para que devuelva un rol específico
      jest.spyOn(service, 'getById').mockResolvedValue(mockRole);

      const result = await controller.findOne(roleId);

      // 1. Verificar que el método del servicio fue llamado con el ID parseado
      // Nota: El ParseIntPipe convierte la cadena a número antes de que llegue aquí.
      // En tu código usaste getById(+id); que es redundante si usas ParseIntPipe
      // Lo importante es que el servicio sea llamado con el número.
      expect(service.getById).toHaveBeenCalledWith(roleId);
      // 2. Verificar que el controlador retorna el rol
      expect(result).toEqual(mockRole);
    });
  });
});