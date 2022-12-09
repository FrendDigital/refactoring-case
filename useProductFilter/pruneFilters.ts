export interface IFilter {
  field: string;
  values: {
    value: string;
    count: number;
    filterCount: number;
    totalCount: number;
    data: any;
  }[];
}

const pruneFilters = (filters: IFilter[] | undefined) => {
  if (!filters) {
    return [];
  }
  return filters.map((filter) => {
    const filteredValues = filter.values.filter((value) => value.count > 0);
    return { field: filter.field, values: filteredValues };
  });
};

export default pruneFilters;
