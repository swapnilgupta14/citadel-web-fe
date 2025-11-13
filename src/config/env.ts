import { z } from 'zod'

const isDevelopment = import.meta.env.DEV;

const envSchema = z.object({
    VITE_API_BASE_URL: z.string()
        .optional()
        .default(() => isDevelopment ? 'http://localhost:8000/api' : '')
        .refine(
            (val) => !val || z.string().url().safeParse(val).success,
            { message: 'VITE_API_BASE_URL must be a valid URL' }
        ),
    VITE_APP_NAME: z.string().default('Citadel Web'),
    VITE_ENABLE_DEVTOOLS: z
        .string()
        .optional()
        .default('true')
        .transform((val) => val === 'true'),
    VITE_RAZORPAY_KEY_ID: z.string().optional(),
})

export const env = envSchema.parse(import.meta.env)
