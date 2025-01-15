export interface AuthContextProps {
  user: UserProps | null;
  logout: () => void;
}

export interface UserProps {
  id: string;
  display_name: string;
  images: { url: string; height: number; width: number }[];
}
