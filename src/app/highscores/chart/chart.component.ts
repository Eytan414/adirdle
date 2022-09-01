import { Component, Input, OnInit } from '@angular/core';
import { BAR_CHART_OPTIONS, GraphData } from './constants';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  barChartOptions:ChartConfiguration<'radar'>['options'] = BAR_CHART_OPTIONS;
  @Input() data5:GraphData;
  @Input() data6:GraphData;
  @Input() labels5:string[];
  @Input() labels6:string[];

  constructor() { }

  ngOnInit(): void {

  
  }

}

