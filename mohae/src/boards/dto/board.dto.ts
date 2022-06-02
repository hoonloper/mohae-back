import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';

export abstract class BoardContent {
  @ApiProperty({
    example: 10000,
    description: 'Example Description입니다.',
    required: true,
  })
  @IsNumber()
  @Max(1000001)
  price: number;

  @ApiProperty({
    example: '제목 입력',
    description: 'Example Description입니다.',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(15)
  title: string;

  @ApiProperty({
    example: '내용 입력',
    description: 'Example Description입니다.',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description: string;

  @ApiProperty({
    example: '한줄 요약 입력',
    description: 'Example Description입니다.',
    required: false,
  })
  @IsString()
  @MaxLength(100)
  summary?: string;

  @ApiProperty({
    example: true,
    description: 'Example false = 해주는 사람, true = 구하는 사람.',
    required: true,
  })
  @IsBoolean()
  target: boolean;

  @ApiProperty({
    example: 3,
    description: 'Example 카테고리.',
    required: true,
  })
  @IsNumber()
  categoryNo: number;

  @ApiProperty({
    example: 1,
    description: 'Example 지역.',
    required: true,
  })
  @IsNumber()
  areaNo: number;

  @ApiProperty({
    example: '첫번째 상세조건',
    description: 'Example 상세조건1 입니다.',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  note1?: string;

  @ApiProperty({
    example: '두번째 상세조건',
    description: 'Example 상세조건2 입니다.',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  note2?: string;

  @ApiProperty({
    example: '세번째 상세조건',
    description: 'Example 상세조건3 입니다.',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  note3?: string;

  @ApiProperty({
    example: ['사진url'],
    description: 'Example 게시글 사진입니다.',
    required: false,
  })
  @IsArray()
  @IsOptional()
  @ArrayMaxSize(5)
  photoUrl?: [];
}

export class CreateBoardDto extends BoardContent {
  @ApiProperty({ description: '0 = 상시, 7 = 일주일, 30 = 1개월, 60 = 3개월' })
  @ApiProperty({
    example: 0,
    description: 'Example 마감일 0 = 상시, 7 = 일주일, 30 = 1개월, 60 = 3개월',
    required: true,
  })
  @IsNumber()
  deadline: number;
}

export class SearchBoardDto {
  @ApiProperty({
    example: 'Test',
    description: 'Example 검색 입력 입니다.',
    required: true,
  })
  @IsString()
  @MaxLength(15)
  title: string;
}

export class LikeBoardDto {
  @IsNumber()
  boardNo: number;

  @IsNumber()
  userNo: number;

  @IsBoolean()
  judge: boolean;
}

export abstract class UpdateBoardDto {
  @IsOptional()
  @IsNumber()
  @Max(1000001)
  price?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(15)
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  summary?: string;

  @IsOptional()
  @IsBoolean()
  target?: boolean;

  @IsOptional()
  @IsNumber()
  category?: number;

  @IsOptional()
  @IsNumber()
  area?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  note1?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  note2?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  note3?: string;

  @IsOptional()
  @IsNumber()
  deadline?: any;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5)
  photoUrl: [];
}
