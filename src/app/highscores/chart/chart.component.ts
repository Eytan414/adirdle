import { Component, Input } from '@angular/core';
import { GraphData } from '../constants';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent{
  @Input() data:GraphData;
  @Input() options:ChartConfiguration<any>['options'];

  constructor() { }
}