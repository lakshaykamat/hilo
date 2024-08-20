export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  profilePicture: string;
  status: string;
  role: string;
  token?: string;
  followers?: any[];
  following?: any[];
  createdAt: string;
  updatedAt: string;
}
