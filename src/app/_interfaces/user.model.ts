export interface User {
  id: number;               // Matches IdentityUser<int>
  firstName: string;
  lastName: string;
  level?: string;
  gender?: string;
  weight?: number;
  height?: number;
  age?: number;
  createdAt?: Date;
  email: string;
  userName: string;         // Identity fields
}
