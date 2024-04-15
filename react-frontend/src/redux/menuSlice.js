import { createSlice } from "@reduxjs/toolkit";

export const menuSlice = createSlice({
	name: "menuList",
	initialState: { value: [] },
	reducers: {
		setMenu: (state, action) => {
			state.value = action.payload;
		},
	},
});

export const { setMenu } = menuSlice.actions;
export const selectMenu = (state) => state.menu.value;
export default menuSlice.reducer;
