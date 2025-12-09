import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module'; // Ajusta la ruta a tu AppModule
import { RolesService } from '../modules/roles/roles.service'; // Ajusta la ruta a tu RolesService

async function bootstrap() {
  // 1. Crear una instancia de la aplicación Nest
  const app = await NestFactory.createApplicationContext(AppModule);

  // 2. Obtener una instancia del servicio RolesService
  const rolesService = app.get(RolesService);

  try {
    console.log('--- Iniciando Role Seeder ---');
    
    // 3. Ejecutar el método seeder
    const result = await rolesService.seedRoles();

    console.log(`✅ Seeding completado. Insertados: ${result.inserted} de ${result.total}`);
    
  } catch (error) {
    console.error('❌ Error fatal durante el seeder:', error);
    
  } finally {
    // 4. Cerrar la aplicación Nest para liberar recursos
    await app.close();
    process.exit(0); // Terminar el proceso exitosamente
  }
}

bootstrap();