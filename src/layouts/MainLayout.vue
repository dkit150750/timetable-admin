<template>
	<q-layout view="hHh LpR fFf">
		<q-header elevated class="text-white">
			<q-toolbar>
				<q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
				<q-toolbar-title> DKIT </q-toolbar-title>

				<TheThemeWrapper />
			</q-toolbar>
		</q-header>

		<q-drawer
			:width="250"
			show-if-above
			v-model="leftDrawerOpen"
			side="left"
			bordered
		>
			<q-list padding>
				<q-item
					class="items-center justify-between mobile-nav-controller"
				>
					<span class="text-h6">Меню</span>
					<q-btn
						unelevated
						icon="west"
						@click="leftDrawerOpen = false"
					/>
				</q-item>
				<EssentialLink
					v-for="link in linksList"
					:key="link.title"
					v-bind="link"
				/>
			</q-list>
			<q-item class="items-center">
				<q-btn unelevated label="Выход" @click="logout" />
			</q-item>
		</q-drawer>

		<q-page-container>
			<router-view />
		</q-page-container>
	</q-layout>
</template>

<script lang="ts">
import { preFetch } from 'quasar/wrappers';
import { auth } from 'src/middleware/autch';

export default {
	preFetch: preFetch((context) => {
		auth(context);
	}),
};
</script>

<script setup lang="ts">
import { ref } from 'vue';
import TheThemeWrapper from 'components/TheThemeWrapper.vue';
import EssentialLink from 'components/EssentialLink.vue';
import { useUserStore } from 'src/pinia/user';
import { useRouter } from 'vue-router';

const router = useRouter();
const leftDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
	leftDrawerOpen.value = !leftDrawerOpen.value;
};

async function logout() {
	const userStore = useUserStore();
	userStore.logout();
	await router.push('/login');
}

const linksList = [
	{
		title: 'Главная',
		icon: 'home',
		link: '/',
	},
	{
		title: 'Группы',
		icon: 'school',
		link: '/groups',
	},
	{
		title: 'Изменения',
		icon: 'change_circle',
		link: '/changes',
	},
	{
		title: 'Преподаватели',
		icon: 'person_outline ',
		link: '/teachers',
	},
	{
		title: 'Дисциплины',
		icon: 'architecture',
		link: '/disciplines',
	},
	{
		title: 'Кабинеты',
		icon: 'filter_1',
		link: '/cabinets',
	},
	{
		title: 'Время',
		icon: 'schedule',
		link: '/times',
	},
];
</script>

<style lang="scss">
.mobile-nav-controller {
	@media (min-width: 768px) {
		display: none;
	}
}
</style>
