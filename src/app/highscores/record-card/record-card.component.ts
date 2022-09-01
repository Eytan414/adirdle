import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Highscores } from 'src/app/models/Highscores';

@Component({
  selector: 'app-record-card',
  templateUrl: './record-card.component.html',
  styleUrls: ['./record-card.component.scss']
})
export class RecordCardComponent implements OnInit {
  @Input() userRecord: Highscores;

  constructor() { }

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges) {
    this.userRecord = changes.userRecord?.currentValue ?? this.userRecord;
  }
}
