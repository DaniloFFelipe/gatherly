import { z } from 'zod';
import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';

export const joinDtoSchema = extendApi(
  z.object({
    code: z.string(),
    email: z.string(),
  }),
);

export class JoinDto extends createZodDto(joinDtoSchema) {}
