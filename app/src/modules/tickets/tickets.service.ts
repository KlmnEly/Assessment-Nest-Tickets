// src/modules/tickets/ticket.service.ts

import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
  ) {}

  // --- Create Ticket ---
  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    try {
      const newTicket = this.ticketRepository.create(createTicketDto);
      return await this.ticketRepository.save(newTicket);
    } catch (error) {
      if (error.code === '23503') {
        throw new BadRequestException('The provided customer ID does not exist.');
      }
      throw new InternalServerErrorException('Error creating ticket.');
    }
  }

  // --- Get Tickets
  async findAll(): Promise<Ticket[]> {
    try {
      const tickets = await this.ticketRepository.find({
        relations: ['customer', 'technician'], 
      });
      if (!tickets || tickets.length === 0) {
        throw new NotFoundException('No tickets found.');
      }
      return tickets;
    } catch (err: any) {
      if (err.response?.statusCode) throw err;
      throw new InternalServerErrorException('Error fetching tickets.');
    }
  }

  // --- Get By ID ---
  async findOne(id: number): Promise<Ticket> {
    if (!id || id <= 0) {
        throw new BadRequestException('A valid ID is required.');
    }
    try {
        const ticket = await this.ticketRepository.findOne({ 
            where: { id_ticket: id },
            relations: ['customer', 'technician'],
        });

        if (!ticket) {
            throw new NotFoundException(`Ticket with id ${id} not found.`);
        }
        return ticket;
    } catch (err: any) {
        if (err.response?.statusCode) throw err;
        throw new InternalServerErrorException('Error fetching ticket by id.');
    }
  }

  // --- Update Ticket ---
  async update(id: number, updateTicketDto: UpdateTicketDto): Promise<Ticket> {
    if (!id || id <= 0) {
        throw new BadRequestException('A valid ID is required for update.');
    }
    if (Object.keys(updateTicketDto).length === 0) {
        throw new BadRequestException('No data provided to update.');
    }

    try {
        const result = await this.ticketRepository.update({ id_ticket: id }, updateTicketDto);

        if (result.affected === 0) {
            throw new NotFoundException(`Ticket with ID ${id} not found.`);
        }

        return await this.ticketRepository.findOneOrFail({ 
            where: { id_ticket: id },
            relations: ['customer', 'technician'],
        });
    } catch (error) {
         if (error.code === '23503') { 
             throw new BadRequestException('The provided customer or technician ID does not exist.');
         }
        if (error instanceof NotFoundException || error instanceof BadRequestException) {
            throw error;
        }
        throw new InternalServerErrorException(`Error updating ticket with ID ${id}.`);
    }
  }
  
  // --- Delete Ticket ---
  async remove(id: number): Promise<void> {
    if (!id || id <= 0) {
        throw new BadRequestException('A valid ID is required for deletion.');
    }
    try {
        const result = await this.ticketRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Ticket with ID ${id} not found.`);
        }
    } catch (err: any) {
        if (err.response?.statusCode) throw err;
        throw new InternalServerErrorException(`Error deleting ticket with ID ${id}.`);
    }
  }
}