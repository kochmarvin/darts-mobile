import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RealtimeChannel } from '@supabase/supabase-js';
import { SupabaseService } from 'src/app/services/supabase/supabase.service';
import { UtilService } from 'src/app/services/utils/util.service';
import { Game, GameData, GamePlayer, Score } from 'src/app/types/game.types';
import { Database } from 'src/app/types/Schema';
import { Share } from '@capacitor/share';
import Rand from 'rand-seed';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.page.html',
  styleUrls: ['./calculator.page.scss'],
})
export class CalculatorPage implements OnInit, OnDestroy {
  public activeMultiplier: number = 1;

  public currentScore: {
    game_darts: {
      value: number;
      multiplier: number;
    }[];
  } = {
    game_darts: [],
  };

  public closed: boolean = true;
  public current: number = 0;
  public games: Map<string, Game> = new Map<string, Game>();
  public gameData: GameData = {} as GameData;
  public selectedPlayer: string = '';
  public playerIds: string[] = [];
  public realTimeListeners: RealtimeChannel[] = [];
  public loaded: boolean = false;
  public currentPlayer: string = '';
  public flip: number = -1;
  public winner: Database['public']['Tables']['profiles']['Row'] | null = null;
  public math = Math;

  public startingPlayer:
    | Database['public']['Tables']['game_starters']['Row']
    | null = null;

  public latestScore:
    | Database['public']['Tables']['game_scores']['Row']
    | null = null;

  constructor(
    public supabaseService: SupabaseService,
    private route: ActivatedRoute,
    public utilService: UtilService
  ) {}

  ngOnDestroy(): void {
    this.realTimeListeners.forEach((element) => {
      element.unsubscribe();
    });
  }

  async ngOnInit(): Promise<void> {
    if (this.supabaseService.user) {
      this.selectedPlayer = this.supabaseService.user.id;
      this.playerIds.push(this.supabaseService.user.id);
    }
    
    this.resetCurrentScores();
    await this.fetchGameData();
    this.startRealtimeListeners();
    await this.checkIfMyTurn();
    this.loaded = true;
  }

  public async shareRoom() {
    await Share.share({
      title: 'Hello Darter 🎯!',
      text: `${
        this.games.get(this.supabaseService.user!.id)?.profile.nick_name
      } really wants to play a game against you.`,
      url: `http://darts.works/join?id=${this.gameData.id}`,
      dialogTitle: 'Share with a Darter',
    });
  }

  public async checkIfMyTurn(): Promise<void> {
    if (
      !this.latestScore &&
      this.supabaseService.session &&
      this.startingPlayer &&
      this.startingPlayer.profile_id === this.supabaseService.user?.id
    ) {
      this.closed = false;
    } else if (
      this.supabaseService.session &&
      this.latestScore &&
      this.latestScore.profile_id !== this.supabaseService.user?.id
    ) {
      this.closed = false;
    }
  }

  public changeSelectedPlayer($event: any) {
    this.selectedPlayer = $event.detail.value;
  }

  private resetCurrentScores() {
    this.currentScore = { game_darts: [] };
    this.currentScore.game_darts = Array(3).fill({
      value: -1,
      multiplier: 1,
    });
  }

