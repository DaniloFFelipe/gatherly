import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';

import { z } from 'zod';

export const updateParticipantDtoSchema = extendApi(
  z.object({
    name: z.string().optional(),
    email: z.string().optional(),
  }),
);

export class UpdateParticipantDto extends createZodDto(
  updateParticipantDtoSchema,
) {}
