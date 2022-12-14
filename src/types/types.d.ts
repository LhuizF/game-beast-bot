export interface GuildModel {
  id: string;
  name: string;
  icon: string;
  channel: string;
  created_at: string;
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
  created_at: string;
  roleId: string;
}

export interface BeastModel {
  id: number;
  name: string;
  times_win: number;
}

export interface BetModel {
  id: number;
  points: number;
  id_game: number;
  status: Status;
  platform: string;
  id_beast: number;
  id_user: string;
  created_at: string;
}

export interface NewBet {
  id: number;
  id_user: string;
  beast: string;
  id_game: number;
  status: string;
  points: number;
}

export interface GameModel {
  id: number;
  time: number;
  result: number;
  created_at: string;
  update_at: string;
}

export interface GameResult extends BetsResult {
  game: GameModel;
  beastWin: BeastModel;
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

type Status = 'pending' | 'win' | 'lose';

export interface MessageError {
  mensagem: string;
  data?: any;
}
