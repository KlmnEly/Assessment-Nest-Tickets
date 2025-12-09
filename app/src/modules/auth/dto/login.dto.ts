import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {
    @IsNotEmpty({ message: 'The email must be provided.' })
    @IsString({ message: 'The email must be a string value.' })
    @MinLength(8, { message : 'The email must be at least 3 characters long.' })
    email: string;

    @IsNotEmpty({ message: 'The password must be provided.' })
    @IsString({ message: 'The password must be a string value.' })
    @MinLength(6, { message : 'The password must be at least 6 characters long.' })
    password: string;
}
