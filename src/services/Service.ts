import { api } from 'src/boot/axios';
import { ListResponse, ItemResponse } from 'src/types';
import { IService } from './Iservice';

export class Service<T> implements IService<T> {
	constructor(private path: string) {}
	async getItem(id: number) {
		return (await api.get(`/${this.path}/${id}`)) as unknown as ItemResponse<T>;
	}
	async getList() {
		return (await api.get(`/${this.path}`)) as unknown as ListResponse<T>;
	}
	async addItem(payload: { name: string }) {
		return (await api.post(
			`/${this.path}`,
			payload
		)) as unknown as ItemResponse<T>;
	}
	async updateItem(id: number, payload: { name: string }) {
		await api.put(`/${this.path}/${id}`, payload);
	}
	async deleteItem(id: number) {
		await api.delete(`/${this.path}/${id}`);
	}
}
