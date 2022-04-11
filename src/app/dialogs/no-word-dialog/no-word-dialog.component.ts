import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-no-word-dialog',
  templateUrl: './no-word-dialog.component.html',
  styleUrls: ['./no-word-dialog.component.scss']
})
export class NoWordDialogComponent{
  start:number;
  end:number;
  hover: boolean = false;
  @ViewChild('challengeBtn', { static: true }) challengeBtn: ElementRef;
  timeout:any;

  constructor(
    private ref: MatDialogRef<NoWordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any    ) { }

  startConfirmation():void{
    this.start = new Date().getTime();
    this.hover = true;
    this.timeout = setTimeout(() => {
      navigator.vibrate(200);      
    }, 1000);
  }

  endConfirmation():void{
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
}