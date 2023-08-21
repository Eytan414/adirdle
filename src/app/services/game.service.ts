import { Injectable} from '@angular/core';
import domtoimage from 'dom-to-image';
import { Guess } from '../models/Guess';
import { StorageService } from './storage.service';
import { Highscores } from '../models/Highscores';
import { SigninComponent } from '../dialogs/signin-dialog/signin.component';
import { MatDialog } from '@angular/material/dialog';
import { RECORDS_DB_KEY } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  constructor(
    private storageService:StorageService,
    private dialog: MatDialog,
     ) { }
  
  calculateUserAverageGuessesLength(wordLength:number, getGamesDetails: boolean = false): string | any[]{
    let pastScores = this.storageService.loadFromLocalStorage('pastScores');
    if(!pastScores) return '';

    let gameModeScores = pastScores[`word${wordLength}`];
    let gamesPlayed = 0;
    let totalGuesses = 0;
    for(let key in gameModeScores){
      totalGuesses += gameModeScores[key] * (+key);
      gamesPlayed += gameModeScores[key];
    }
    let avg = (totalGuesses / gamesPlayed).toFixed(2);
    if(!getGamesDetails) return [avg];
    return [avg, gamesPlayed, pastScores[`word${wordLength}`]];
  }

  countTypedLetters(guess:Array<Guess>):number {
    let count = 0;
    for(let slot in guess) 
      if(guess[slot].letter !== '') count++;
    return count;
  }
  
  filter(node:HTMLElement):boolean {
    if(node.nodeType === Node.ELEMENT_NODE) {
      if(node.className.includes('next-guess') ||
         node.className.includes('share-wrapper')
        )
          return false;
    } 
    return true;
  }

  async jpegCreator(divToCapture: HTMLElement) {
    domtoimage.toBlob(divToCapture, {filter: this.filter})
      .then(async function (dataUrl){
        let img = new File([dataUrl], "name.png", {type: "image/png"});
        let fileArr:File[] = [img];
        try {
          await navigator.share({files: fileArr});
        } catch(err) {}
      }
    )
  }
  
  openSigninDialog() {
    let dialogRef = this.dialog.open(SigninComponent, {
      panelClass: 'win-dialog',
      disableClose: true, hasBackdrop: false,
      position: { top: '3rem' }
    });
    
    dialogRef.afterClosed().subscribe(async (username: string) => {
      if(!username) return;
      this.storageService.saveToLocalStorage('username', username);
      this.updateOrCreateUser(username);
    });
  }  
  
  async updateOrCreateUser(username: string) {
    const users:Array<Highscores> = await this.storageService.readDbReference(RECORDS_DB_KEY) as Array<Highscores>;
    const userIndex = users.findIndex(user => user?.name.toLowerCase() === username.toLowerCase());
    const userHighscores = this.getUpdatedUserScores(username);

    userIndex < 0 //index = -1 if user not found
      ? users.push(userHighscores)
      : users[userIndex] = userHighscores;

    this.storageService.updateDbReference(RECORDS_DB_KEY, users);
  }

  private getUpdatedUserScores(username:string):Highscores{
    const words5key = 5;   
    const words6key = 6;   
    const getGamesDetails = true;
    const [words5average, words5games, words5details] = this.calculateUserAverageGuessesLength(words5key, getGamesDetails);
    const [words6average, words6games, words6details] = this.calculateUserAverageGuessesLength(words6key, getGamesDetails);

    return {
      name: username,
      words5: {
        games:words5games, 
        average:words5average,
        details: words5details ?? {}
      },
      words6: {
        games:words6games, 
        average:words6average,
        details: words6details ?? {}
      },
    }
  }
}