import { Role } from "src/modules/roles/entities/role.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('increment')
    id_user: number;

    @Column({ name: 'role_id', default: 1 })
    roleId: number;

    @Column()
    fullname: string;

    @Column({ unique: true })
    email:string;

    @Column()
    password: string;

    @ManyToOne(() => Role, (role) => role.users, {
        nullable: false,
        onDelete: 'SET NULL'
    })
    @JoinColumn({ name: 'role_id' })
    role: Role;
}
