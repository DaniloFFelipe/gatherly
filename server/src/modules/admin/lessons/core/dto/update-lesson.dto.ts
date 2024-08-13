import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';

import { z } from 'zod';

export const updateLessonDtoSchema = extendApi(
  z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    contentUrl: z.string().url().optional(),
    instructorId: z.string().uuid().optional(),
  }),
);

export class UpdateLessonDto extends createZodDto(updateLessonDtoSchema) {}
