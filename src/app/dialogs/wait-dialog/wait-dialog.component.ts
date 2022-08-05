import { GameService } from './../../services/game.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StorageService } from 'src/app/services/storage.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Guess } from '../../models/Guess';
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
  pastScores:any;
  gamesCount: string;

  constructor(
    private utilService: UtilsService,
    private gameService: GameService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.timeToNextWord = this.utilService.calculateTimeToNextWord();
    this.assignIncomingData();
    
    let result = this.gameService.calculateUserAverageGuessesLength(this.wordLength, true);
    [this.averageGuessesPerWord, this.gamesCount] = result;
  }

  private assignIncomingData() {
    this.solvedWord = this.data.solvedWord;
    this.guesses = this.data.guesses;
    this.wordLength = this.data.wordLength;
    this.attemptToSolveWord = this.guesses.length;
  }

}
