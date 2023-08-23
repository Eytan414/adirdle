import { Guess } from '../models/Guess';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, ViewChild, ViewEncapsulation, ElementRef, ChangeDetectorRef } from '@angular/core';
import { animate, style, transition, trigger, sequence } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';

import { NoWordDialogComponent } from '../dialogs/no-word-dialog/no-word-dialog.component';
import { WinDialogComponent } from '../dialogs/win-dialog/win-dialog.component';
import { StorageService } from '../services/storage.service';
import { UtilsService } from '../services/utils.service';
import { WaitDialogComponent } from '../dialogs/wait-dialog/wait-dialog.component';
import { KeyboardComponent } from './keyboard/keyboard.component';
import {HeaderComponent } from './header/header.component';

import { DEFAULT_KEYBOARD_SETTINGS, MOBILE_BREAKPOINT, DEFAULT_KEYBOARD_SETTINGS_MOBILE } from './data';
import { ColorMarkings } from '../models/ColorMarking';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmailService } from '../services/email.service';
import { GameService } from '../services/game.service';
import { ANIMATION_LENGTH, RECORDS_DB_KEY, USERNAME_KEY } from '../constants';
import { Highscores } from '../models/Highscores';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  animations: [
    trigger("flip", [
      transition(":enter", [
        style({ visibility: 'visible' }),
sequence([
  animate(ANIMATION_LENGTH/2, style({ transform: "scale(.2) rotate3d(1, 1, .5, 720deg)" })),
  animate(ANIMATION_LENGTH/2, style({ transform: "scale(1) rotate3d(0)" })),
])
      ])
    ])
  ],
  encapsulation: ViewEncapsulation.None
})
export class MainComponent implements OnInit {
  showFooterOnTop: boolean = false;
  dailyWord: string;
  nextGuess: Array<Guess> = [];
  guesses: Array<Array<Guess>> = [];
  validWords: string[];
  enableControls: boolean = true;
  @ViewChild(KeyboardComponent) keyboardComponent: KeyboardComponent;
  @ViewChild(HeaderComponent, {static: true}) headerComponent: HeaderComponent;
  @ViewChild('nextGuessWrapper', {static: false}) nextGuessWrapper: ElementRef;
  darkMode: boolean = false;
  wordLength: number = 5;
  referenceDB: string = 'words5';
  // showNextGuessRow: boolean = true;
  lastUsersWin: any;
  latestGuesses: any;
  showShare: boolean = false;
  didPlayerWin: boolean = false;
  gameModeKey:string; //words5/6
  colorMarkingSets: ColorMarkings = {
    'yellow': new Set<string>(),
    'dark': new Set<string>(),
    'green': new Set<string>()
  }
  marker: number;
  nextGuessSlots: Array<HTMLDivElement>;
  isRandomWord: boolean = false;
  username:string;

  constructor(
    private storageService: StorageService, 
    private utilService: UtilsService,
    private emailService: EmailService,
    private gameService: GameService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router, 
    private _snackBar: MatSnackBar,
    private cd: ChangeDetectorRef
  ) { }
  
  ngOnInit(): void {
    let hoursSinceRelease = this.utilService.calcHoursSinceRelease();
    let queryParams$ = this.route.queryParams;

    this.username = this.storageService.loadFromLocalStorage('username');
    if(this.username) this.greet()
    else this.gameService.openSigninDialog();

    queryParams$.subscribe(async (queryParams) => {
      if(queryParams.mode) this.wordLength = +queryParams.mode;
      this.referenceDB = this.wordLength === 5 ? 'words5' : 'words6';
      let words:string[] = await this.storageService.readDbReference(this.referenceDB) as string[];

      this.validWords = words;
      this.gameModeKey = `words${this.wordLength}`;
      if (!this.validWords) return;
      
      // this.showNextGuessRow = true;
      this.dailyWord = queryParams.hasOwnProperty('word') ? 
        this.utilService.decodeWord(queryParams.word) : //set puzzleword to word passed in query params
        this.validWords[Math.floor(hoursSinceRelease / 24)]; //get random word from db every 24util hours
        
      this.initializeApp();
      this.loadUserSettings();
      this.lastUsersWin = this.storageService.loadFromLocalStorage('lastWin') || {};
      if (this.lastUsersWin.hasOwnProperty(this.gameModeKey) && //case user already solved active puzzle
          this.lastUsersWin[this.gameModeKey].word === this.dailyWord) 
            this.setWaitingMode();
    });
    
  }
  
