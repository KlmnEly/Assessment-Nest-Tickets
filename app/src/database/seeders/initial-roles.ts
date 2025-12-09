import { CreateRoleDto } from 'src/modules/roles/dto/create-role.dto';

export const INITIAL_ROLES: CreateRoleDto[] = [
    {
        name: 'Admin'
    },
    {
        name: 'Technician'
    },
    {
        name: 'Customer'
    }
];