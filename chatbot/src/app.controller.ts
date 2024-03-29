import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { QuestionDto } from './app.dto';
import { Response } from 'express';
import { HistoryDto, ListaMensagensDto } from './history/history.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('/chat')
  async getHello(@Body() question: QuestionDto, @Res() response: Response): Promise<any> {
    try {
      return response.status(HttpStatus.OK).json(await this.appService.sendQuestion(question));
    }
    catch (error) {
      console.log(error)
      throw new HttpException('Bad Request - Verifique se a mensagem não é muito grande', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/chat')
  async getMessages(@Res() response: Response): Promise<any> {
    try {
      return response.status(HttpStatus.OK).json(await this.appService.getMessages())
    }
    catch (error) {
      console.log(error)
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/history')
  async saveHistory(@Body() chats: ListaMensagensDto[], @Res() response: Response): Promise<any> {
    try {
      return response.status(HttpStatus.OK).json(await this.appService.save_history(chats));
    }
    catch (error) {
      console.log(error)
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/history')
  async loadHistory(@Res() response: Response): Promise<any> {
    try {
      return response.status(HttpStatus.OK).json(await this.appService.load_history());
    }
    catch (error) {
      console.log(error)
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete("/history/:id")
  async delete(@Param('id') id: number, @Res() response: Response, @Req() request: Request): Promise<any> {
    try {
      var json = await this.appService.deletaitem(id)
      return response.status(HttpStatus.OK).json(
        {
          msg: "Deletado com sucesso",
          json
        }
      )
    } catch (exception) {
      return response.status(HttpStatus.BAD_REQUEST).json(exception)
    }
  }
}
