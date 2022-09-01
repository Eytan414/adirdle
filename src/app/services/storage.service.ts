import { Injectable } from '@angular/core';
import { getDatabase, get, ref, update} from "firebase/database";
import { initializeApp} from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ENV } from '../../environments/environment';
import { Highscores } from '../models/Highscores';


@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private wordList = new BehaviorSubject([]); 
  sharedWordList = this.wordList.asObservable();

  constructor() { }

  //firebase db
  async readDbReference(referenceDB: string): Promise<string[] | Highscores[]> {
    initializeApp(ENV.firebaseConfig);
    const db = getDatabase();
    const refValue = ref(db, referenceDB);
    const snapshot = await get(refValue);
    return snapshot.exists() ? snapshot.val() : [];
  }
  
  updateDbReference(referenceDB: string, updatedList: string[] | Highscores[]): void {
    const db = getDatabase();
    let updates = {};
    updates[referenceDB] = updatedList;
    update(ref(db), updates);
  }

  //local storage
  saveToLocalStorage(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
  loadFromLocalStorage(key: string): any { 
    return JSON.parse(localStorage.getItem(key));
  }

}
