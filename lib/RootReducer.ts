import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./features/loginSlice";
import drawerReducer from "./features/drawerSlice";

// import darkModeReducer from "./store/slices/darkModeSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  drawer: drawerReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
