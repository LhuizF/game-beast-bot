export interface GuildModel {
  id: string;
  name: string;
  icon: string;
  channel: string;
  created_at: Date;
}

export interface UserModel {
  id: string;
  name: string;
  points: number;
  id_guild?: string;
  id_discord?: string;
  email?: string;
  password?: string;
  avatar: string;
  created_at: Date;
}
