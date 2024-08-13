import { z } from 'zod';

export const participantSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('create'),
    z.literal('update'),
    z.literal('delete'),
  ]),
  z.literal('Participant'),
]);

export type ParticipantSubject = z.infer<typeof participantSubject>;
