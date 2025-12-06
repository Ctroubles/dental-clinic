export interface IPageableRequest<TFilters = Record<string, unknown>> {
  page: number
  pageSize: number
  filters?: TFilters
}

export class PageableResult<T> {
  public records: T[] = []
  public currentPage: number
  public pageSize: number
  public totalRecords: number
  public totalPages: number
  public hasNext: boolean
  public hasPrevious: boolean

  constructor(
    records: T[],
    totalRecords: number,
    page: number,
    pageSize: number
  ) {
    this.records = records
    this.totalRecords = totalRecords
    this.pageSize = pageSize
    this.currentPage = page

    const pageCount = this.totalRecords / this.pageSize
    this.totalPages = Math.ceil(pageCount)
    this.hasNext = this.currentPage < this.totalPages
    this.hasPrevious = this.currentPage > 1
  }
}
