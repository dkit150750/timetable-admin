<template>
	<q-page class="q-page row items-center justify-evenly">
		<div class="q-pa-md login-form">
			<q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
				<q-input
					filled
					v-model="userModel.login"
					label="Ваш логин *"
					:no-error-icon="true"
					:autofocus="true"
					lazy-rules
					:rules="[
              (val: string) => (val && val.length > 0) || 'Пожалуйста, введите логин',
            ]"
				></q-input>

				<q-input
					filled
					type="password"
					v-model="userModel.password"
					:no-error-icon="true"
					label="Ваш пароль *"
					lazy-rules
					:rules="[
              (val: string) => (val && val.length > 0) || 'Пожалуйста, введите пароль',
            ]"
				></q-input>

				<div>
					<q-btn label="Войти" type="submit" color="primary"></q-btn>
					<q-btn
						label="Сбросить"
						type="reset"
						color="primary"
						flat
						class="q-ml-sm"
					></q-btn>
				</div>
			</q-form>
		</div>
	</q-page>
</template>

<script setup lang="ts">
import { useUserStore } from 'src/pinia/user';
import { useQuasar } from 'quasar';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const $q = useQuasar();
const store = useUserStore();
const router = useRouter();

const userModel = reactive({
	login: 'admin',
	password: 'password',
	device_name: 'teleskop',
});

const onSubmit = async () => {
	try {
		await store.login(userModel);
		await router.push('/');
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		$q.notify({
			color: 'red-5',
			textColor: 'white',
			icon: 'warning',
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			message: error.response.data.errors.data[0] as string,
		});
	}
};

const onReset = () => {
	userModel.login = '';
	userModel.password = '';
};
</script>

<style>
.login-form {
	max-width: 400px;
	width: 100%;
}
</style>
