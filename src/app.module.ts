import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AudioController } from './audio/audio.controller';



@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, AudioController],
  providers: [AppService],
})
export class AppModule {}
