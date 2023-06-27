import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import profileApi from "../../modules/Profile/apis/profileApi";
import * as models from "../../modules/Profile/models";
import { logout } from "./authSlice";

// First, create the thunk
export const fetchUserProfile = createAsyncThunk(
  "profiles/fetchUserProfile",
  async (_, thunkApi) => {
    try {
      return await profileApi.fetch();
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

const initialState: ProfileState = {
  user: {
    message: "",
    data: {
      id: "",
      email: "",
      fullname: "",
      phoneNum: "",
      address: "",
      status: "",
      role: "",
    },
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
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder
      .addCase(
        fetchUserProfile.fulfilled,
        (state, action: PayloadAction<models.User>) => {
          state.user = action.payload;
        }
      )
      .addCase(fetchUserProfile.rejected, (state) => {
        state.user = {
          ...initialState.user,
        };
      });
  },
});

// Action creators are generated for each case reducer function
export const { remove } = profileSlice.actions;

export default profileSlice.reducer;
