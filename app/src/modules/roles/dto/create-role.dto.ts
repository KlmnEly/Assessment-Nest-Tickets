import { IsBoolean, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateRoleDto {
    @IsNotEmpty({ message: 'The role name must be provided.' })
    @IsString({ message: 'The role name must be a string value.' })
    @MinLength(3, { message : 'The role name must be at least 3 characters long.' })
    name: string;

    @IsOptional()
    @IsBoolean({ message: 'isActive must be a boolean value.' })
    isActive?: boolean;
}