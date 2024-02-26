import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryEntity } from './history/history.entity';

@Module({
  imports: [DatabaseModule,TypeOrmModule.forFeature([HistoryEntity])],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
