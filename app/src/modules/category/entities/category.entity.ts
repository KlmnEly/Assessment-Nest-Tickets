import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn('increment')
    id_category: number;

    @Column({ unique: true, length: 50 })
    name: string;

    @Column({ nullable: true, type: 'text' })
    description: string;
}