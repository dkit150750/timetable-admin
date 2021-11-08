import { api } from 'src/boot/axios';
import { UserType } from 'src/types';

type UserResponse = { data: { user: UserType } };

export default {
	async login(payload: {
		login: string;
		password: string;
		device_name: string;
	}) {
		const response = (await api.post(
			'/login',
			payload
		)) as unknown as UserResponse;
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		api.defaults.headers.common.Authorization = `Bearer ${response.data.user.token}`;
		return response.data.user;
	},
	async hasLogin(payload: { login: string }) {
		return (await api.post('/has-login', payload)) as unknown as {
			data: { success: boolean; hasLogin: boolean };
		};
	},
};
