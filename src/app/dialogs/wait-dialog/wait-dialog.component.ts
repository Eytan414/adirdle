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

  constructor(
    private utilService: UtilsService,
    private storageService: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.timeToNextWord = this.utilService.calculateTimeToNextWord();
    this.assignIncomingData();
    this.pastScores = this.storageService.loadFromLocalStorage('pastScores');
    
    let gameModeScores = this.pastScores[`word${this.wordLength}`];
    let gamesPlayed = 0;
    let totalGuesses = 0;
    let keys = Object.keys(gameModeScores);
    for(let key of keys){
      totalGuesses += gameModeScores[key] * (+key);
      gamesPlayed += gameModeScores[key];
      
    }
    this.averageGuessesPerWord = (totalGuesses / gamesPlayed).toFixed(2);
  }

  private assignIncomingData() {
    this.solvedWord = this.data.solvedWord;
    this.guesses = this.data.guesses;
    this.wordLength = this.data.wordLength;
    this.attemptToSolveWord = this.guesses.length;
  }

}
