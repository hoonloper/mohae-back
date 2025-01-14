import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { IsNull } from 'typeorm';

export class CreateSpecDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsArray()
  specPhoto?: [];

  @IsNumber()
  userNo: number;
}

export class UpdateSpecDto {
  @IsString()
  title?: string;

  @IsString()
  description?: string;

  @IsString()
  photo_url?: string;
}
