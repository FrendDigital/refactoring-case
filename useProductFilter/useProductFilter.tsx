import { useState } from "react";
import { useInfiniteQuery } from "react-query";

import type { ISortOrder } from "./getFilteredProducts";
import getFilteredProducts, { productsPerPage } from "./getFilteredProducts";

const useProductFilter = (startCategory: string[] = []) => {
  const [size, setSize] = useState<Array<string>>([]);
  const [color, setColor] = useState<Array<string>>([]);
  const [composition, setComposition] = useState<Array<string>>([]);
  const [search, setSearch] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<Array<ISortOrder>>();
  const [subCategory, setSubCategory] = useState<Array<string>>([]);
  const reset = () => {
    setSize([]);
    setColor([]);
    setComposition([]);
    setSearch("");
    setSortOrder(undefined);
    setSubCategory([]);
  };
  const { data, error, fetchNextPage, hasNextPage, isFetching } =
    useInfiniteQuery(
      [
        "products",
        {
          category: startCategory,
          size: size.length > 0 ? size : undefined,
          color: color.length > 0 ? color : undefined,
          composition: composition.length > 0 ? composition : undefined,
          search: search || undefined,
          sortOrder: sortOrder || undefined,
          subCategory: subCategory.length > 0 ? subCategory : undefined,
        },
      ],
      (pageParam) =>
        getFilteredProducts({
          category: startCategory,
          size,
          color,
          sortOrder,
          search,
          subCategory,
          pageParam,
        }),
      {
        getNextPageParam: (lastPage, pages) =>
          lastPage.productCount > productsPerPage * pages.length
            ? pages.length
            : undefined,

        refetchOnWindowFocus: false,
        keepPreviousData: false,
      }
    );
  return {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    size,
    setSize,
    color,
    setColor,
    composition,
    setComposition,
    search,
    setSearch,
    sortOrder,
    setSortOrder,
    subCategory,
    setSubCategory,
    reset,
  };
};

export default useProductFilter;
