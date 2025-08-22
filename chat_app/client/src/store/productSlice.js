import { createSlice } from '@reduxjs/toolkit';
//검색용
const initialState = {
  list: [], //상품목록
  selectedProduct: null, //현재선택한 상품
  searchKeyword: '', //검색어
  categoryFilter: null, //카테고리
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProductList: (state, action) => {
      state.list = action.payload;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setSearchKeyword: (state, action) => {
      state.searchKeyword = action.payload;
    },
    setCategoryFilter: (state, action) => {
      state.categoryFilter = action.payload;
    },
  },
});

export const { setProductList, setSelectedProduct, setSearchKeyword, setCategoryFilter } = productSlice.actions;

export default productSlice.reducer;
