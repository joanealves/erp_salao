export type Client = {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  created_at: string;
  last_visit: string | null;
  total_visits: number;
};

export type ClientFormData = {
  name: string;
  phone: string;
  email: string;
};
