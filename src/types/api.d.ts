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

export interface BetModel {
  id: number;
  id_game: number;
  id_user: string;
  beast: string;
  points: number;
  status: string;
  platform: string;
  created_at: Date;
}
