import { GameService } from './../../services/game.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilsService } from 'src/app/services/utils.service';
import { Guess } from '../../models/Guess';
import { USERNAME_KEY } from 'src/app/constants';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-wait-dialog',
  templateUrl: './wait-dialog.component.html',
  styleUrls: ['./wait-dialog.component.scss']
})
export class WaitDialogComponent implements OnInit {
  timeToNextWord: string;
  solvedWord:string;
  wordLength:number;
  guesses: Guess[];
  attemptToSolveWord:number;
  averageGuessesPerWord:number | string;
  gamesCount: string;
  reaction: string;

  constructor(
    private utilService: UtilsService,
    private storageService: StorageService,
    private gameService: GameService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  async ngOnInit() {
    this.timeToNextWord = this.utilService.calculateTimeToNextWord();
    this.assignIncomingData();
    const guessCount = this.guesses.length;
    this.reaction = this.gameService.randomizeReaction(guessCount);
    
    const username = this.storageService.loadFromLocalStorage(USERNAME_KEY);
    const user = await this.gameService.getUserStats(username);

    let result = this.gameService.getUserAverageAndGames(user[`words${this.wordLength}`]);
    [this.averageGuessesPerWord, this.gamesCount] = result;
  }

  private assignIncomingData() {
    this.solvedWord = this.data.solvedWord;
    this.guesses = this.data.guesses;
    this.wordLength = this.data.wordLength;
    this.attemptToSolveWord = this.guesses.length;
  }

}
