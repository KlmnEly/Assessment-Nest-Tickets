// import { Access } from "src/modules/accesses/entities/access.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn('increment')
    id_role: number;

    @Column({ unique: true })
    name: string;

    // @OneToMany(() => Access, (access) => access.role)
    // accesses: Access[];
}