  loadUserSettings() {
    this.cd.detectChanges();
    let settings = this.storageService.loadFromLocalStorage('keyboardPrefs');
    if (settings) 
    this.keyboardComponent.setupKeyboard(settings);
    this.latestGuesses = this.storageService.loadFromLocalStorage('latestGuesses') || {};
    
    //case user's guesses are for active puzzle
    if(this.latestGuesses.hasOwnProperty(this.gameModeKey) &&
    this.latestGuesses[this.gameModeKey].word === this.dailyWord){ 
      this.guesses = this.latestGuesses[this.gameModeKey].latestGuesses || [];
      this.cd.detectChanges();
    }
    this.colorizeKeyboard(this.guesses, this.dailyWord);

    let savedDarkMode = this.storageService.loadFromLocalStorage('darkMode');
    if (savedDarkMode === null){
      (window.matchMedia && //user os set to dark mode
        window.matchMedia('(prefers-color-scheme: dark)').matches) ? 
          this.setDarkMode(true) :
          this.setDarkMode(false);
    }else{
      this.setDarkMode(savedDarkMode);
    }
  }

  setWaitingMode() {
    this.showShare = true;
    this.didPlayerWin = true;
    this.handleWaitDialog();
    this.guesses = this.lastUsersWin[this.gameModeKey].guesses;
  }

  letterClicked(letter: string): void {
    if(this.isGuessComplete()) return;    
    this.nextGuess[this.marker].letter = letter;
    this.setMarker(this.calculateNextLetterSlot());
  }
  calculateNextLetterSlot(): number {
    for(let i = this.marker; i < this.nextGuess.length; i++)
      if(this.nextGuess[i].letter === '') return i;
    for(let i = 0; i < this.nextGuess.length; i++)
      if(this.nextGuess[i].letter === '') return i;
    return 0;
  }
  backspaceClicked(){
    this.nextGuess[this.marker].letter = '';
    this.setMarker(this.marker - 1);
  }
  isGuessComplete(): boolean {
    for(let guess of this.nextGuess)
      if(!guess.letter) return false;
  }

  setMarker(newMarker: number) {
    const lastIndex = this.nextGuess.length - 1;
    if(newMarker <= 0) newMarker = 0
      else
    if(lastIndex >= 0 && newMarker > lastIndex) 
      newMarker = lastIndex;

    for(let [i, guess] of this.nextGuess.entries()) {
      guess.marker = false;
      if(i === newMarker) guess.marker = true;
    }
    this.marker = newMarker;
  }

  resetNextGuess():void {
    this.nextGuess = [];
    for(let i = 0; i < this.wordLength; i++)
      this.nextGuess.push({ letter: '', state: 'initial', marker: false });
    this.nextGuess[0].marker = true;
    this.setMarker(0);
  }

  enterClicked(): void {
    let typedLettersCount = this.gameService.countTypedLetters(this.nextGuess);
    if(typedLettersCount < this.wordLength) return;
    let currentGuess: string = this.nextGuess.map(guess => guess.letter).join('');
    if(!this.validWords.includes(currentGuess)) {
      this.handleNoWordDialog(currentGuess);
      return;
    }
    this.checkWord(this.dailyWord, this.nextGuess);
    this.updateLocalStorageWithCurrentGuesses();
    
    let tmpWinFlag: boolean = true;
    for (let g of this.nextGuess) {
      if (g.state !== 'bullseye') tmpWinFlag = false;
    }
    //wrong guess
    if (!tmpWinFlag) {
      this.resetNextGuess();
      return;
    }
    //correct guess
    this.handleWinDialog();
    if(!this.isRandomWord) this.updateLastWIn();
    this.username = this.storageService.loadFromLocalStorage(USERNAME_KEY);
    this.updateScoresInDB();
    //scroll to bottom to show correct guess
    document.querySelector('main.guesses').scrollTop = document.querySelector('main.guesses').scrollHeight;
  }
  
  updateLocalStorageWithCurrentGuesses(){
    this.guesses.push(this.nextGuess);
    this.latestGuesses[this.gameModeKey] = {
      'word': this.dailyWord,
      'latestGuesses': this.guesses
    };
    this.storageService.saveToLocalStorage('latestGuesses', this.latestGuesses);
  }
  
  updateLastWIn(){
    let obj = {
      "word": this.dailyWord,
      "guesses": this.guesses
    };
    this.lastUsersWin[this.gameModeKey] = obj;
    this.storageService.saveToLocalStorage('lastWin', this.lastUsersWin);
  }

