import { ItemResponse, ListResponse } from 'src/types';

export interface IService<T> {
	getList(): Promise<ListResponse<T>>;
	getItem(id: number): Promise<ItemResponse<T>>;
	addItem(payload: { name: string }): Promise<ItemResponse<T>>;
	updateItem(id: number, payload: { name: string }): void;
	deleteItem(id: number): void;
}

