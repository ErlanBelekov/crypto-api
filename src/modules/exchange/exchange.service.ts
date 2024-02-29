import { Injectable } from '@nestjs/common';
import { ExchangeRepository } from './exchange.repository';
import { GetExchangePriceDTO } from './exchange.dto';

@Injectable()
export class ExchangeService {
  constructor(private readonly repository: ExchangeRepository) {}

  async getExchangePriceForTradingPair(
    dto: GetExchangePriceDTO,
  ): Promise<number> {
    return await this.repository.getExchangePriceForTradingPair(dto);
  }
}
