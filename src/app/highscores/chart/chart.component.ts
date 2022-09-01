import { Component, Input, OnInit } from '@angular/core';
import { BAR_CHART_OPTIONS_5, GraphData } from '../constants';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  @Input() data:GraphData;
  @Input() options:ChartConfiguration<any>['options'];

  constructor() { }

  ngOnInit(): void {

  
  }

}

