export interface PaginationDto {
  page: number;
  limit: number;
  orderBy: string;
  order: 'asc' | 'desc';
}
