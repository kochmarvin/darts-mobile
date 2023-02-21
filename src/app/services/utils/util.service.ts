import { Injectable } from '@angular/core';
import { Score } from 'src/app/types/game.types';
import { Database } from 'src/app/types/Schema';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  constructor() {}

  public getSumOfScore(score: Score) {
    let sum = 0;

    score?.game_darts?.forEach(
      (element: Database['public']['Tables']['game_darts']['Row']) => {
        if (element.value == -1) return;
        console.log(element.value);
        sum += element.value * element.multiplier;
      }
    );
    return sum;
  }

  public getTotalSumOfScores(startingPoints: number, scores: Score[]): number {
    let sum = 0;
    for (let i = scores.length - 1; i >= 0; i--) {
      const subTotal = this.getSumOfScore(scores[i]);

      scores[i].invalid =
        startingPoints - (sum + subTotal) < 0 ||
        startingPoints - (sum + subTotal) == 1 ||
        (startingPoints - (sum + subTotal) == 0 &&
          scores[i].game_darts[scores[i].game_darts.length - 1].multiplier !=
            2);

      if (scores[i].invalid) continue;

      sum += subTotal;
    }

    return sum;
  }

  public getScoreIcon(scores: Score[], score: Score) {
    if (score.invalid) {
      return '❌';
    }

    const latestScore: Score | undefined = scores[0];
    const scoreLength: number = scores.length;

    if (scores && scoreLength > 0 && score === latestScore) {
      return '✅';
    }

    return '🎯';
  }
}
