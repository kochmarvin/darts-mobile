import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewInit,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SupabaseService } from 'src/app/services/supabase/supabase.service';
import { UtilService } from 'src/app/services/utils/util.service';
import { Game, GameData, GamePlayer, Score } from 'src/app/types/game.types';
import { Database } from 'src/app/types/Schema';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.page.html',
  styleUrls: ['./calculator.page.scss'],
})
export class CalculatorPage implements OnInit {
  public activeMultiplier = 1;
  public currentScore = {
    game_darts: [
      {
        value: -1,
        multiplier: 1,
      },
      {
        value: -1,
        multiplier: 1,
      },
      {
        value: -1,
        multiplier: 1,
      },
    ],
  };
  public current = 0;
  public games: Map<string, Game> = new Map<string, Game>();
  public gameData: GameData = {} as GameData;
  public selectedPlayer: string = '';

  public startingPlayer:
    | Database['public']['Tables']['game_starters']['Row']
    | null = null;
  public latestScore:
    | Database['public']['Tables']['game_scores']['Row'][]
    | null = null;
  await: any;

  public undoScore() {
    if (this.current == 0) {
      return;
    }

    this.currentScore.game_darts[--this.current] = {
      value: -1,
      multiplier: 1,
    };
  }

  constructor(
    public supabaseService: SupabaseService,
    private route: ActivatedRoute,
    public utilService: UtilService
  ) {}

  async ngOnInit() {
    this.selectedPlayer =
      (await this.supabaseService.getUser())?.id.toString() || '';

    this.fetchGameData();
  }

  public changeSelectedPlayer($event: any) {
    console.log($event);
    this.selectedPlayer = $event.detail.value;
  }

  private async fetchGameData() {
    const { data: gameData } = (await this.supabaseService
      .getSupabase()
      .from('games')
      .select(
        `id,
        starting_points,
              game_type(*),
              game_players(
                  profiles(*),
                  game_scores(
                      id,
                      game_darts(*)
                  )
              ),
              game_keys(*)`
      )
      .eq('id', this.route.snapshot.paramMap.get('id'))
      .order('created_at', {
        ascending: true,
      })
      .order('created_at', {
        foreignTable: 'game_players.game_scores',
        ascending: false,
      })
      .single()) as { data: GameData };

    this.gameData = gameData;

    const { data: latestScore } = (await this.supabaseService
      .getSupabase()
      .from('game_scores')
      .select('*')
      .eq('game_id', this.route.snapshot.paramMap.get('id'))
      .order('created_at', {
        ascending: false,
      })) as { data: Database['public']['Tables']['game_scores']['Row'][] };

    const { data: starterPlayer } = (await this.supabaseService
      .getSupabase()
      .from('game_starters')
      .select('*')
      .eq('id', this.route.snapshot.paramMap.get('id'))
      .single()) as {
      data: Database['public']['Tables']['game_starters']['Row'];
    };

    gameData.game_players.forEach((player: GamePlayer) => {
      this.games.set(player.profiles.id, {
        points:
          gameData.starting_points -
          this.utilService.getTotalSumOfScores(
            this.gameData.starting_points,
            player.game_scores as Score[]
          ),
        profile:
          player.profiles as Database['public']['Tables']['profiles']['Row'],
        scores: player.game_scores as Score[],
      });
    });

    console.log(this.games);
  }

  public formatNumber(amount: number, multiplier: number) {
    if (amount == 25 && multiplier == 2) return 'Bull';
    return (
      multiplier
        .toString()
        .replace('1', '')
        .replace('2', 'D')
        .replace('3', 'T') + amount
    );
  }

  public setMultiplier(multiplier: number) {
    if (multiplier === this.activeMultiplier) {
      this.activeMultiplier = 1;
      return;
    }

    this.activeMultiplier = multiplier;
  }

  public addScore(value: number) {
    if (this.current == 3) {
      console.error('You entered all numbers');
      return;
    }

    this.currentScore.game_darts[this.current++] = {
      multiplier: this.activeMultiplier,
      value,
    };

    this.activeMultiplier = 1;
  }

  public async score() {
    const { data: newScore, error } = await this.supabaseService
      .getSupabase()
      .from('game_scores')
      .insert({
        profile_id: (await this.supabaseService.session())?.user.id,
        game_id: this.route.snapshot.paramMap.get('id'),
      })
      .select()
      .single();

    this.currentScore.game_darts.forEach(async (element) => {
      await this.supabaseService
        .getSupabase()
        .from('game_darts')
        .insert({
          value: element.value,
          multiplier: element.multiplier,
          score_id: newScore.id,
          game_id: this.route.snapshot.paramMap.get('id'),
        });
    });

    this.currentScore = {
      game_darts: [
        {
          value: -1,
          multiplier: 1,
        },
        {
          value: -1,
          multiplier: 1,
        },
        {
          value: -1,
          multiplier: 1,
        },
      ],
    };
  }
}
