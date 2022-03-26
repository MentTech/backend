export interface PaginationSortDto {
  page: number;
  limit: number;
  orderBy: string;
  order: 'asc' | 'desc';
}
