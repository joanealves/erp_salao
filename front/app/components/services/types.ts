export type Service = {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
};

export type ServiceFormData = {
  name: string;
  description: string;
  price: number | null;
  duration: number | null;
};
