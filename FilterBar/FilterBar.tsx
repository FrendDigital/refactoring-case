import { useState } from "react";

import { seperateFilters } from "../useProductFilter";
import type { ISortOrder } from "../useProductFilter/getFilteredProducts";
import type { IFilter } from "../useProductFilter/getFilteredProducts
import useProductFilter from "../useProductFilter";
import styles from "./filterbar.module.scss";

interface FilterBarProps {
  filters: IFilter[];
  currentFilters: IFilter[] | undefined;
  categoryId?: string;
  size: Array<string> | undefined;
  setSize: (size: Array<string>) => void;
  color: Array<string> | undefined;
  setColor: (color: Array<string>) => void;
  composition: Array<string> | undefined;
  setComposition: (composition: Array<string>) => void;
  sortOrder: ISortOrder[] | undefined;
  setSortOrder: (sortOrder: ISortOrder[] | undefined) => void;
  subCategory: Array<string> | undefined;
  setSubCategory: (subCategory: Array<string>) => void;
}

const sortOrders: { name: string; value: ISortOrder[] | undefined }[] = [
  {
    name: "Anbefalt",
    value: undefined,
  },
  {
    name: "Nyeste",
    value: [{ field: "createdAt", order: "desc" }],
  },
  {
    name: "Pris (lav til høy)",
    value: [{ field: "priceAsNumber", order: "asc" }],
  },
  {
    name: "Pris (høy til lav)",
    value: [{ field: "priceAsNumber", order: "desc" }],
  },
];

