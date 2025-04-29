export interface User {
  id?: string;
  user_name?: string | null;
  user_email?: string | null;
  user_role?: number | null;
  user_gender?: string | null;
  updated_at?: Date;
}
