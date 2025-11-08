import { z } from 'zod'

const envSchema = z.object({
    VITE_API_BASE_URL: z.string().url().optional().default('http://localhost:8000/api'),
    VITE_APP_NAME: z.string().default('Citadel Web'),
    VITE_ENABLE_DEVTOOLS: z
        .string()
        .optional()
        .default('true')
        .transform((val) => val === 'true'),
})

export const env = envSchema.parse(import.meta.env)
