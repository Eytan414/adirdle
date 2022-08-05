import { Guess } from '../models/Guess';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, ViewChild, ViewEncapsulation, ElementRef, ChangeDetectorRef } from '@angular/core';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';

import { NoWordDialogComponent } from '../dialogs/no-word-dialog/no-word-dialog.component';
import { WinDialogComponent } from '../dialogs/win-dialog/win-dialog.component';
import { StorageService } from '../services/storage.service';
import { UtilsService } from '../services/utils.service';
import { WaitDialogComponent } from '../dialogs/wait-dialog/wait-dialog.component';
import { KeyboardComponent } from './keyboard/keyboard.component';
import { HeaderComponent } from './header/header.component';
import { DEFAULT_KEYBOARD_SETTINGS, MOBILE_BREAKPOINT, DEFAULT_KEYBOARD_SETTINGS_MOBILE } from './data';
import { ColorMarkings } from '../models/ColorMarking';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmailService } from '../services/email.service';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  animations: [
    trigger("flip", [
      transition(":enter", [
        animate(1500, keyframes([
          style({ transform: "rotateX(90deg) rotateZ(270deg) rotateY(180deg)" }),
          style({ transform: "rotateX(0) rotateZ(0) rotateY(0)" })
        ])
        )
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
    
    queryParams$.subscribe(async (queryParams) => {
      if(queryParams.mode) this.wordLength = +queryParams.mode;
      this.referenceDB = this.wordLength === 5 ? 'words5' : 'words6';
      let words = await this.storageService.readDbReference(this.referenceDB);

      this.validWords = words;
      this.gameModeKey = `word${this.wordLength}`;
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
    let lastIndex = this.nextGuess.length - 1;
    if(lastIndex >= 0 && newMarker > lastIndex) newMarker = lastIndex;
    if(newMarker <= 0) newMarker = 0;

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
    if (!tmpWinFlag) {
      this.resetNextGuess();
      return;
    }
    this.handleWinDialog();
    if(!this.isRandomWord) this.updateLastWIn();
    this.updatePastScores();
    //scroll to bottom
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

  updatePastScores() {
    let pastScores = this.storageService.loadFromLocalStorage('pastScores') || {};
    let guessCountKey = `${this.guesses.length}`;

    if (!pastScores[this.gameModeKey]) pastScores[this.gameModeKey] = {[guessCountKey]: 1};
    else{
      pastScores[this.gameModeKey].hasOwnProperty(guessCountKey) ?
        pastScores[this.gameModeKey][guessCountKey] = pastScores[this.gameModeKey][guessCountKey] + 1 :
        pastScores[this.gameModeKey][guessCountKey] = 1;
    }
    this.storageService.saveToLocalStorage('pastScores', pastScores);
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
            let avgToWin = this.gameService.calculateUserAverageGuessesLength(this.wordLength) as string;
            this.emailService.sendEmail('מחיקה', this.dailyWord, avgToWin);
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
            let avgToWin = this.gameService.calculateUserAverageGuessesLength(this.wordLength) as string;
            this.emailService.sendEmail('הוספה', currentGuess, avgToWin);
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
  
  toggleOverflow(el:HTMLElement):void{
    if(el.style.overflowY === 'hidden'){
      el.style.maxHeight = '50vh';
      el.style.overflowY = 'auto';
    }else{
      el.style.maxHeight = '100%';
      el.style.overflowY = 'hidden';
    }
    el.offsetHeight;
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
    let text = this.utilService.analyzeTextToShare(this.guesses);
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

  helppp(): void {
    for(let [i, letter] of this.dailyWord.split('').entries()) {
      if(!this.colorMarkingSets.green.has(letter)){
        this.nextGuess[i].letter = letter;
        this.nextGuess[i].state = 'bullseye';
        this.colorMarkingSets.green.add(letter);
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

}