  private startRealtimeListeners(): void {
    const gameChannel =
      this.supabaseService.supabase.channel('db-game_players');

    gameChannel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'game_players',
        filter: `game_id=eq.${this.route.snapshot.paramMap.get('id')}`,
      },
      async (payload) => {
        if (!this.supabaseService.session) {
          return;
        }

        if (payload.new['profile_id'] == this.supabaseService.user?.id) {
          return;
        }

        const { data: profile } = (await this.supabaseService.supabase
          .from('profiles')
          .select('*')
          .eq('id', payload.new['profile_id'])
          .single()) as {
          data: Database['public']['Tables']['profiles']['Row'];
        };

        if (!profile) return;

        this.playerIds.push(profile.id);

        this.games.set(profile.id, {
          profile: profile,
          points: this.gameData.starting_points,
          scores: [],
        });

        this.flipCoin();
      }
    );

    const scoreChannel =
      this.supabaseService.supabase.channel('db-game_scores');
    scoreChannel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'game_scores',
        filter: `game_id=eq.${this.route.snapshot.paramMap.get('id')}`,
      },
      async (payload) => {
        if (!this.supabaseService.session) {
          return;
        }

        const toAdd = {
          id: payload.new['id'],
          game_darts: [] as Database['public']['Tables']['game_darts']['Row'][],
          invalid: false,
        } as Score;

        let game: Game | undefined = this.games.get(payload.new['profile_id']);

        if (!game) {
          return;
        }

        game.scores.unshift(toAdd);

        this.closed =
          payload.new['profile_id'] === this.supabaseService.user?.id;

        this.selectedPlayer = this.playerIds.find(
          (id) => id != payload.new['profile_id']
        ) as string;
        return;
      }
    );

    const dartsChannel = this.supabaseService.supabase.channel('db-game_darts');

    dartsChannel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'game_darts',
        filter: `game_id=eq.${this.route.snapshot.paramMap.get('id')}`,
      },
      async (payload) => {
        let score: Score = {} as Score;
        let game: Game = {} as Game;

        for (let key of this.games.keys()) {
          const found = this.games
            .get(key)!
            .scores.find(
              (score: Score) => score.id === payload.new['score_id']
            );

          if (found) {
            game = this.games.get(key)!;
            score = found;
            break;
          }
        }

        score.game_darts = [
          ...score.game_darts,
          payload.new as Database['public']['Tables']['game_darts']['Row'],
        ];

        game.points =
          this.gameData.starting_points -
          this.utilService.getTotalSumOfScores(
            this.gameData.starting_points,
            game.scores
          );

        if (this.games.get(game.profile.id)?.points == 0) {
          this.winner = this.games.get(game.profile.id)
            ?.profile as Database['public']['Tables']['profiles']['Row'];
        }

        if (this.games.get(this.supabaseService.user!.id)!.points == 0) {
          await this.supabaseService.supabase
            .from('games')
            .update({
              running: false,
            })
            .eq('id', this.route.snapshot.paramMap.get('id'))
            .eq('running', true);
        }
      }
    );

    this.realTimeListeners.push(dartsChannel.subscribe());
    this.realTimeListeners.push(scoreChannel.subscribe());
    this.realTimeListeners.push(gameChannel.subscribe());
  }

  private async fetchGameData(): Promise<void> {
    const { data: gameData } = (await this.supabaseService.supabase
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

    console.log(gameData);

    const { data: latestScore } = (await this.supabaseService.supabase
      .from('game_scores')
      .select('*')
      .eq('game_id', this.route.snapshot.paramMap.get('id'))
      .order('created_at', {
        ascending: false,
      })) as { data: Database['public']['Tables']['game_scores']['Row'][] };

    this.latestScore = latestScore ? latestScore[0] : null;

    const { data: starterPlayer } = (await this.supabaseService.supabase
      .from('game_starters')
      .select('*')
      .eq('id', this.route.snapshot.paramMap.get('id'))) as {
      data: Database['public']['Tables']['game_starters']['Row'][];
    };

    this.startingPlayer = starterPlayer[0];

    gameData.game_players.forEach((player: GamePlayer) => {
      if (!this.playerIds.includes(player.profiles.id)) {
        this.playerIds.push(player.profiles.id);
      }
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

    console.log(starterPlayer);

    if (this.latestScore) {
      this.currentPlayer = this.playerIds.find(
        (id) => id != this.latestScore?.profile_id
      )!;
    } else if (starterPlayer.length > 0 && this.playerIds.length > 1) {
      this.currentPlayer = starterPlayer[0].id;
    }
  }

  public undoScore() {
    if (this.current == 0) {
      return;
    }

    this.currentScore.game_darts[--this.current] = {
      value: -1,
      multiplier: 1,
    };
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
      return;
    }

    this.currentScore.game_darts[this.current++] = {
      multiplier: this.activeMultiplier,
      value: value,
    };

    this.activeMultiplier = 1;
  }

  public flipCoin(): void {
    if (this.startingPlayer) {
      return;
    }

    setTimeout(() => {
      this.flip = Math.floor(
        new Rand(this.route.snapshot.paramMap.get('id')!).next() * 2
      );

      setTimeout(async () => {
        if (!this.supabaseService.session) {
          return;
        }

        const myId = this.supabaseService.user?.id;

        const winner =
          this.flip === 0 ? this.playerIds.find((id) => id != myId) : myId;

        this.selectedPlayer = winner!;
        this.currentPlayer = winner!;

        console.log(winner);

        if (winner === this.supabaseService.user?.id) {
          const { data: starter } = await this.supabaseService.supabase
            .from('game_starters')
            .insert({
              id: this.route.snapshot.paramMap.get('id'),
              profile_id: this.supabaseService.user?.id,
            });
          this.closed = false;
        }

        this.startingPlayer =
          {} as Database['public']['Tables']['game_starters']['Row'];
      }, 3000);
    }, 1000);
  }

  public async score() {
    const { data: newScore, error } = await this.supabaseService.supabase
      .from('game_scores')
      .insert({
        profile_id: this.supabaseService.user?.id,
        game_id: this.route.snapshot.paramMap.get('id'),
      })
      .select()
      .single();

    this.currentScore.game_darts.forEach(async (element) => {
      await this.supabaseService.supabase.from('game_darts').insert({
        value: element.value,
        multiplier: element.multiplier,
        score_id: newScore.id,
        game_id: this.route.snapshot.paramMap.get('id'),
      });
    });

    this.current = 0;
    this.resetCurrentScores();
  }
}
