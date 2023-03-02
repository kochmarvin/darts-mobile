import { Injectable } from '@angular/core';
import { checkoutTable } from 'src/app/pages/game/checkout.table';
import { Score } from 'src/app/types/game.types';
import { Database } from 'src/app/types/Schema';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  constructor() {}

  public formatNumber(amount: number, multiplier: number): string {
    if (amount == 25 && multiplier == 2) return 'Bull';
    return (
      multiplier
        .toString()
        .replace('1', '')
        .replace('2', 'D')
        .replace('3', 'T') + amount
    );
  }

  public getCheckout(points: number) {
    if (checkoutTable[points]) {
      return this.getFormattedScoreString(checkoutTable[points]);
    }
    return '';
  }

  public getSumOfScore(score: Score) {
    let sum = 0;

    score?.game_darts?.forEach(
      (element: Database['public']['Tables']['game_darts']['Row']) => {
        if (element.value == -1) return;
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

  public getFormattedScoreString(
    darts: Database['public']['Tables']['game_darts']['Row'][]
  ): string {
    let text = '';

    if(darts.length == 0) {
      return "";
    }

    for (let i = 0; i < darts.length - 1; i++) {
      text += this.formatNumber(darts[i].value, darts[i].multiplier) + ' - ';
    }

    text += this.formatNumber(
      darts[darts.length - 1].value,
      darts[darts.length - 1].multiplier
    );

    return text;
  }

  public getScoreIcon(points: number, scores: Score[], score: Score) {
    if (score.invalid) {
      return '❌';
    }

    const latestScore: Score | null = scores[0];
    const scoreLength: number = scores.length;

    if (scores && scoreLength > 0 && points == 0 && score === latestScore) {
      return '✅';
    }

    return '🎯';
  }
}
