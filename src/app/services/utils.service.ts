import { Injectable } from '@angular/core';
import * as dayjs from 'dayjs';
import { ENV } from '../../environments/environment';
import { Guess } from '../models/Guess';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  constructor() { }

  encodeWord(word: string): string{
    let encodedWord = '';
    for(let i = 0; i < word.length; i++)
      encodedWord += String.fromCharCode(word.charCodeAt(i) * 123);
    return encodedWord;
  }
  decodeWord(word: string): string{
    let decodedWord = '';
    for(let i = 0; i < word.length; i++)
      decodedWord += String.fromCharCode(word.charCodeAt(i) / 123);
    return decodedWord;
  }
  shuffle(array: string[]):string[] {
    let currentIndex:number = array.length;
    let randomIndex:number;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

  calcHoursSinceRelease():number {
    let now = dayjs();
    let releaseDate = dayjs(ENV.releaseDate).hour(3); //resets at 3am/3pm to Aadir's request
    return now.diff(releaseDate, 'hours');
  }
  calculateTimeToNextWord(): string{
    let now = dayjs();
    let releaseDate = dayjs(ENV.releaseDate).hour(3); //resets at 3am/3pm    
    let hoursSinceRelease = now.diff(releaseDate, 'hours');
    let hoursToNextWord = (HOURS_INTERVAL - 1) - hoursSinceRelease % HOURS_INTERVAL;//twice a day
    
    let minutesSinceRelease = now.diff(releaseDate, 'minutes');
    let minutesToNextWord = (MINUTES_INTERVAL - 1) - minutesSinceRelease % MINUTES_INTERVAL;
    
    let formattedHours = this.addLeadingZeros(hoursToNextWord);
    let formattedMinutes = this.addLeadingZeros(minutesToNextWord);
    return `${formattedHours}:${formattedMinutes}`;
  }  
  addLeadingZeros(value:number) {
    return value < 10 ? '0' + value : value;
  }
  async shareScore(text: string, encodedWord: string){
    let wordLength = encodedWord.length;
    const dataToShare = {
      title: 'Dirdle',
      text: text,
      url: `https://adirdle.firebaseapp.com?mode=${wordLength}&word=${encodedWord}`
    }; 
    try {
      await navigator.share(dataToShare);
    } catch(err) {}
  }
  analyzeTextToShare(guesses: Array<Guess[]>): string{
    let text = `Secret word found in ${guesses.length} attempts:\n`;
    for(let guess of guesses){
      for(let letter of guess){
        if(letter.state === "bullseye"){
          text += "🟩";
          continue;
        }
        else if(letter.state === "correct"){
          text += "🟨";
          continue;
        }
        else text += "⬛";
      }
      text += "\n";
    }
    text += 'Do you think you can do better? Click the link below to begin!\n';
    return text;
  }
  
}

export const HOURS_INTERVAL:number = 12;
export const MINUTES_INTERVAL:number = 60;