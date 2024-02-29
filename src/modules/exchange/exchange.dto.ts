import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

// only allow BTC/USDT trading pair for now
const ALLOWED_SYMBOLS = ['BTCUSDT'];

const GetExchangePriceSchema = z.object({
  symbol: z
    .string()
    .min(1)
    .transform((symbol) => symbol.toUpperCase())
    .refine(
      (symbol) => {
        return ALLOWED_SYMBOLS.includes(symbol);
      },
      {
        message: 'Invalid symbol.',
      },
    ),
});

export class GetExchangePriceDTO extends createZodDto(GetExchangePriceSchema) {}
