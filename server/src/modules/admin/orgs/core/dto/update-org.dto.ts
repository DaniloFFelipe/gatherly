import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';

import { z } from 'zod';

export const updateOrgDtoSchema = extendApi(
  z.object({
    name: z.string().optional(),
    domain: z.string().optional(),
    shouldAttachUsersByDomain: z.boolean().optional(),
  }),
);

export class UpdateOrgDto extends createZodDto(updateOrgDtoSchema) {}
