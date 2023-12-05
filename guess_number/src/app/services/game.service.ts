import { Injectable } from '@angular/core';

export enum DifficultyLevel {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
}

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private targetNumber!: number;
  private maxAttempts!: number;
  private hintsLimit!: number;
  private timeLimit!: number;
  private startTime!: number;
  private highScores: number[] = [];

  initializeGame(selectedDifficulty: DifficultyLevel, customRange?: number[]): void {
    this.maxAttempts = this.getMaxAttemptsByDifficulty(selectedDifficulty);
    this.hintsLimit = 2; 
    this.timeLimit = 60; 
    this.startTime = Date.now();

    
    if (customRange) {
      this.targetNumber = this.getRandomNumber(customRange[0], customRange[1]);
    } else {
      this.targetNumber = this.getRandomNumber(1, 100); 
    }
  }

  validateGuess(guess: number): 'win' | 'lose' | 'continue' {
    if (guess === this.targetNumber) {
      return 'win';
    } else {
      this.maxAttempts--;

      if (this.maxAttempts === 0) {
        return 'lose';
      } else {
        
        this.timeLimit -= 5; 
        return 'continue';
      }
    }
  }

  useHint(): string {
    if (this.hintsLimit > 0) {
      this.hintsLimit--;
     
      return `Hint: The number is ${this.targetNumber % 2 === 0 ? 'even' : 'odd'}.`;
    } else {
      return 'No hints remaining.';
    }
  }

  updateHighScores(): void {
    const elapsedTime = (Date.now() - this.startTime) / 1000; 
    const score = this.maxAttempts * 10 + this.hintsLimit * 5 - elapsedTime;

    
    this.highScores.push(score);

    
    this.highScores.sort((a, b) => b - a);
  }

  getHighScores(): number[] {
    return this.highScores;
  }

  getMaxAttempts(): number {
    return this.maxAttempts;
  }

  getHintsLimit(): number {
    return this.hintsLimit;
  }

  getTimeLimit(): number {
    return this.timeLimit;
  }

  private getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private getMaxAttemptsByDifficulty(difficulty: DifficultyLevel): number {
    switch (difficulty) {
      case DifficultyLevel.Easy:
        return 5;
      case DifficultyLevel.Medium:
        return 3;
      case DifficultyLevel.Hard:
        return 2;
      default:
        return 3; 
    }
  }
}
