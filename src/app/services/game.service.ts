import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  validWords: string[];

  constructor(private storageService:StorageService ) { }
  
  fetchValidWords(): void {
    
  }

}
