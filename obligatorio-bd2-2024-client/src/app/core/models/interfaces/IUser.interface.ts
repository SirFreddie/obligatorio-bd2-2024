export interface IUser {
  user_id: number;
  name: string;
  surname: string;
  email: string;
  password?: string;
  role?: string;
}

export interface IStudent extends IUser {
  points?: number;
  career: number;
  first_place_prediction: string;
  second_place_prediction: string;
}
