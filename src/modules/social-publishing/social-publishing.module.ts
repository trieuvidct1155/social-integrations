import { FacebookIntegration } from 'src/shared/integrations/facebook/facebook.integration';
import { PublishFacbookController } from './facebook.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [PublishFacbookController],
  providers: [FacebookIntegration],
})
export class FacebookModule {}
