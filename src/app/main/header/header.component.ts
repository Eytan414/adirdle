import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent  {
  @Input() enableControls: boolean;
  @Input() darkMode: boolean;
  @Input() wordLength: number;
  @Input() didPlayerWin: boolean;
  @Output() switchGameModeEmitter = new EventEmitter<null>();
  @Output() toggleDarkModeEmitter = new EventEmitter<null>();
  @Output() resetKeyboardPositionEmitter = new EventEmitter<null>();
  @Output() randomizeWordEmitter = new EventEmitter<null>();

  constructor(private storageService: StorageService, private cd: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges) {
    this.enableControls = changes.enableControls?.currentValue ?? this.enableControls;
    this.darkMode = changes.darkMode?.currentValue ?? this.darkMode;
    this.wordLength = changes.wordLength?.currentValue ?? this.wordLength;
    this.didPlayerWin = changes.didPlayerWin?.currentValue ?? this.didPlayerWin;
  }

  resetKeyboardPosition(){
    this.resetKeyboardPositionEmitter.emit();
  }
  switchGameMode() {
    this.switchGameModeEmitter.emit();
  }
  toggleDarkMode() {
    this.toggleDarkModeEmitter.emit();
  }
  randomWord():void{
    this.randomizeWordEmitter.emit();

  }

}
