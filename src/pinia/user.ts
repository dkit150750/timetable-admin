import { reactive } from 'vue';
import { defineStore } from 'pinia';
import { UserType } from 'src/types';

export const useUserStore = defineStore('user', () => {
	const user: { data: UserType | null } = reactive({ data: null });

	function login(data: UserType | null) {
		user.data = data;
	}

	function logout() {
		user.data = null;
	}

	return {
		user,
		login,
		logout,
	};
});
