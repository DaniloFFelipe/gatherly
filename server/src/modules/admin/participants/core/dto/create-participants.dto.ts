import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';

import { z } from 'zod';

export const createParticipantDtoSchema = extendApi(
  z.object({
    name: z.string(),
    email: z.string(),
  }),
);

export class CreateParticipantDto extends createZodDto(
  createParticipantDtoSchema,
) {}
