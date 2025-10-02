type Role = 'USER' | 'ADMIN';
export interface JwtPayload {
  id: number;
  role: Role;
}
