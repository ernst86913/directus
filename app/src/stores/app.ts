import { createStore } from 'pinia';

export const useAppStore = createStore({
	id: 'appStore',
	state: () => ({
		navCollapse: false,  // Smart Change
		sidebarOpen: false,
		hydrated: false,
		hydrating: false,
		error: null,
		authenticated: false,
	}),
});
