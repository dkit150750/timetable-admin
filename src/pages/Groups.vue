<template>
	<q-page class="q-page q-pa-lg">
		<div class="q-pa-md q-form-wrapper q-form-w-320">
			<q-form
				@submit="onSubmit"
				@reset="onReset"
				class="q-col-gutter-y-md"
			>
				<q-input
					outlined
					v-model="groupModel.name"
					label="Ваш логин *"
					:no-error-icon="true"
					:autofocus="true"
					lazy-rules
					:rules="[
						(val: string) => (val && val.length > 0) || 'Пожалуйста, введите логин',
					]"
				></q-input>

				<q-input
					outlined
					v-model="groupModel.course"
					:no-error-icon="true"
					type="number"
					label="Ваш пароль *"
					lazy-rules
					:rules="[
						(val: string) => (val && val.length > 0) || 'Пожалуйста, введите пароль',
					]"
				>
				</q-input>

				<div class="flex justify-between">
					<q-btn
						unelevated
						label="Добавить"
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
import { reactive, ref } from 'vue';
import GroupService from 'src/services/GroupService';
import { useQuasar } from 'quasar';
import { computed } from 'vue';

const getGroups = async () => {
	const groupsAll = await GroupService.getGroups();
	// const groupsFirst = computed(() => groupsAll);
	console.log(groupsAll);
};
void getGroups();

const $q = useQuasar();

const groupModel: { name: string | null; course: number | null } = reactive({
	name: '4-П-1',
	course: 4,
});

const onSubmit = () => {
	try {
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
	groupModel.name = null;
	groupModel.course = null;
};
</script>
