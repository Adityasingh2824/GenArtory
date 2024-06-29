import { createSlice } from "@reduxjs/toolkit";

export interface CustomerEvent {
  userName: string;
  
}

export interface CustomerState {
  userName: string;
  
};

const initialState: CustomerState = {
  userName: "",
  
};

export const clientReduxStore = createSlice({
  name: "clientReduxStore",
  initialState,
  reducers: {
    setUserName: (state, action) => {
      state.userName = action.payload;
    },


  },
});

export const {
    setUserName,

} = clientReduxStore.actions;

export default clientReduxStore.reducer;
