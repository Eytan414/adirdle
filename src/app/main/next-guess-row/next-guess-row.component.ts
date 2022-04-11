import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ColorMarkings } from 'src/app/models/ColorMarking';
import { Guess } from 'src/app/models/Guess';

@Component({
  selector: 'app-next-guess-row',
  templateUrl: './next-guess-row.component.html',
  styleUrls: ['./next-guess-row.component.scss']
})
export class NextGuessRowComponent implements OnChanges{
  @Input() wordLength: number;
  @Input() nextGuess: Array<Guess>;
  @Input() guesses: Array<Guess>;
  @Input() showNextGuessRow: boolean;
  @Input() dailyWord: string;
  @Input() colorMarkingSets: ColorMarkings;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    this.wordLength = changes.wordLength?.currentValue ?? this.wordLength;
    this.nextGuess = changes.nextGuess?.currentValue ?? this.nextGuess;
    this.guesses = changes.guesses?.currentValue ?? this.guesses;
    this.showNextGuessRow = changes.showNextGuessRow?.currentValue ?? this.showNextGuessRow;
    this.dailyWord = changes.dailyWord?.currentValue ?? this.dailyWord;
    this.colorMarkingSets = changes.colorMarkingSets?.currentValue ?? this.colorMarkingSets;
  }

  clearGuess(): void {
    // this.nextGuess = [];
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
  

  letterSlotClicked($event :MouseEvent | TouchEvent){

  }
}
