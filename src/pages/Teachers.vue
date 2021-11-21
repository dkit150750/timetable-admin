<template>
	<q-page class="q-page q-pa-lg">
		<div class="q-pa-md q-mb-xl q-form-wrapper w-320">
			<q-form
				@submit="addItem"
				@reset="onReset"
				class="q-col-gutter-y-md"
			>
				<q-input
					outlined
					v-model="dataModel.name"
					label="Преподаватель *"
					:no-error-icon="true"
					lazy-rules
					:rules="[
						(val: string) => (!isValid || val && val.length > 0) || 'Пожалуйста, название группы',
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
			<q-table
				class="w-700"
				title="Преподаватели"
				:rows="list"
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
								v-if="props.row.id > 2"
								class="full-width q-py-sm q-px-xs btn-icon"
								size="sm"
								color="secondary"
								dense
								@click="openItem(props)"
								icon="settings"
								label="Редактировать"
							/>
						</q-td>
						<q-td :width="120">
							<q-btn
								v-if="props.row.id > 2"
								class="full-width q-py-sm q-px-xs btn-icon"
								size="sm"
								color="red"
								dense
								@click="deleteItem(props)"
								icon="delete"
								label="Удалить"
							/>
						</q-td>
					</q-tr>
				</template>
			</q-table>
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
import { reactive, ref, nextTick } from 'vue';
import { LooseDictionary, useQuasar } from 'quasar';
import { DisciplineService } from 'src/services/';
import { DisciplineType } from 'src/types';

let list = ref<DisciplineType[]>([]);
const loading = ref(true);

const getDiscipline = async () => {
	list.value = (await DisciplineService.getList()).data.data;
	loading.value = false;
};
void getDiscipline();

const $q = useQuasar();

const dataModel = reactive({
	name: '',
});

const isValid = ref(true);

const addItem = async () => {
	try {
		const paylod = {
			name: dataModel.name,
		};
		await DisciplineService.addItem(paylod);
		await getDiscipline();
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
	dataModel.name = '';
};

const columns = [
	{
		name: 'group',
		label: 'Дисциплина',
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

const openItem = (props: any) => {
	console.log(props);
};

const deleteItem = async (props: { row: LooseDictionary }) => {
	try {
		await DisciplineService.deleteItem(props.row.id);
		await getDiscipline();
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	}
};
</script>
