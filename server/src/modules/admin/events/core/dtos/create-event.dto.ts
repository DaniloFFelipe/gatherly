import { z } from 'zod';
import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';

export const createEventDtoSchema = extendApi(
  z.object({
    name: z.string(),
    description: z.string(),
    avatarUrl: z.string().url(),
  }),
);

export class CreateEventDto extends createZodDto(createEventDtoSchema) {}
