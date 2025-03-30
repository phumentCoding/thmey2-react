import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import category from "../services/category";

// Async action to fetch categories
export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await category.getAllCategory();
      console.log("API Response (fetchCategories):", response.data);
      return response.data.categories; // Ensure API response matches this structure
    } catch (error) {
      console.error("Fetch Categories Error:", error);
      return rejectWithValue(error.response?.data || "Failed to fetch categories");
    }
  }
);

// Async action to create a new category
export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (newCategory, { rejectWithValue, dispatch }) => {
    try {
      const response = await category.createCategory(newCategory);
      console.log("API Response (createCategory):", response.data);
      dispatch(fetchCategories()); // Automatically refresh category list after adding
      return response.data;
    } catch (error) {
      console.error("Create Category Error:", error);
      return rejectWithValue(error.response?.data || "Failed to create category");
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = action.payload; // Ensure categories update correctly
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
      })
      // Create category
      .addCase(createCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default categorySlice.reducer;
