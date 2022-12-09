import type { IFilter } from "./getFilteredProducts";

export const seperateFilters = (filters: IFilter[] | undefined) => {
  if (!filters) {
    return {
      sizes: {
        values: [
          { value: "", count: 0, filterCount: 0, totalCount: 0, data: {} },
        ],
      },
      colors: { values: [] },
      compositions: { values: [] },
      categories: { values: [] },
    };
  }
  const sizes = filters.find((element) => element.field === "items.name");
  const weights: any = {
    "One Size": 1,
    XXXS: 5,
    XXS: 6,
    XS: 7,
    S: 8,
    M: 9,
    L: 10,
    XL: 11,
    XXL: 12,
    XXXL: 13,
    XXXXL: 14,
    "XS-S": 20,
    "S-M": 21,
    "M-L": 22,
    "L-XL": 23,
    "XL-XXL": 24,
    "XXL-XXXL": 25,
  };
  sizes?.values.sort((a, b) => weights[a.value] - weights[b.value]);
  const colors = filters.find((element) => element.field === "pr_colors.name");
  colors?.values.sort((a, b) => a.value.localeCompare(b.value));
  const compositions = filters.find(
    (element) => element.field === "pr_compositions.name"
  );
  const categories = filters.find((element) => element.field === "categories");

  return {
    sizes,
    colors,
    compositions,
    categories,
  };
};
