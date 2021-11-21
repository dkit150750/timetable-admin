<template>
	<q-page class="q-page q-pa-lg">
		<div class="q-pa-md q-mb-xl q-form-wrapper w-320">
			<q-form
				@submit="addGroup"
				@reset="onReset"
				class="q-col-gutter-y-md"
			>
				<q-input
					outlined
					v-model="groupModel.name"
					label="Группа *"
					:no-error-icon="true"
					lazy-rules
					:rules="[
						(val: string) => (!isValid || val && val.length > 0) || 'Пожалуйста, название группы',
					]"
				></q-input>

				<q-input
					outlined
					v-model="groupModel.course"
					:no-error-icon="true"
					type="number"
					label="Курс *"
					lazy-rules
					:rules="[
						(val: string) => (!isValid || val && Number(val) > 0 && Number(val) < 5) || 'Пожалуйста, курс',
					]"
				></q-input>

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

		<div class="groups-grid">
			<template v-for="(groups, index) in groupsList" :key="index">
				<q-table
					class="w-700"
					:title="`${index + 1} курс`"
					:rows="groups"
					:columns="columns"
					row-key="name"
					:filter="filter"
					:pagination="initialPagination"
					:loading="loading"
				>
					<template v-slot:top-right>
						<q-input
							outlined
							dense
							debounce="300"
							v-model="filter"
							placeholder="Поиск"
						>
							<template v-slot:append>
								<q-icon name="search" />
							</template>
						</q-input>
					</template>

					<template v-slot:header="props">
						<q-tr :props="props">
							<q-th
								v-for="col in props.cols"
								:key="col.name"
								:props="props"
							>
								{{ col.label }}
							</q-th>
							<q-th auto-width>Редактировать</q-th>
							<q-th auto-width>Удалить</q-th>
						</q-tr>
					</template>

					<template v-slot:body="props">
						<q-tr :props="props">
							<q-td
								v-for="col in props.cols"
								:key="col.name"
								:props="props"
							>
								{{ col.value }}
							</q-td>
							<q-td :width="150">
								<q-btn
									class="full-width q-py-sm q-px-xs btn-icon"
									size="sm"
									color="secondary"
									dense
									@click="openGroup(props)"
									icon="settings"
									label="Редактировать"
								/>
							</q-td>
							<q-td :width="120">
								<q-btn
									class="full-width q-py-sm q-px-xs btn-icon"
									size="sm"
									color="red"
									dense
									@click="deleteGroup(props)"
									icon="delete"
									label="Удалить"
								/>
							</q-td>
						</q-tr>
					</template>
				</q-table>
			</template>
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
import { reactive, ref, computed, nextTick } from 'vue';
import GroupService from 'src/services/GroupService';
import { LooseDictionary, useQuasar } from 'quasar';
import { GroupType } from 'src/types';

let groups = ref<GroupType[]>([]);
const loading = ref(true);

const groupsList = computed(() => [
	groups.value.filter((group) => group.course === 1),
	groups.value.filter((group) => group.course === 2),
	groups.value.filter((group) => group.course === 3),
	groups.value.filter((group) => group.course === 4),
]);

const getGroups = async () => {
	groups.value = (await GroupService.getList()).data.data;
	loading.value = false;
};

void getGroups();

const $q = useQuasar();

const groupModel = reactive({
	name: '',
	course: '',
});

const isValid = ref(true);

const addGroup = async () => {
	try {
		const paylod = {
			name: groupModel.name,
			course: Number(groupModel.course),
		};
		await GroupService.addItem(paylod);
		await getGroups();
		isValid.value = false;
		onReset();
		await nextTick();
		isValid.value = true;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		if (error.response.data.errors.name) {
			$q.notify({
				color: 'red-5',
				textColor: 'white',
				icon: 'warning',
				position: 'center',
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				message: error.response.data.errors.name as string,
			});
		}
	}
};

const onReset = () => {
	groupModel.name = '';
	groupModel.course = '';
};

const columns = [
	{
		name: 'group',
		label: 'Группа',
		align: 'left',
		field: (row: { name: string }) => row.name,
		format: (val: string) => `${val}`,
		sortable: true,
	},
];

const filter = ref('');

const initialPagination = {
	sortBy: 'desc',
	descending: false,
	page: 1,
	rowsPerPage: 10,
	// rowsNumber: xx if getting data from a server
};

const openGroup = (props: any) => {
	console.log(props);
};

const deleteGroup = async (props: { row: LooseDictionary }) => {
	try {
		await GroupService.deleteItem(props.row.id);
		await getGroups();
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	}
};
</script>
