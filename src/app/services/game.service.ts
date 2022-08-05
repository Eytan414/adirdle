import { UtilsService } from 'src/app/services/utils.service';
import { Injectable} from '@angular/core';
import domtoimage from 'dom-to-image';
import { Guess } from '../models/Guess';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  constructor(private storageService:StorageService ) { }
  
  calculateUserAverageGuessesLength(wordLength:number, getGamesPlayed: boolean = false): string | any[]{
    let pastScores = this.storageService.loadFromLocalStorage('pastScores');
    
    let gameModeScores = pastScores[`word${wordLength}`];
    let gamesPlayed = 0;
    let totalGuesses = 0;
    for(let key in gameModeScores){
      totalGuesses += gameModeScores[key] * (+key);
      gamesPlayed += gameModeScores[key];
    }
    let avg = (totalGuesses / gamesPlayed).toFixed(2);

    if(getGamesPlayed) return [avg, gamesPlayed];
    return avg;
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
      },
      error=>{
        console.log(error)
      });
    
    
    // domtoimage.toJpeg(divToCapture, {filter: this.filter}).then(function (dataUrl:string) {
    //   let link = document.createElement('a');
    //   link.download = `${new Date().toISOString().split('T')[0]}.jpeg`;
    //   link.href = dataUrl;
    //   link.click();
    //   });
      
  } 

}