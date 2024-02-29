import { z } from 'zod';

const EnvironmentVariablesSchema = z.object({
  PORT: z.coerce.number().min(0).max(9999),
  // UPDATE_FREQUENCE_MS controls freshness longevity for an exchange price for a trading pair
  UPDATE_FREQUENCE_MS: z.coerce.number().min(0),
  // SERVICE_FEE is fee of our service, added to every price obtained from 3-rd party API
  SERVICE_FEE: z.coerce.number().min(0),
});

// type-safe access to process.env
export const env = EnvironmentVariablesSchema.parse(process.env);
