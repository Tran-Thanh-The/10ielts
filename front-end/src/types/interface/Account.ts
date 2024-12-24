export interface Account {
  email?: string;
  password?: string;
}

export interface IRole {
  id: number;
  name: string;
  permissons: string[];
}
