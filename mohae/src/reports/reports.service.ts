import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/repository/user.repository';
import { BoardRepository } from 'src/boards/repository/board.repository';
import { ErrorConfirm } from 'src/utils/error';
import { CreateReportDto } from './dto/report.dto';
import {
  ReportCheckbox,
  ReportedBoard,
  ReportedUser,
} from './entity/report.entity';
import {
  BoardReportChecksRepository,
  ReportCheckboxRepository,
  ReportedBoardRepository,
  ReportedUserRepository,
  UserReportChecksRepository,
} from './repository/report.repository';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(ReportedBoardRepository)
    private reportedBoardRepository: ReportedBoardRepository,

    @InjectRepository(ReportedUserRepository)
    private reportedUserRepository: ReportedUserRepository,

    @InjectRepository(ReportCheckboxRepository)
    private reportCheckboxRepository: ReportCheckboxRepository,

    @InjectRepository(BoardRepository)
    private boardRepository: BoardRepository,

    @InjectRepository(UserRepository)
    private userRepository: UserRepository,

    @InjectRepository(BoardReportChecksRepository)
    private boardReportChecksRepository: BoardReportChecksRepository,

    @InjectRepository(UserReportChecksRepository)
    private userReportChecksRepository: UserReportChecksRepository,

    private errorConfirm: ErrorConfirm,
  ) {}

  async readAllCheckboxes(): Promise<ReportCheckbox[]> {
    const checkedReport =
      await this.reportCheckboxRepository.readAllCheckboxes();

    return checkedReport;
  }

  async readOneReportedBoard(no: number): Promise<ReportedBoard> {
    try {
      const report = await this.reportedBoardRepository.readOneReportedBoard(
        no,
      );

      this.errorConfirm.notFoundError(
        report,
        '해당 게시글 신고를 찾을 수 없습니다.',
      );

      return report;
    } catch (e) {
      throw e;
    }
  }

  async readOneReportedUser(no: number): Promise<ReportedUser> {
    try {
      const report = await this.reportedUserRepository.readOneReportedUser(no);

      this.errorConfirm.notFoundError(
        report,
        '해당 유저 신고를 찾을 수 없습니다.',
      );

      return report;
    } catch (e) {
      throw e;
    }
  }

  async createReport(createReportDto: CreateReportDto) {
    const { head, headNo, reportUserNo, checks, description } = createReportDto;
    const checkInfo = checks.map(async (el) => {
      const info = await this.reportCheckboxRepository.selectCheckConfirm(el);

      return info;
    });

    try {
      switch (head) {
        // 게시글 신고일 때의 로직
        case 'board':
          try {
            const board = await this.boardRepository.findOne(headNo, {
              select: ['no'],
              relations: ['reports'],
            });
            this.errorConfirm.notFoundError(
              board,
              '신고하려는 게시글이 존재하지 않습니다.',
            );
            const boardReporter = await this.userRepository.findOne(
              reportUserNo,
              {
                select: ['no'],
                relations: ['boardReport'],
              },
            );
            this.errorConfirm.notFoundError(
              boardReporter,
              '신고자를 찾을 수 없습니다.',
            );

            const { insertId, affectedRows } =
              await this.reportedBoardRepository.createBoardReport(description);
            if (!affectedRows) {
              throw new InternalServerErrorException('게시글 신고 저장 실패');
            }
            const newBoardReport: ReportedBoard =
              await this.reportedBoardRepository.readOneReportedBoard(insertId);

            checkInfo.forEach(async (checkNo) => {
              await this.boardReportChecksRepository.saveBoardReportChecks(
                newBoardReport,
                await checkNo,
              );
            });

            board.reports.push(newBoardReport);
            boardReporter.boardReport.push(newBoardReport);

            await this.boardRepository.save(board);
            await this.userRepository.save(boardReporter);

            return { success: true, reportNo: insertId };
          } catch (e) {
            throw e;
          }

        // 유저 신고일 때의 로직
        case 'user':
          try {
            const user = await this.userRepository.findOne(headNo, {
              relations: ['reports'],
            });
            this.errorConfirm.notFoundError(
              user,
              '신고하려는 유저가 존재하지 않습니다.',
            );

            const userReporter = await this.userRepository.findOne(
              reportUserNo,
              {
                relations: ['userReport'],
              },
            );
            this.errorConfirm.notFoundError(
              userReporter,
              '신고자를 찾을 수 없습니다.',
            );

            const { insertId, affectedRows } =
              await this.reportedUserRepository.createUserReport(description);
            if (!affectedRows) {
              throw new InternalServerErrorException(
                '유저 신고가 접수되지 않았습니다.',
              );
            }
            const newUserReport =
              await this.reportedUserRepository.readOneReportedUser(insertId);

            checkInfo.forEach(async (checkNo) => {
              await this.userReportChecksRepository.saveUserReportChecks(
                newUserReport,
                await checkNo,
              );
            });

            user.reports.push(newUserReport);
            userReporter.userReport.push(newUserReport);

            await this.userRepository.save(user);
            await this.userRepository.save(userReporter);

            return { success: true, reportNo: insertId };
          } catch (e) {
            throw e;
          }
        default:
          this.errorConfirm.notFoundError('', '해당 경로를 찾을 수 없습니다.');
      }
    } catch (e) {
      throw e;
    }
  }
}
