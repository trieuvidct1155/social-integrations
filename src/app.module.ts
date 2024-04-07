import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FacebookModule } from './modules/social-publishing/social-publishing.module';

@Module({
  imports: [FacebookModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