  async updateScoresInDB() {
    let usersInDB = await this.storageService.readDbReference(RECORDS_DB_KEY) as Highscores[];
    usersInDB = usersInDB.filter(r => r);//remove empty
    const userIndex = usersInDB.findIndex(user => user?.name.toLowerCase() === this.username.toLowerCase());
    
    const numberOfGuesses = this.guesses.length;
    const userRecordCurrentMode = usersInDB[userIndex][this.gameModeKey];

    const [average, games] = this.gameService.getUserAverageAndGames(userRecordCurrentMode);
    userRecordCurrentMode['average'] = average;
    userRecordCurrentMode['games'] = games;

    if(userRecordCurrentMode.details){//user played level ${gameModeKey} previously
      if(userRecordCurrentMode.details[numberOfGuesses])//and found word in ${numberOfGuesses} previously
        userRecordCurrentMode.details[numberOfGuesses] = userRecordCurrentMode.details[numberOfGuesses] + 1;
      else //and first time found word in ${numberOfGuesses}
        userRecordCurrentMode['details'][numberOfGuesses] = 1;

    } else {//user won level ${gameModeKey} for the first time
        userRecordCurrentMode['details'] = [];
        userRecordCurrentMode['details'][numberOfGuesses] = 1;
    }
    
    this.storageService.updateDbReference(RECORDS_DB_KEY, usersInDB);
  }
  
  checkWord(dailyWord: string, guess: Guess[]): void {
    for(let g of guess) {
      g.state = "checked";
      this.colorMarkingSets.dark.add(g.letter);
    }

    //mark greens
    for(let i = 0; i <guess.length; i++) {
      if (guess[i].letter !== dailyWord[i]) continue;
      guess[i].state = "bullseye";
      this.colorMarkingSets.green.add(guess[i].letter);
      dailyWord = dailyWord.replace(guess[i].letter, " ");
    }

    //mark yellows
    for (let i = 0; i < guess.length; i++) {
      if (guess[i].state !== "bullseye" && dailyWord.includes(guess[i].letter)) {
        this.colorMarkingSets.yellow.add(guess[i].letter);
        guess[i].state = "correct";
        dailyWord = dailyWord.replace(guess[i].letter, " ");
      }
    }
  }

  handleWaitDialog():void {
    this.enableControls = false;
    let dialogRef = this.dialog.open(WaitDialogComponent, {
      data: {
        wordLength: this.wordLength,
        guesses: this.lastUsersWin[this.gameModeKey].guesses,
        solvedWord: this.lastUsersWin[this.gameModeKey].word
      },
      panelClass: 'wait-dialog'
    });
    dialogRef.afterClosed().subscribe(() => { this.enableControls = true; });
    
  }
  handleWinDialog() {
    this.enableControls = false;
    this.didPlayerWin = true;
    this.showShare = true;
    let dialogRef = this.dialog.open(WinDialogComponent, {
      data: {
        guesses: this.guesses,
        dailyWord: this.dailyWord
      },
      panelClass: 'win-dialog',
      disableClose: true,hasBackdrop: false,
      position: { top: '3rem' }
    });

    dialogRef.afterClosed().subscribe((removeWordFromDictionary: boolean) => {
      if (removeWordFromDictionary) {
        let newWordList: string[] = this.validWords.filter(w => { return w !== this.dailyWord });
        let snackbarRef = this._snackBar.open(`${this.dailyWord.toUpperCase()} removed from dictionary`, 'UNDO', {
          panelClass: "snackbar",
          duration: 2000
        });
        snackbarRef.afterDismissed().subscribe(info => {
          this.enableControls = true;          
          if(!info.dismissedByAction){//user didn't click undo action
            this.storageService.updateDbReference(this.referenceDB, newWordList);
            this.emailService.sendEmail('מחיקה', this.dailyWord);
          }
        });
      } else this.enableControls = true;
      this.cd.detectChanges();
      this.keyboardComponent.setupKeyboard(this.storageService.loadFromLocalStorage('keyboardPrefs'));
    });
  }

  handleNoWordDialog(currentGuess: string) {
    this.enableControls = false;

    let dialogRef = this.dialog.open(NoWordDialogComponent, {
      panelClass: 'no-word-dialog',
      data: { guess: currentGuess,},
      position: { top: '3rem' }
    });
    setTimeout(() => { dialogRef.close(false) }, 3500);
    
    dialogRef.afterClosed().subscribe((addWordToDictionary: boolean) => {
      if (addWordToDictionary) {
        let snackbarRef = this._snackBar.open(`${currentGuess.toUpperCase()} added to dictionary`, 'UNDO', {
          panelClass: "snackbar",
          duration: 2000
        });
        snackbarRef.afterDismissed().subscribe(info => {
          this.enableControls = true;
          if(!info.dismissedByAction){//add word if user didn't click undo action
            this.validWords.push(currentGuess);
            let newWordList: string[] = this.validWords;
            this.storageService.updateDbReference(this.referenceDB, newWordList);
            this.emailService.sendEmail('הוספה', currentGuess);
          }
        });
    } else this.enableControls = true;

    this.cd.detectChanges();
    this.keyboardComponent.setupKeyboard(this.storageService.loadFromLocalStorage('keyboardPrefs'));
  });
  }

