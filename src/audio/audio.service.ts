import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { writeFile } from 'fs/promises';
import * as fs from 'fs';
import OpenAI from 'openai';

@Injectable()
export class AudioService {
  // Define a estrutura com tipagem opcional (boa prática)
  // Define a estrutura de dados para transcrição
  private transcricao: {
    id: number;
    transcript: string;
    reply: string | null;
  }[] = [];

  findAll() {
    return this.transcricao;
  }

  findOne(id: number) {
    const transcricao = this.transcricao.find((item) => item.id === id);
    if (!transcricao) {
      throw new Error('Transcrição não encontrada');
    }

    return transcricao;
  }

  async processAudio(file: Express.Multer.File) {
    const tempPath = join(__dirname, '../../', 'audio.webm');
    await writeFile(tempPath, file.buffer);

    // Esse serviço pode ser instânciado em uma variável global para ser usado em toda a aplicação?
    // Se sim, como?
    // Seria um tipo de encapsulamento? Para evitar instanciar várias vezes o mesmo serviço?
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

      // Cria o objeto de resultado com ID
      const resultado = {
        id: this.transcricao.length + 1, //incrementa o ID
        transcript: transcription.text,
        reply: chat.choices[0].message.content,
      };

      // Adiciona ao array existente usando spread
      this.transcricao = [...this.transcricao, resultado];

      return resultado;
    } catch (error) {
      console.error('Erro ao processar áudio:', error);
      throw error;
    }
  }
}
