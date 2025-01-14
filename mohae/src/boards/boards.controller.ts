import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  UsePipes,
  ValidationPipe,
  Patch,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';
import { BoardsService } from './boards.service';
import {
  CreateBoardDto,
  SearchBoardDto,
  LikeBoardDto,
  UpdateBoardDto,
} from './dto/board.dto';
import { Board } from './entity/board.entity';

@Controller('boards')
@ApiTags('Boards')
export class BoardsController {
  constructor(private boardService: BoardsService) {}

  @Get()
  async getAllBoards(): Promise<Board[]> {
    const response = await this.boardService.getAllBoards();

    return Object.assign({
      statusCode: 200,
      msg: '게시글 전체 조회가 완료되었습니다.',
      response,
    });
  }

  @Get('/search/:no')
  async filteredBoards(
    @Param('no') no: number,
    @Query() paginationQuery,
  ): Promise<Board[]> {
    const { sort, popular, areaNo, categoryNo, max, min, target, date, free } =
      paginationQuery;

    const response = await this.boardService.filteredBoards(
      sort,
      popular,
      areaNo,
      categoryNo,
      max,
      min,
      target,
      date,
      free,
    );

    return Object.assign({
      statusCode: 200,
      msg: '게시글 필터링이 완료되었습니다.',
      filteredBoardNum: response.length,
      response,
    });
  }

  @Get('/hot')
  async readHotBoards(): Promise<Board[]> {
    const response = await this.boardService.readHotBoards();

    return Object.assign({
      statusCode: 200,
      msg: '인기 게시글 조회가 완료되었습니다.',
      response,
    });
  }

  @Patch('/cancel/:no')
  async cancelClosedBoard(@Param('no') no: number): Promise<object> {
    const response = await this.boardService.cancelClosedBoard(no);

    return Object.assign({
      statusCode: 200,
      msg: '게시글 마감 취소가 완료되었습니다.',
      response,
    });
  }

  @Patch('/close/:no')
  async boardClosed(@Param('no') no: number): Promise<object> {
    const response = await this.boardService.boardClosed(no);

    return Object.assign({
      statusCode: 200,
      msg: '게시글 마감이 완료되었습니다.',
      response,
    });
  }

  @Get('/:no')
  async getByOneBoard(@Param('no') no: number) {
    const { board, likeCount } = await this.boardService.getByOneBoard(no);

    return Object.assign({
      statusCode: 200,
      msg: '게시글 상세 조회가 완료되었습니다.',
      likeCount,
      board,
    });
  }

  @Post()
  @UsePipes(ValidationPipe)
  @ApiOperation({
    summary: '게시글 생성 경로',
    description: '게시글 생성 API',
  })
  @ApiCreatedResponse({
    description: '성공여부',
    schema: {
      example: {
        statusCode: 201,
        msg: '게시글 생성이 완료되었습니다.',
        response: {
          success: true,
          createBoardNo: 26,
        },
      },
    },
  })
  async createBoard(@Body() createBoardDto: CreateBoardDto): Promise<Board> {
    const response = await this.boardService.createBoard(createBoardDto);

    return Object.assign({
      statusCode: 201,
      msg: '게시글 생성이 완료되었습니다.',
      response,
    });
  }

  @Post('search')
  async searchAllBoards(
    @Body() searchBoardDto: SearchBoardDto,
  ): Promise<Board[]> {
    const response = await this.boardService.searchAllBoards(searchBoardDto);

    return Object.assign({
      statusCode: 200,
      msg: '검색에 관한 게시글 조회가 완료되었습니다.',
      response,
    });
  }

  @Post('like')
  async likeBoard(@Body() likeBoardDto: LikeBoardDto): Promise<Board> {
    const response = await this.boardService.likeBoard(likeBoardDto);

    return Object.assign({
      statusCode: 200,
      response,
    });
  }

  @Delete('/:no')
  async deleteBoard(@Param('no') no: number): Promise<DeleteResult> {
    const response = await this.boardService.deleteBoard(no);

    return Object.assign({
      statusCode: 204,
      msg: '게시글 삭제가 완료되었습니다',
    });
  }

  @Patch('/:no')
  async updateBoard(
    @Param('no') no: number,
    @Body() updateBoardDto: UpdateBoardDto,
  ): Promise<object> {
    const response = await this.boardService.updateBoard(no, updateBoardDto);

    return Object.assign({
      statusCode: 201,
      msg: '게시글 수정이 완료되었습니다.',
      response,
    });
  }
}
