import { Module } from '@nestjs/common';

import { ExchangeHTTPController } from './exchange.controller';
import { ExchangeService } from './exchange.service';
import { ExchangeRepository } from './exchange.repository';

@Module({
  controllers: [ExchangeHTTPController],
  providers: [ExchangeService, ExchangeRepository],
})
export class ExchangeModule {}
