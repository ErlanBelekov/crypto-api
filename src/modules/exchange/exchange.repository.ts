/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import wretch from 'wretch';
import { Decimal } from 'decimal.js';
import { GetExchangePriceDTO } from './exchange.dto';
import { env } from 'env';
import { z } from 'nestjs-zod/z';

const TTLCache = require('@isaacs/ttlcache');

const cache = new TTLCache({ max: 10000, ttl: env.UPDATE_FREQUENCE_MS });

// Instantiate and configure wretch
const api = wretch('https://api.binance.com', { mode: 'cors' })
  .errorType('json')
  .resolve((r) => r.json());

// BinanceAPIBookTickerResponseSchema describes the shape of data returned by /api/v3/ticker/bookTicker of Binance API
const BinanceAPIBookTickerResponseSchema = z.object({
  symbol: z.string(),
  bidPrice: z.string(),
  bidQty: z.string(),
  askPrice: z.string(),
  askQty: z.string(),
});

@Injectable()
export class ExchangeRepository {
  async getExchangePriceForTradingPair(
    dto: GetExchangePriceDTO,
  ): Promise<number> {
    if (cache.has(dto.symbol)) {
      return cache.get(dto.symbol);
    }

    // Fetch data from Binance API
    const prices = await api.get(
      `/api/v3/ticker/bookTicker?symbol=${dto.symbol}`,
    );

    const apiResponseParseResult =
      BinanceAPIBookTickerResponseSchema.safeParse(prices);

    if (!apiResponseParseResult.success) {
      throw new InternalServerErrorException();
    }

    // convert floats to int to not lose precision/value during arithmetics
    const askPrice = new Decimal(
      parseFloat(apiResponseParseResult.data.askPrice) * 100000000,
    )
      .toDecimalPlaces(0)
      .toNumber();

    const bidPrice = new Decimal(
      parseFloat(apiResponseParseResult.data.bidPrice) * 100000000,
    )
      .toDecimalPlaces(0)
      .toNumber();

    const finalPriceSatoshi =
      (askPrice * env.SERVICE_FEE +
        askPrice +
        (bidPrice * env.SERVICE_FEE + bidPrice)) /
      2;

    const finalPrice = new Decimal(finalPriceSatoshi / 100000000)
      .toDecimalPlaces(8)
      .toNumber();

    // save item in cache if it doesn't exist
    if (!cache.has(dto.symbol)) {
      cache.set(dto.symbol, finalPrice);
    }

    return finalPrice;
  }
}
