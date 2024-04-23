import { createSlice } from "@reduxjs/toolkit";

export const menuSlice = createSlice({
	name: "menuList",
	initialState: { value: [] },
	reducers: {
		setMenu: (state, action) => {
			const menu = action.payload;
			//Processing JSON dictionary into a JS Set
			menu.forEach(
				(item) => (item.allergens = new Set(Object.keys(item.allergens)))
			);
			//console.log(menu);
			state.value = menu;
		},
	},
});

export const { setMenu } = menuSlice.actions;
export const selectMenu = (state) => state.menu.value;
export default menuSlice.reducer;
