import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsModule } from 'src/reports/reports.module';
import { ReportsService } from 'src/reports/reports.service';
import { ReviewRepository } from 'src/reviews/repository/review.repository';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { BoardRepository } from './repository/board.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BoardRepository, ReviewRepository])],
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule {}
