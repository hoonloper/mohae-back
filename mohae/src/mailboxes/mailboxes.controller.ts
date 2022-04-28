import { Controller, Get, Param, Query } from '@nestjs/common';
import { MailboxesService } from './mailboxes.service';

@Controller('mailboxes')
export class MailboxesController {
  constructor(private mailboxesService: MailboxesService) {}

  // 유저가 알림버튼을 클릭했을 때 API
  @Get('/:loginUserNo')
  async findAllMailboxes(@Param('loginUserNo') loginUserNo: number) {
    const response = await this.mailboxesService.findAllMailboxes(loginUserNo);

    return Object.assign({
      statusCode: 200,
      msg: '쪽지함 조회 완료',
      response,
    });
  }

  // 유저가 알림창에 있는 쪽지함을 클릭했을 때
  @Get('/letter/:mailboxNo')
  async searchMailbox(
    @Param('mailboxNo') mailboxNo: number,
    @Query('limit') limit: number,
  ) {
    const response = await this.mailboxesService.searchMailbox(
      mailboxNo,
      limit,
    );

    return Object.assign({
      statusCode: 200,
      msg: '쪽지 전송 화면 조회 완료',
      response,
    });
  }

  @Get('/confirm/:oneselfNo/:opponentNo')
  async checkMailbox(
    @Param('oneselfNo') oneselfNo: number,
    @Param('opponentNo') opponentNo: number,
  ) {
    const response = await this.mailboxesService.checkMailbox(
      oneselfNo,
      opponentNo,
    );

    return Object.assign({
      statusCode: 200,
      msg: '쪽지함 존재 여부 확인 완료',
      response,
    });
  }
}