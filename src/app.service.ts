import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    //consulta banco de dados
    return 'Hello World!';
  }
}
