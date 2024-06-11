export interface IUser {
  user_id: number;
  name: string;
  surname: string;
  email: string;
  password?: string;
}

export interface IStudent extends IUser {
  points?: number;
  first_place_prediction: string;
  second_place_prediction: string;
}
