import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-win-dialog',
  templateUrl: './win-dialog.component.html',
  styleUrls: ['./win-dialog.component.scss']
})
export class WinDialogComponent implements OnInit{
  start:number;
  end:number;
  hover: boolean = false;
  @ViewChild('challengeBtn', { static: true }) challengeBtn: ElementRef;
  timeout:any;
  timeToNextWord: string;

  constructor(private utilService: UtilsService, @Inject(MAT_DIALOG_DATA) public data: any,
              private ref: MatDialogRef<WinDialogComponent>) { }
  
  ngOnInit(): void {
    this.timeToNextWord = this.utilService.calculateTimeToNextWord();
  }
  
  startConfirmation():void{ //start of confirmation of word deletion (1sec long press required)
    this.start = new Date().getTime();
    this.hover = true;
    this.timeout = setTimeout(() => {
      navigator.vibrate(200);      
    }, 1000);
  }
  endConfirmation():void {
    clearTimeout(this.timeout);
    this.end = new Date().getTime();
    this.hover = false;
    let pressTime = this.end - this.start;
    if(pressTime < 1000){
      this.killTimeout();
    } else {
      navigator.vibrate(200);      
      this.ref.close(true);
    }
  }
  killTimeout():void{
    navigator.vibrate(0);
  }
  touchmove($event: TouchEvent):void{
    //calc latest target that is being touched
    let targetElement: Element =  document.elementFromPoint(
      $event.changedTouches[0].clientX,
      $event.changedTouches[0].clientY
    );

    if(targetElement !== this.challengeBtn.nativeElement)
      this.killTimeout();
  }
  
  shareScore(){
    let text = this.utilService.analyzeTextToShare(this.data.guesses);
    let encodedWord = this.utilService.encodeWord(this.data.dailyWord);
    this.utilService.shareScore(text, encodedWord);
  }
    
}  
