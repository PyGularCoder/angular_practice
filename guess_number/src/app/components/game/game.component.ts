import { Component, OnDestroy, OnInit } from '@angular/core';
import { DifficultyLevel, GameService } from '../../services/game.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-game',
  standalone: true,
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class GameComponent implements OnInit, OnDestroy {
  public guess!: number;
  public isGameOver: boolean = false;
  public isGameWon: boolean = false;
  public isHintUsed: boolean = false;
  public timeRemaining!: number;
  public maxAttempts!: number;
  public hintsRemaining!: number;
  public difficultyLevels = Object.values(DifficultyLevel);
  public selectedDifficulty!: DifficultyLevel;
  public hintMessage: string = ''; 
  private timerIntervalId: any;

  constructor(private gameService: GameService) {}

  ngOnInit() {
    
    this.selectedDifficulty = DifficultyLevel.Medium;
    this.startNewGame();
  }

  ngOnDestroy() {
    clearInterval(this.timerIntervalId);
  }

  startNewGame() {
    this.gameService.initializeGame(this.selectedDifficulty);
    this.timeRemaining = this.gameService.getTimeLimit();
    this.maxAttempts = this.gameService.getMaxAttempts();
    this.hintsRemaining = this.gameService.getHintsLimit();
    this.isGameOver = false;
    this.isGameWon = false;
    this.isHintUsed = false;
    this.hintMessage = ''; 
    this.startTimer();
  }

  startTimer() {
    this.timerIntervalId = setInterval(() => {
      if (this.timeRemaining > 0 && !this.isGameOver && !this.isGameWon) {
        this.timeRemaining -= 0.1;
  
        if (this.timeRemaining <= 0) {
          this.gameOver();
        }
      }
    }, 100); 
  }

  makeGuess() {
    if (!this.isGameOver && !this.isGameWon) {
      const result = this.gameService.validateGuess(this.guess);
      if (result === 'win') {
        this.gameWon();
      } else if (result === 'lose') {
        this.gameOver();
      } else if (result === 'continue' && this.maxAttempts === 0) {
        this.gameWon();
      } else {
       
        this.maxAttempts = this.gameService.getMaxAttempts();
      }
    }
  }

  useHint() {
    if (this.hintsRemaining > 0 && !this.isGameOver && !this.isGameWon) {
      this.isHintUsed = true;
      this.hintsRemaining--;

      
      this.hintMessage = this.gameService.useHint();
    
      setTimeout(() => {
        this.hintMessage = '';
      }, 2000);
    }
  }

  private gameWon() {
    this.isGameWon = true;
    this.gameService.updateHighScores();
    clearInterval(this.timerIntervalId);
    
  }

  private gameOver() {
    this.isGameOver = true;
    clearInterval(this.timerIntervalId);
   
  }
}
