import { StorageService } from 'src/app/services/storage.service';
import { Guess } from '../../models/Guess';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { INITIAL_KEYBOARD_SIZE, INITIAL_KEYBOARD_SIZE_MOBILE, MOBILE_BREAKPOINT } from '../data';
import { KeyboardPrefs } from 'src/app/models/keyboardPrefs';
import { CdkDragEnd, Point } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss']
})
export class KeyboardComponent implements OnInit {
  @ViewChild('keyboard', { static: false }) keyboard: ElementRef;
  keyboardSize: number;
  dragPosition: Point = { x: 0, y: 0 };
  locked: boolean = false;
  
  @Input() yellow: Set<string>;
  @Input() dark: Set<string>;
  @Input() green: Set<string>;
  @Input() nextGuess: Array<Guess>;
  @Output() letterClickedEmitter = new EventEmitter<string>();
  @Output() enterClickedEmitter = new EventEmitter<null>();
  @Output() backspaceClickedEmitter = new EventEmitter<null>();

  constructor(private storageService: StorageService) { }

  ngOnInit(): void {
    this.keyboardSize = window.innerWidth < MOBILE_BREAKPOINT ?
      INITIAL_KEYBOARD_SIZE_MOBILE :
      INITIAL_KEYBOARD_SIZE;

    let settings = this.storageService.loadFromLocalStorage('keyboardPrefs');
    if (settings) this.setupKeyboard(settings);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.yellow = changes.yellow?.currentValue ?? this.yellow;
    this.dark = changes.dark?.currentValue ?? this.dark;
    this.green = changes.green?.currentValue ?? this.green;
    this.nextGuess = changes.nextGuess?.currentValue ?? this.nextGuess;
  }

  setupKeyboard(settings: KeyboardPrefs) {
    this.locked = settings.locked ?? this.locked;
    if(settings.locked && this.keyboard)
      this.keyboard.nativeElement.classList.add('locked-to-bottom');

    this.dragPosition = settings.dragPosition ?? this.dragPosition;
    this.keyboardSize = settings.lastKeyboardFactor ?? this.keyboardSize;
    this.setKeyboardSize(this.keyboardSize);
  }

  private setKeyboardSize(size: number): void {
    if (this.keyboard)
      this.keyboard.nativeElement.style.setProperty('--size', `${size}rem`);
  }

  calcCssClass(letter: string): string {
    if (this.green.has(letter)) return 'green';
    if (this.yellow.has(letter)) return 'yellow';
    if (this.dark.has(letter)) return 'dark';
    return '';
  }

  dragEnd($event: CdkDragEnd): void {
    this.dragPosition = $event.source.getFreeDragPosition();
    let cssVarSize: string = getComputedStyle(this.keyboard.nativeElement).getPropertyValue('--size');
    let lastKeyboardFactor = +/[0-9](\.[0-9]+)?/.exec(cssVarSize)[0];

    let keyboardPrefs: KeyboardPrefs = {
      locked: this.locked,
      dragPosition: this.dragPosition,
      lastKeyboardFactor: lastKeyboardFactor
    };
    this.storageService.saveToLocalStorage('keyboardPrefs', keyboardPrefs);
  }
  enlarge(): void {
    this.keyboardSize *= 1.05;
    this.setKeyboardSize(this.keyboardSize);
    this.saveKeyboardPrefs();
  }
  
  shrink(): void {
    this.keyboardSize *= .95;
    this.setKeyboardSize(this.keyboardSize);
    this.saveKeyboardPrefs();
  }
  lockKeyboardPosition(): void {
    this.keyboard.nativeElement.classList.add('locked-to-bottom');
    this.locked = true;
    this.saveKeyboardPrefs();
  }
  unlockKeyboardPosition(): void {
    this.keyboard.nativeElement.classList.remove('locked-to-bottom');
    this.locked = false;
    this.saveKeyboardPrefs();
  }
  resetKeyboardColoring(): void {
    this.keyboard.nativeElement.querySelectorAll('span')
      .forEach((key: HTMLSpanElement) => { key.className = ''; }
      );
  }
  backspaceClicked(): void {
    this.backspaceClickedEmitter.emit();
  }
  letterClicked(letter: string): void {
    this.letterClickedEmitter.emit(letter);
  }
  enterClicked(): void {
    this.enterClickedEmitter.emit();
  }
  
  private saveKeyboardPrefs():void{
    let keyboardPrefs: KeyboardPrefs = {
      locked: this.locked,
      dragPosition: this.dragPosition,
      lastKeyboardFactor: this.keyboardSize
    };
    this.storageService.saveToLocalStorage('keyboardPrefs', keyboardPrefs);
  }
}
