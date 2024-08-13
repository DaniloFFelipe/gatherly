import { z } from 'zod';
import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';

export const updateInstructorDtoSchema = extendApi(
  z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    avatarUrl: z.string().url().optional(),
  }),
);

export class UpdateInstructorDto extends createZodDto(
  updateInstructorDtoSchema,
) {}
