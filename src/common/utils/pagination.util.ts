export function paginationSolver(page: number = 1, limit: number = 10) {
  // if (!page || page <= 1) {
  //   page = 0;
  // } else {
  //   page = page - 1;
  // }

  // if (!limit || limit <= 0) limit = 10;
  // const skip = page * limit;
  // return {
  //   page,
  //   limit,
  //   skip,
  // };

  const currentPage = Math.max(1, page);
  const currentLimit = Math.max(1, limit); 

  const skip = (currentPage - 1) * currentLimit;

  return {
    page: currentPage, 
    limit: currentLimit, 
    skip: skip,
  };
}

export function paginationGenerator(
  count: number = 0,
  page: number = 0,
  limit: number = 0,
) {
  const effectiveLimit = Math.max(1, limit);
  const pageCount = count > 0 ? Math.ceil(count / effectiveLimit) : 0;

  return {
    totalCount: count,
    page: page,
    countPerPage: effectiveLimit,
    pageCount: pageCount,
  };
}
