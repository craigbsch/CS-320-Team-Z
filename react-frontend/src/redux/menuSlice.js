import { createSlice } from "@reduxjs/toolkit";

export const menuSlice = createSlice({
	name: "menuList",
	initialState: { value: [] },
	reducers: {
		setMenu: (state, action) => {
			const menu = action.payload;
			// menu.forEach(
			// 	(item) => (item.allergens = new Set(Object.keys(item.allergens)))
			// );
			state.value = menu;
		},
	},
});

export const { setMenu } = menuSlice.actions;
export const selectMenu = (state) => state.menu.value;
export default menuSlice.reducer;
