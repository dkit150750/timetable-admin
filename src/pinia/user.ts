import { reactive } from 'vue';
import { defineStore } from 'pinia';
import { UserType } from 'src/types';
import AuthService from 'src/services/AuthService';
import { api } from 'src/boot/axios';

export const useUserStore = defineStore('user', () => {
	const user: { data: UserType | null } = reactive({ data: null });

	async function login(payload: {
		login: string;
		password: string;
		device_name: string;
	}) {
		try {
			const userData = await AuthService.login(payload);
			user.data = userData;

			localStorage.setItem('user', JSON.stringify(userData));
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			localStorage.removeItem('user');
			throw error;
		}
	}

	function logout() {
		user.data = null;
		localStorage.removeItem('user');
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		delete api.defaults.headers.common.Authorization;
	}

	function getAuthUser() {
		const userLocal = localStorage.getItem('user');
		const userData = userLocal ? (JSON.parse(userLocal) as UserType) : null;
		if (userData) {
			const token = userData.token;
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			api.defaults.headers.common.Authorization = `Bearer ${token}`;
			user.data = userData;
		}
	}

	return {
		user,
		login,
		logout,
		getAuthUser,
	};
});
