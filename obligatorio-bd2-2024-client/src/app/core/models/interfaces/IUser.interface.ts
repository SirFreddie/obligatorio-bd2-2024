export interface IUser {
  id: number;
  name: string;
  surname: string;
  email: string;
}

export interface IStudent extends IUser {
  points: number;
}
