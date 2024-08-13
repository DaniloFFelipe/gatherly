import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';

import { z } from 'zod';

export const createLessonDtoSchema = extendApi(
  z.object({
    name: z.string(),
    description: z.string(),
    contentUrl: z.string().url(),
    instructorId: z.string().uuid(),
  }),
);

export class CreateLessonDto extends createZodDto(createLessonDtoSchema) {}
