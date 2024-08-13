import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const paginationSchema = extendApi(
  z.object({
    perPage: z.coerce.number().min(1).default(20),
    pageIndex: z.coerce.number().min(0).default(0),
  }),
);

export const paginatedMetadataSchema = z.object({
  total: z.number(),
  perPage: z.coerce.number(),
  pageIndex: z.coerce.number(),
  nextPageIndex: z.number().nullable(),
});

export type PaginatedMetadata = z.infer<typeof paginatedMetadataSchema>;

export interface Paginated<Data> {
  meta: PaginatedMetadata;
  data: Data[];
}

export class Pagination extends createZodDto(paginationSchema) {}

export const defaultPagination: Pagination = {
  pageIndex: 0,
  perPage: 20,
};

export function createPaginationResponse<Data>(
  data: Data[],
  total: number,
  pagination: Pagination,
): Paginated<Data> {
  const hasNext = total / pagination.perPage > pagination.pageIndex + 1;
  const response: Paginated<(typeof data)[0]> = {
    data,
    meta: {
      nextPageIndex: hasNext ? pagination.pageIndex + 1 : null,
      pageIndex: pagination.pageIndex,
      perPage: pagination.perPage,
      total,
    },
  };

  return response;
}