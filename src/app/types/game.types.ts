import { Database } from './Schema';

type GameScores = Database['public']['Tables']['game_scores']['Row'] & {
  game_darts: Database['public']['Tables']['game_darts']['Row'][];
};

type GamePlayer = Database['public']['Tables']['game_players']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row'];
  game_scores: GameScores[];
};

type GameData = Database['public']['Tables']['games']['Row'] & {
  game_type: Database['public']['Tables']['game_types']['Row'];
  game_players: GamePlayer[];
  game_keys: Database['public']['Tables']['game_keys']['Row'];
};

type Score = Database['public']['Tables']['game_scores']['Row'] & {
  game_darts: Database['public']['Tables']['game_darts']['Row'][];
  invalid: boolean;
};

type Game = {
  points: number;
  profile: Database['public']['Tables']['profiles']['Row'];
  scores: Score[];
};

interface Dart {
  amount: number;
  multiplier: number;
}

export { GameScores, GamePlayer, GameData, Score, Game, Dart };
