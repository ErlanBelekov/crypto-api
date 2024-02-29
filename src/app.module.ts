import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ExchangeModule } from './modules';

@Module({
  imports: [ExchangeModule],
  controllers: [AppController],
})
export class AppModule {}