const FilterBar = ({ filters, currentFilters, categoryId }: FilterBarProps) => {
  const {
    data,
    size,
    setSize,
    color,
    setColor,
    composition,
    setComposition,
    sortOrder,
    setSortOrder,
    subCategory,
    setSubCategory,
  } = useProductFilter();
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const handleSortClick = (filter: ISortOrder[] | undefined) => {
    setSortOrder(filter);
    setShowSortMenu(false);
  };

  const { sizes, colors, compositions, categories } = seperateFilters(filters);
  const {
    sizes: currentSizes,
    colors: currentColors,
    compositions: currentCompositions,
  } = seperateFilters(currentFilters);
  const filteredSizes = {
    field: "sizes.name",
    values: currentSizes?.values.filter((el) => {
      return sizes?.values.some((f) => {
        return f.value === el.value;
      });
    }),
  };
  const filteredColors = {
    field: "colors.name",
    values: currentColors?.values.filter((el) => {
      return colors?.values.some((f) => {
        return f.value === el.value;
      });
    }),
  };
  const filteredCompositions = {
    field: "compositions.name",
    values: currentCompositions?.values.filter((el) => {
      return compositions?.values.some((f) => {
        return f.value === el.value;
      });
    }),
  };

  const filteredSubCategories = categoryId
    ? {
        field: "categories",
        values: categories?.values.filter((el) => {
          return el.data.inCategory === categoryId;
        }),
      }
    : {
        field: "categories",
        values: categories?.values.filter((el) => {
          return el.data.inCategory === undefined;
        }),
      };

  const handleSizeClick = (value: string) => {
    if (size) {
      if (size?.includes(value)) {
        setSize(size?.filter((item) => item !== value));
      } else {
        setSize(size?.concat(value));
      }
    }
  };
  const handleColorClick = (value: string) => {
    if (color) {
      if (color?.includes(value)) {
        setColor(color?.filter((item) => item !== value));
      } else {
        setColor(color?.concat(value));
      }
    }
  };

  const handleCompositionClick = (value: string) => {
    if (composition) {
      if (composition?.includes(value)) {
        setComposition(composition?.filter((item) => item !== value));
      } else {
        setComposition(composition?.concat(value));
      }
    }
  };

  const handleSubCategoryClick = (value?: string) => {
    if (!value) {
      setSubCategory([]);
      return;
    }
    setSubCategory([value]);
  };

  const clearFilter = () => {
    setSize([]);
    setColor([]);
    setComposition([]);
    setShowFilterMenu(false);
  };

  return (
    <div className={styles.bar}>
      <div className={styles.filter}>
        <button
          onClick={() => {
            setShowFilterMenu(!showFilterMenu);
            setShowSortMenu(false);
          }}
        >
          Filter +
        </button>
      </div>

      <div className={styles.categoryList}>
        <ul>
          {filteredSubCategories.values &&
          filteredSubCategories?.values?.length > 0 ? (
            <>
              <li
                className={
                  subCategory?.length === 0 ? styles.active : undefined
                }
              >
                <button onClick={() => handleSubCategoryClick()}>All</button>
              </li>
              {filteredSubCategories?.values?.map((item) => (
                <li
                  key={item.data.uri}
                  className={
                    subCategory && item.value === subCategory[0]
                      ? styles.active
                      : undefined
                  }
                >
                  <button onClick={() => handleSubCategoryClick(item.value)}>
                    {item.data.name[item.data.name.length - 1]}
                  </button>
                </li>
              ))}
            </>
          ) : (
            <li></li>
          )}
        </ul>
      </div>

      <div className={styles.sort}>
        <button
          className={styles.sortButton}
          onClick={() => {
            setShowSortMenu(!showSortMenu);
            setShowFilterMenu(false);
          }}
        >
          Sort +
        </button>
      </div>

      {showFilterMenu && (
        <div className={styles.filterMenu}>
          <div className={styles.filter}>
            <button onClick={() => setShowFilterMenu(!showFilterMenu)}>
              Filter -
            </button>
          </div>

          {sizes && (
            <div className={styles.filterCategory}>
              <p
                className={styles.filterName}
                onClick={(e) =>
                  e.currentTarget.parentElement?.classList.toggle(
                    styles.open as string
                  )
                }
              >
                Size
              </p>
              <div className={styles.filterOptions}>
                {sizes.values.map((item, index) => (
                  <Checkbox
                    key={item.value}
                    checked={
                      size &&
                      size?.findIndex((find) => find === item.value) > -1
                    }
                    onChange={() => handleSizeClick(item.value)}
                    label={item.value}
                    disabled={
                      filteredSizes?.values &&
                      filteredSizes.values[index]?.filterCount === 0
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {colors && (
            <div className={styles.filterCategory}>
              <p
                className={styles.filterName}
                onClick={(e) =>
                  e.currentTarget.parentElement?.classList.toggle(
                    styles.open as string
                  )
                }
              >
                Color
              </p>
              <div className={styles.filterOptions}>
                {colors.values.map((item, index) => (
                  <Checkbox
                    key={item.value}
                    checked={
                      color &&
                      color?.findIndex((find) => find === item.value) > -1
                    }
                    onChange={() => handleColorClick(item.value)}
                    label={item.value}
                    disabled={
                      filteredColors?.values &&
                      filteredColors?.values[index]?.filterCount === 0
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {compositions && (
            <div className={styles.filterCategory}>
              <p
                className={styles.filterName}
                onClick={(e) =>
                  e.currentTarget.parentElement?.classList.toggle(
                    styles.open as string
                  )
                }
              >
                Material
              </p>
              <div className={styles.filterOptions}>
                {compositions.values.map((item, index) => (
                  <Checkbox
                    key={item.value}
                    checked={
                      color &&
                      color?.findIndex((find) => find === item.value) > -1
                    }
                    onChange={() => handleCompositionClick(item.value)}
                    label={item.value}
                    disabled={
                      filteredCompositions?.values &&
                      filteredCompositions?.values[index]?.filterCount === 0
                    }
                  />
                ))}
              </div>
            </div>
          )}

          <div className={styles.footer}>
            <button onClick={clearFilter}>Clear filter</button>
            <button onClick={() => setShowFilterMenu(!showFilterMenu)}>
              Close
            </button>
          </div>
        </div>
      )}

      {showSortMenu && (
        <div className={styles.sortMenu}>
          <div className={styles.sort}>
            <button
              className={styles.sortButton}
              onClick={() => setShowSortMenu(!showSortMenu)}
            >
              Sort -
            </button>
          </div>
          {sortOrders.map((sort) => (
            <button
              className={`${styles.item} ${
                sort.value === sortOrder && styles.selected
              }`}
              onClick={() => handleSortClick(sort.value)}
              key={sort.name}
            >
              {sort.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterBar;
