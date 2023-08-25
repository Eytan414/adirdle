import { Directive, OnInit, OnDestroy, Input, Output, ElementRef } from "@angular/core";
import { EventEmitter } from '@angular/core';
import { Subscription, fromEvent, switchMap, timer, takeUntil } from "rxjs";

@Directive({
  selector: '[longClick]',
})
export class LongpressDirective implements OnInit, OnDestroy {
  @Input() duration = 1500;
  @Output() longClick = new EventEmitter<void>();

  sub!: Subscription;
  constructor(private el: ElementRef) {}
  ngOnInit(): void {
    const mouseDown$ = fromEvent(this.el.nativeElement, 'mousedown');
    const mouseUp$ = fromEvent(this.el.nativeElement, 'mouseup');
    this.sub = mouseDown$
      .pipe(switchMap(() => timer(this.duration).pipe(takeUntil(mouseUp$))))
      .subscribe(() => this.longClick.emit());
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}