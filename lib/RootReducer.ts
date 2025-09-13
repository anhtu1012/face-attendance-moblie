import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./features/loginSlice";

// import darkModeReducer from "./store/slices/darkModeSlice";

const rootReducer = combineReducers({
  auth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
