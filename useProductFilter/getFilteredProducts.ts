import axios from "axios";



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

interface getFilteredProductParams {
  category: string[];
  size?: string[];
  color?: string[];
  composition?: string[];
  search?: string;
  subCategory?: string[];
  sortOrder?: ISortOrder[];
  pageParam: any;
}

export interface IFilterResponse {
  token: string;
  products: any[];
  productCount: number;
  filter: IFilter[];
}

export interface ISortOrder {
  field: string;
  order: "asc" | "desc";
}

const tokenKey = "" /* secret */
const apiUrl = "" /* secret */

export const productsPerPage = 16;

const getFilteredProducts = async ({
  category,
  size,
  color,
  composition, // TODO check naming for material
  search,
  subCategory,
  sortOrder,
  pageParam: { pageParam = 0 },
}: getFilteredProductParams) => {
  if (!tokenKey) {
    throw new Error("No token key found");
  }
  let customerToken;
  if (typeof window !== "undefined") {
    customerToken = localStorage.getItem(tokenKey);
  }
  try {
    const testuri =
      category.length > 0
        ? { uri: category.join("/"), for: ["category"] }
        : undefined;

    const res = await axios.post<IFilterResponse>(
      `${apiUrl}/products`,
      {
        uri: testuri,

        "sizes.name": size,
        onlyAvailable: size && size?.length > 0,
        "colors.name": color,
        "compositions.name": composition,
        limit: productsPerPage,
        skipFirst: pageParam * productsPerPage,
        search: search || "",
        sortOrder: sortOrder || [],
        categories: subCategory || [],
      },
      {
        headers: {
          "API-token": customerToken || "",
        },
      }
    );


    return { ...res.data, products: res.data.products };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.message);
    } else {
      throw new Error("Unexpected error");
    }
  }
};

export default getFilteredProducts;
