import { Controller, Get, Query } from '@nestjs/common';

import { ExchangeService } from './exchange.service';
import { GetExchangePriceDTO } from './exchange.dto';

@Controller('/exchange')
export class ExchangeHTTPController {
  constructor(private readonly service: ExchangeService) {}

  @Get('/')
  async getExchangePriceForTradingPair(
    @Query() exchangePriceQuery: GetExchangePriceDTO,
  ): Promise<{ price: number }> {
    return {
      price:
        await this.service.getExchangePriceForTradingPair(exchangePriceQuery),
    };
  }
}
