export interface IUser {
  user_id: number;
  name: string;
  surname: string;
  email: string;
  password?: string;
}

export interface IStudent extends IUser {
  points: number;
  campeon: string;
  subcampeon: string;
}
