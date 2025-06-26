import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const shoppingCartApi = createApi({
  reducerPath: "shoppingCartApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:7221/api/",
    prepareHeaders: (headers: Headers, api) => {
      const token = localStorage.getItem("token");
      token && headers.append("Authorization", "Bearer " + token);
    },
  }),
  tagTypes: ["shoppingCarts"],
  endpoints: (builder) => ({
    
    getshoppingCart: builder.query({
      query: (userId) => ({ 
        url: `shoppingcart`,
        params:{
          userId:userId
        }
      }),
      providesTags: ["shoppingCarts"],
    }),
    updateShoppingCart: builder.mutation({
      query:({menuItemId, updateQuantityBy, userId})=>({
        url: "shoppingcart",
        method:"POST",
        params:{
          menuItemId, 
          updateQuantityBy, 
          userId,
        },
      }),
      invalidatesTags: ["shoppingCarts"],  
    }),
  }),
});

export const { useGetshoppingCartQuery, useUpdateShoppingCartMutation } = shoppingCartApi;
export default shoppingCartApi;
