import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';

import { z } from 'zod';

export const createOrgDtoSchema = extendApi(
  z.object({
    name: z.string(),
    domain: z.string().nullish(),
    shouldAttachUsersByDomain: z.boolean().optional(),
  }),
);

export class CreateOrgDto extends createZodDto(createOrgDtoSchema) {}