  initializeApp(): void {
    this.nextGuessSlots = this.nextGuessWrapper.nativeElement.querySelectorAll('div');
    this.marker = 0;
    this.resetNextGuess();
    this.enableControls = true;
    this.guesses = [];
    if ('wakeLock' in navigator) this.requestWakeLock();
  }
  
  async requestWakeLock(){
    try {
      const wakeLock = await navigator['wakeLock'].request('screen');
    } catch (err) {
      console.log(`${err.name}, ${err.message}`);
    }
  }
  
  toggleDarkMode() {
    this.setDarkMode(!this.darkMode);
  }
  private setDarkMode(newDarkMode: boolean) {
    this.darkMode = newDarkMode;
    this.darkMode ? 
      document.body.classList.add('dark-mode-on') :
      document.body.classList.remove('dark-mode-on');
      
    this.storageService.saveToLocalStorage('darkMode', this.darkMode);
  }
  
  async shareImage(){
    let divToCapture:HTMLDivElement = <HTMLDivElement>document.querySelector("main.guesses");    
    this.toggleDivCss(divToCapture);
    setTimeout(async()=>{
      await this.gameService.jpegCreator(divToCapture);    
    }, 200);
    
  }

  toggleDivCss(divToCapture: HTMLElement): void{
    if(divToCapture.style.maxHeight === '50vh'){
      divToCapture.style.maxHeight = '100%';
      divToCapture.style.overflowY = 'hidden';
    } else{
      divToCapture.style.maxHeight = '50vh';
      divToCapture.style.overflowY = 'auto';
    }
  }

  shareScore(){
    let text = this.utilService.analyzeTextToShare(this.guesses, this.wordLength);
    let encodedWord = this.utilService.encodeWord(this.dailyWord);
    this.utilService.shareScore(text, encodedWord);
  }
  resetKeyboardPosition() {
    let settings = window.innerWidth < MOBILE_BREAKPOINT ? 
      DEFAULT_KEYBOARD_SETTINGS_MOBILE:
      DEFAULT_KEYBOARD_SETTINGS;
    this.keyboardComponent.setupKeyboard(settings);
  }
  randomizeWord():void{
    let randomIndex = Math.floor(
      Math.random() * this.validWords.length-1
    );
    this.dailyWord = this.validWords[randomIndex];
    this.showShare = false;
    this.didPlayerWin = false;
    this.initializeApp();
    this.loadUserSettings();
    this.isRandomWord = true;
  }
  switchGameMode(){
    this.guesses = [];
    this.enableControls = true;
    this.showShare = false;
    this.didPlayerWin = false;
    const opts = { relativeTo: this.route }

    this.wordLength === 5 ? 
      opts["queryParams"] = {mode:'6'}:
      opts["queryParams"] = {mode:'5'};
    this.router.navigate(['/'], opts);
  }

  colorizeKeyboard(guesses: Array<Guess[]>, dailyWord: string):void{
    this.colorMarkingSets.yellow.clear();
    this.colorMarkingSets.green.clear();
    this.colorMarkingSets.dark.clear();
    for( let guess of guesses)
      this.checkWord(dailyWord, guess);
  }

  helppp(): void { //SOS
    for(let [i, letter] of this.dailyWord.split('').entries()) {
      if(!this.colorMarkingSets.green.has(letter)
        && !this.colorMarkingSets.yellow.has(letter)){
        this.nextGuess[i].letter = letter;
        this.nextGuess[i].state = 'bullseye';
        this.colorMarkingSets.green.add(letter);
        this.setMarker(i+1);
        break;
      }
    }
  }
  
  letterSlotClicked($event: MouseEvent | TouchEvent){
    let currentTarget = $event.target as HTMLDivElement;
    let newMarkerIndex = Array.from(this.nextGuessSlots).indexOf(currentTarget);
    this.setMarker(newMarkerIndex);
  }
  focusFooter(){
    this.showFooterOnTop = true;
  }
  greet(){
    this._snackBar.open(`Hello ${this.username}`, undefined, {
      panelClass: "snackbar", duration: 1000 
    })
  }

}
