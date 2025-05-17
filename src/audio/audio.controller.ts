import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AudioService } from './audio.service';
import { FileInterceptor } from '@nestjs/platform-express';

// O decorator @Controller é usado para definir um controlador no NestJS
// O controlador é responsável por lidar com as requisições HTTP
// O parâmetro 'audio' passado para o decorator @Controller define o caminho base
@Controller('audio')
export class AudioController {
  constructor(private readonly audioService: AudioService) {}

  // O método HTTP usado é GET
  // O caminho é '/audio', ou seja, a URL final fica: http://localhost:3000/audio
  // O método findAll irá buscar todos os audios no banco de dados
  // e retornar os dados de todos os audios
  // O retorno é um array de objetos com os dados dos audios
  @Get()
  findAll() {
    return this.audioService.findAll();
  }

  // O método HTTP usado é GET
  // O caminho é '/audio/:id', ou seja, a URL final fica: http://localhost:3000/audio/1
  // O parâmetro ':id' é um parâmetro de rota, que será passado na URL
  // O NestJS irá automaticamente extrair o valor do parâmetro ':id' e passá-lo como argumento para o método
  // O valor do parâmetro ':id' será do tipo string, então precisamos convertê-lo para number
  // O método findOne irá buscar o cliente com o ID correspondente no banco de dados
  // e retornar os dados desse audio
  @Get(':id')
  findOne(@Param('id') id: string) {
    //OBS: Poderá ser usado aqui um validador por exemplo Zod para validar o ID ou quaiquer parâmetros existentes?
    return this.audioService.findOne(Number(id));
  }

  // Aqui é a entrada da requisição HTTP
  // O método HTTP usado é POST
  // O caminho é '/audio/upload', ou seja, a URL final fica: http://localhost:3000/audio/upload
  // O arquivo de áudio é enviado no corpo da requisição (body), no formato multipart/form-data
  // O campo enviado com o nome 'file' será interceptado automaticamente pelo NestJS
  // A função FileInterceptor é usada para processar esse campo e armazená-lo na memória
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async handleAudio(@UploadedFile() file: Express.Multer.File) {
    return this.audioService.processAudio(file);
  }
}
