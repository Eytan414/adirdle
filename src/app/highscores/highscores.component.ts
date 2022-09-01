import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { StorageService } from 'src/app/services/storage.service';
import { Component, OnInit } from '@angular/core';
import { RECORDS_DB_KEY } from '../constants';
import { Highscores } from '../models/Highscores';
import { BAR_CHART_OPTIONS, GraphData } from './chart/constants';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-highscores',
  templateUrl: './highscores.component.html',
  animations: [
    trigger("pulse", [
      transition('* => *', [
        animate(10000,
          keyframes([
            style({ boxShadow: "inset 0 0 0.25rem 0.25rem #f55" }),
            style({ boxShadow: "inset 0 0 0.25rem 0.25rem #3cc" }),
            style({ boxShadow: "inset 0 0 0.25rem 0.25rem #c3c" }),
            style({ boxShadow: "inset 0 0 0.25rem 0.25rem #cc3" }),
            style({ boxShadow: "inset 0 0 0.25rem 0.25rem #088" }),
            style({ boxShadow: "inset 0 0 0.25rem 0.25rem #808" }),
            style({ boxShadow: "inset 0 0 0.25rem 0.25rem #880" }),
            style({ boxShadow: "inset 0 0 0.25rem 0.25rem #55f" }),
            style({ boxShadow: "inset 0 0 0.25rem 0.25rem #5f5" }),
          ])
        ),
      ]),
    ]),
  ],
  styleUrls: ['./highscores.component.scss']
})

export class HighscoresComponent implements OnInit {
  allRecords: Array<Highscores>;
  animateReverse:boolean = false;
  data5:GraphData;
  data6:GraphData;
  labels5:string[] = [];
  labels6:string[] = [];
  displayChart: boolean = false;
  barChartOptions:ChartConfiguration<'radar'>['options'] = BAR_CHART_OPTIONS;

  constructor(private storageService:StorageService) { }
  
  async ngOnInit() {
    this.allRecords = await this.storageService.readDbReference(RECORDS_DB_KEY) as Highscores[]   
    
    setInterval(() => (this.animateReverse = !this.animateReverse), 10000);
  }

  showChart(userRecord:Highscores){
    this.labels5 = [];
    this.labels6 = [];    
    this.data5 = {
      parsing: {},
      type: 'bar',
      data: { datasets: [{ 
          data: []
      }]}
    };
    this.data6 = {
      parsing: false,
      type: 'bar',
      data: { datasets: [{ 
          data: []
      }]}
    };
    userRecord.words5.details.forEach((count:number, attempts:number) => {
      this.data5.data.datasets[0].data.push({x:attempts, y:count});
      this.labels5.push(attempts+"");
    });
    userRecord.words6.details.forEach((count:number, attempts:number) => {
      this.data6.data.datasets[0].data.push({x:attempts, y:count});
      this.labels6.push(attempts+"");
    });
    this.displayChart = true;
  }

}
