import { IsNotEmpty, IsString, MaxLength, IsEnum, IsNumber } from "class-validator";
import { TicketPriority } from "../../../common/enums/ticket.enum";

export class CreateTicketDto {
    @IsNotEmpty({ message: 'Title must be provided' })
    @IsString({ message: 'title must be a string.' })
    @MaxLength(150, { message: 'max 150 characters' })
    title: string;

    @IsString({ message: 'title must be a string.' })
    description?: string;

    @IsNotEmpty({ message: 'Priority is mandatory' })
    @IsEnum(TicketPriority, { message: 'Priority invalid.' })
    priority: TicketPriority;

    @IsNotEmpty({ message: 'the customer id is mandatory' })
    @IsNumber({}, { message: 'The customer ID must be numeric.' })
    customerId: number;

    @IsNotEmpty({ message: 'the technician id is mandatory' })
    @IsNumber({}, { message: 'The technician ID must be numeric.' })
    technicianId: number;
    
}