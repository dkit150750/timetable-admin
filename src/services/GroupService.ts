import { api } from 'src/boot/axios';
import { GroupType, ItemResponse, ListResponse } from 'src/types';

export default {
	async getList() {
		return (await api.get('/groups')) as unknown as ListResponse<GroupType>;
	},

	async getCourseItems(course: number) {
		return (await api.get(
			`/courses/${course}/groups`
		)) as unknown as ListResponse<GroupType>;
	},

	// async getItem(slug: string): Promise<ItemResponse> {
	// 	return (await api.get(`/groups/${slug}`)) as unknown as ItemResponse;
	// },

	async addItem(payload: {
		name: string;
		course: number;
	}): Promise<ItemResponse<GroupType>> {
		return (await api.post(
			'/groups',
			payload
		)) as unknown as ItemResponse<GroupType>;
	},

	// async updateItem(
	// 	id: number,
	// 	payload: { name?: string; course?: number }
	// ): Promise<ItemResponse> {
	// 	return (await api.put(
	// 		`/groups/${id}`,
	// 		payload
	// 	)) as unknown as ItemResponse;
	// },

	async deleteItem(slug: string): Promise<{ id: number }> {
		return (await api.delete(`/groups/${slug}`)) as unknown as {
			id: number;
		};
	},

	async fresh(day: string): Promise<void> {
		await api.put('/groups/fresh-changes', {
			day,
		});
	},
};
