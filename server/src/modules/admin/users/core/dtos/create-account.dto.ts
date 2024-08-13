import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const createAccountDtoSchema = extendApi(
  z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  }),
);

export class CreateAccountDto extends createZodDto(createAccountDtoSchema) {}
