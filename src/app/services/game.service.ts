import { emptyEntry } from './../constants';
import { Injectable} from '@angular/core';
import domtoimage from 'dom-to-image';
import { Guess } from '../models/Guess';
import { StorageService } from './storage.service';
import { Highscores } from '../models/Highscores';
import { SigninComponent } from '../dialogs/signin-dialog/signin.component';
import { MatDialog } from '@angular/material/dialog';
import { RECORDS_DB_KEY, respnoses } from '../constants';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private words5key:string = '5';   
  private words6key:string = '6';
  users:Array<Highscores>;
  constructor(
    private storageService:StorageService,
    private dialog: MatDialog,
     ) { }
  
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
      await this.updateOrCreateUser(username);
    });
  }  
  
  async updateOrCreateUser(username: string){
    if(!username) return; //invalid username
    const users:Array<Highscores> = await this.storageService.readDbReference(RECORDS_DB_KEY) as Array<Highscores>;
    const userIndex = users.findIndex(user => user?.name.toLowerCase() === username.toLowerCase());

    if(userIndex === -1){//new user
      const newEntry = emptyEntry;
      newEntry.name = username;
      users.push(newEntry);
      this.storageService.updateDbReference(RECORDS_DB_KEY, users);
      return;
    }
    
    //update existing user:
    (await this.getUpdatedUserScores(users[userIndex])).subscribe((resp:Highscores)=>{ 
      users[userIndex] = resp;
      this.storageService.updateDbReference(RECORDS_DB_KEY, users);
    });
  }

  private async getUpdatedUserScores(user: Highscores){
    const [words5average, words5games] = this.getUserAverageAndGames(user['words5']);
    const [words6average, words6games] = this.getUserAverageAndGames(user['words6']);

    return of({
      name: user.name,
      words5: {
        games:words5games, 
        average:words5average,
        details: user['words5'].details ?? []
      },
      words6: {
        games:words6games, 
        average:words6average,
        details: user['words6'].details ?? []
      },
    })
  }
  
  getUserAverageAndGames(userData:any): any[]{
    let gamesPlayed = 0;
    let totalGuesses = 0;
    for(let key in userData.details){
      totalGuesses += userData.details[key] * (+key);
      gamesPlayed += userData.details[key];
    }
    const avg = (totalGuesses / gamesPlayed).toFixed(2);
    return [avg, gamesPlayed];
  }

  async getUserStats(username:string){
    let users = await this.storageService.readDbReference(RECORDS_DB_KEY) as Highscores[];
    users = users.filter(r => r);
    const userIndex = users.findIndex(user => user?.name.toLowerCase() === username.toLowerCase());
    return users[userIndex];
  }

  randomizeReaction(guessCount:number):string{
    const randomizedIndex = Math.round(Math.random() * (respnoses[guessCount-1].length));
    return respnoses[guessCount-1][randomizedIndex];
  }

}