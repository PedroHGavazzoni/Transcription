import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OpenAI } from 'openai';
import { join } from 'path';
import { writeFile } from 'fs/promises';
import * as fs from 'fs';

@Controller('audio')
export class AudioController {
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async handleAudio(@UploadedFile() file: Express.Multer.File) {
    const tempPath = join(__dirname, '../../', 'audio.webm');
    await writeFile(tempPath, file.buffer);

    // Recria o cliente com a chave carregada do .env
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    try {
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(tempPath),
        model: 'whisper-1',
      });

      const chat = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: transcription.text,
          },
        ],
      });

      return {
        transcript: transcription.text,
        reply: chat.choices[0].message.content,
      };
    } catch (error) {
      console.error('Erro ao processar áudio:', error);
      throw error;
    }
  }
}
