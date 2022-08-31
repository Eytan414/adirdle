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
    const now = dayjs();
    const releaseDate = dayjs(ENV.releaseDate).hour(0); 
    return now.diff(releaseDate, 'hours');
  }
  calculateTimeToNextWord(): string{
    const now = dayjs();
    const releaseDate = dayjs(ENV.releaseDate).hour(0); //resets at midnight  
    const hoursSinceRelease = now.diff(releaseDate, 'hours');
    const hoursToNextWord = (HOURS_INTERVAL - 1) - hoursSinceRelease % HOURS_INTERVAL;//once a day
    
    const minutesSinceRelease = now.diff(releaseDate, 'minutes');
    const minutesToNextWord = (MINUTES_INTERVAL - 1) - minutesSinceRelease % MINUTES_INTERVAL;
    
    const formattedHours = this.addLeadingZeros(hoursToNextWord);
    const formattedMinutes = this.addLeadingZeros(minutesToNextWord);
    return `${formattedHours}:${formattedMinutes}`;
  }  
  addLeadingZeros(value:number): string | number {
    return value < 10 ? '0' + value : value;
  }
  async shareScore(text: string, encodedWord: string){
    const wordLength = encodedWord.length;
    const dataToShare = {
      title: 'Dirdle',
      text: text,
      url: `https://adirdle.firebaseapp.com?mode=${wordLength}&word=${encodedWord}`
    }; 
    try {
      await navigator.share(dataToShare);
    } catch(err) {}
  }
  analyzeTextToShare(guesses: Array<Guess[]>, wordLength:number): string{
    let text = `Dirdle${wordLength} found in ${guesses.length} attempts:\n`;
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
    text += 'Think you can do better? Click the link to begin!\n';
    return text;
  }
  
}

export const HOURS_INTERVAL:number = 24;
export const MINUTES_INTERVAL:number = 60;