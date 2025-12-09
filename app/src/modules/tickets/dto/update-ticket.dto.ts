import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketDto } from './create-ticket.dto';
import { IsEnum, IsOptional, IsNumber } from 'class-validator';
import { TicketStatus } from '../../../common/enums/ticket.enum';

export class UpdateTicketDto extends PartialType(CreateTicketDto) {
    @IsOptional()
    @IsEnum(TicketStatus, { message: 'Estado inválido.' })
    status?: TicketStatus;
}