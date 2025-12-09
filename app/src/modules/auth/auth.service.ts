import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private UsersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Register new user
  async register (createUserDto: CreateUserDto) {
    try {
      return await this.UsersService.create(createUserDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Error during registration');
    }
  }

  // Login existing user
  async login (loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.UsersService.getByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    // Compare passwords
    const isPasswordMatching = await bcrypt.compare(password, user.password);

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT payload (Define what data to include in the token)
    const payload = {
      email: user.email,
      sub: user.id_user,
      role: user.roleId
    };

    // Sign and return the JWT
    return {
      access_token: this.jwtService.sign(payload)
    };
  }
}
