// src/modules/tickets/entities/ticket.entity.ts

import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/modules/users/entities/user.entity"; // Asumo esta ruta
import { TicketStatus, TicketPriority } from "../../../common/enums/ticket.enum";

@Entity('tickets')
export class Ticket {
    @PrimaryGeneratedColumn('increment')
    id_ticket: number;

    @Column({ length: 150 })
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({
        type: 'enum',
        enum: TicketStatus,
        default: TicketStatus.OPEN,
    })
    status: TicketStatus;

    @Column({
        type: 'enum',
        enum: TicketPriority,
        default: TicketPriority.MEDIUM,
    })
    priority: TicketPriority;
    
    @Column({ name: 'customer_id' })
    customerId: number;

    @ManyToOne(() => User, { nullable: false, onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'customer_id' })
    customer: User;

    @Column({ name: 'technician_id'})
    technicianId: number;

    @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'technician_id' })
    technician: User;
}