import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';

import { z } from 'zod';

export const createInstructorDtoSchema = extendApi(
  z.object({
    name: z.string(),
    description: z.string(),
    avatarUrl: z.string().url(),
  }),
);

export class CreateInstructorDto extends createZodDto(
  createInstructorDtoSchema,
) {}
