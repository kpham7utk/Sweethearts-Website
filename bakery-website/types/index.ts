export interface ClassData {
    id: number;
    title: string;
    description: string;
    price: number;
    max_spots: number;
    duration: number;
    date: string;
    time: string;
    spots_remaining: number;
    is_active: boolean;
  }
  
  export interface RegistrationFormData {
    name: string;
    email: string;
    phone: string;
    participants: number;
    specialRequirements?: string;
  }