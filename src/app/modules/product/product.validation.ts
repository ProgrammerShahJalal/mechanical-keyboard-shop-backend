import { z } from "zod";

export const productSchema = z.object({
  name: z.string(),
  brand: z.string(),
  price: z.number(),
  availableQuantity: z.number(),
  rating: z.number().min(0).max(5),
  image: z.string().url(),
  description: z.string(),
});
