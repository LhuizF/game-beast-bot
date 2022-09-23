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

export interface BeastModel {
  id: number;
  name: string;
  times_win: number;
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

export interface GameModel {
  id: number;
  time: number;
  result: number;
  created_at: Date;
  update_at: Date;
}

export interface GameResult extends BetsResult {
  id_game: number;
  beastWin: BeastModel | null;
  create_at: Date;
  date: Date;
}

export interface BetsResult {
  totalBets: number;
  winners: UserWin[];
  losers: number;
}

export interface UserWin {
  id: string;
  name: string;
  avatar: string;
  pointsBet: number;
  pointsReceived: number;
}
