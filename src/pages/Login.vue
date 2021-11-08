<template>
	<q-page class="q-page row items-center justify-evenly">
		<div class="q-pa-lg q-form-wrapper login-form">
			<q-form
				@submit="onSubmit"
				@reset="onReset"
				class="q-col-gutter-y-md"
			>
				<q-input
					outlined
					v-model="userModel.login"
					label="Ваш логин *"
					:no-error-icon="true"
					:autofocus="true"
					lazy-rules
					:rules="[
						hasLogin,
						(value: string) => (value && value.length > 0) || 'Пожалуйста, введите логин',
					]"
				></q-input>

				<q-input
					outlined
					v-model="userModel.password"
					:no-error-icon="true"
					:type="isPwd ? 'password' : 'text'"
					label="Ваш пароль *"
					lazy-rules
					:rules="[
						(value: string) => (value && value.length > 0) || 'Пожалуйста, введите пароль',
					]"
				>
					<template v-slot:append>
						<q-icon
							:name="isPwd ? 'visibility_off' : 'visibility'"
							class="cursor-pointer"
							@click="isPwd = !isPwd"
						/>
					</template>
				</q-input>

				<div class="flex justify-between">
					<q-btn
						unelevated
						label="Войти"
						type="submit"
						color="primary"
						class="q-ml-none"
					></q-btn>
					<q-btn
						label="Сбросить"
						type="reset"
						color="secondary"
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
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from 'src/services/AuthService';

const $q = useQuasar();
const store = useUserStore();
const router = useRouter();

const isPwd = ref(true);

const userModel = reactive({
	login: 'admin',
	password: 'password',
	device_name: 'teleskop',
});

const hasLogin = async (login: string) => {
	const result = await AuthService.hasLogin({ login });
	console.log(result);

	return result.data.hasLogin || 'Неверный логин';
};

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
	max-width: 350px;
	width: 100%;
}
</style>
