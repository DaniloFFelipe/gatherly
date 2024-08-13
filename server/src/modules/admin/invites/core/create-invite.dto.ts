import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';

import { roleSchema } from 'src/modules/common/roles';
import { z } from 'zod';

export const createInviteDtoSchema = extendApi(
  z.object({
    email: z.string().email(),
    role: roleSchema,
  }),
);

export class CreateInviteDto extends createZodDto(createInviteDtoSchema) {}
