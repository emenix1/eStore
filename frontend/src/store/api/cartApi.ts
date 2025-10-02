import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../store/index";
export interface Item {
  id: number;
  productId: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
  };
}

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/cart",
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Cart"],
  endpoints: (builder) => ({
    addItem: builder.mutation<Item, { productId: number; quantity: number }>({
      query: (body) => ({
        url: "/add",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),
    getItems: builder.query<Item[], void>({
  query: () => "",
  transformResponse: (response: { items: Item[] }) => {
    return response.items || [];
  },
  providesTags: (result) =>
    result && Array.isArray(result)
      ? [
          ...result.map(({ id }) => ({ type: "Cart" as const, id })),
          { type: "Cart", id: "LIST" },
        ]
      : [{ type: "Cart", id: "LIST" }],
}),
    deleteItem: builder.mutation<void, number>({
      query: (id) => ({
        url: `item/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useAddItemMutation,
  useDeleteItemMutation,
  useGetItemsQuery,
} = cartApi;