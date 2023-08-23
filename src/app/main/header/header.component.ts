import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HighscoresComponent } from '../../highscores/highscores.component';

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
  recordsOpen: boolean = false;

  constructor(
    private dialog: MatDialog,
    private cd: ChangeDetectorRef) { }

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
  openRecords():void{
    this.recordsOpen = true;
    const dialog = this.dialog.open(HighscoresComponent, {
      panelClass: 'win-dialog',
      disableClose: true, hasBackdrop: false,
    });
    dialog.afterClosed().subscribe(() => { this.recordsOpen = false; });
  }

}
