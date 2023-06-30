import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import profileApi from "../../modules/Profile/apis/profileApi";
import * as models from "../../modules/Profile/models";
import { logout } from "./authSlice";

// Define a key for storing user data in local storage
const USER_STORAGE_KEY = "user";

// First, create the thunk
export const fetchUserProfile = createAsyncThunk(
  "profiles/fetchUserProfile",
  async (_, thunkApi) => {
    try {
      const userData = await profileApi.fetch();
      // Store the user data in local storage
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      return userData;
    } catch (error) {
      thunkApi.dispatch(remove());
      thunkApi.dispatch(logout());
      return Promise.reject(error);
    }
  }
);

export interface ProfileState {
  user: models.User;
}

const storedUser = localStorage.getItem(USER_STORAGE_KEY);
const initialState: ProfileState = {
  user: storedUser ? JSON.parse(storedUser) : {
    message: "",
    data: {
      id: "",
      email: "",
      fullname: "",
      phoneNum: "",
      address: "",
      status: "",
      role: "",
    }
  },
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    remove: (state) => {
      state.user = {
        ...initialState.user,
      };
      // Clear the user data from local storage
      localStorage.removeItem(USER_STORAGE_KEY);
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder
      .addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<models.User>) => {
        state.user = action.payload;
        // Update the user data in local storage
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(action.payload));
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.user = {
          ...initialState.user,
        };
        // Clear the user data from local storage
        localStorage.removeItem(USER_STORAGE_KEY);
      });
  },
});

// Action creators are generated for each case reducer function
export const { remove } = profileSlice.actions;

export default profileSlice.reducer;
