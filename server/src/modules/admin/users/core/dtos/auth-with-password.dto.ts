import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';

import { z } from 'zod';

export const AuthWithPasswordDtoSchema = extendApi(
  z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
);

export class AuthWithPasswordDto extends createZodDto(
  AuthWithPasswordDtoSchema,
) {}
