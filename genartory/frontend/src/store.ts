import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * Represents a customer event.
 */
export interface CustomerEvent {
  userName: string;
}

/**
 * Represents the state of the customer.
 */
export interface CustomerState {
  userName: string;
}

/**
 * Represents the initial state of the customer.
 */
const initialState: CustomerState = {
  userName: "",
};

/**
 * Represents the client Redux store.
 */
export const clientReduxStore = createSlice({
  name: "clientReduxStore",
  initialState,
  reducers: {
    /**
     * Sets the user name in the state.
     * @param state - The current state.
     * @param action - The action containing the payload.
     */
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
    },
  },
});

export const {
  setUserName,
} = clientReduxStore.actions;

export default clientReduxStore.reducer;
