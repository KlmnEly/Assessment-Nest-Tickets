import { IsNotEmpty, IsString, MaxLength, IsOptional } from "class-validator";

export class CreateCategoryDto {
    @IsNotEmpty({ message: 'The name must be provided.' })
    @IsString({ message: 'The name must be string.' })
    @MaxLength(50, { message: 'The max character for the name is 50' })
    name: string;

    @IsOptional()
    @IsString({ message: 'Description must be string' })
    description?: string;
}