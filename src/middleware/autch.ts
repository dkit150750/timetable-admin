import { PreFetchOptions } from '@quasar/app';
import { useUserStore } from 'src/pinia/user';

const userStore = useUserStore();

export function auth(context: PreFetchOptions<unknown>) {
	if (!userStore.user.data) {
		userStore.getAuthUser();
		if (!userStore.user.data) {
			context.redirect({ path: '/login' });
		}
	}
}
