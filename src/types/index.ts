export type UserType = {
	id: number;
	login: string;
	token: string;
};

export type CabinetType = {
	id: number;
	name: string;
};

export type DisciplineType = {
	id: number;
	name: string;
};

export type TeacherType = {
	id: number;
	name: string;
};

export type GroupInfo = {
	id: number;
	name: string;
	slug: string;
	course: number;
};

export type TimeType = {
	first: string;
	second: string;
	third: string;
	fourth: string;
	fifth: string;
};

export type ResponseError = {
	response: {
		status: number;
		data: {
			errors: unknown;
		};
	};
};
