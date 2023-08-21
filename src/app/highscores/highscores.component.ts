import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { StorageService } from 'src/app/services/storage.service';
import { Component, OnInit } from '@angular/core';
import { RECORDS_DB_KEY } from '../constants';
import { Highscores } from '../models/Highscores';
import { BAR_CHART_OPTIONS_5, BAR_CHART_OPTIONS_6, DATASET_OPTIONS, DEFAULT_TITLE } from './constants';
import { ChartConfiguration, ChartData} from 'chart.js';

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
  data5:ChartData<'bar'>;
  data6:ChartData<'bar'>;
  labels5:string[] = [];
  labels6:string[] = [];
  displayChart: boolean = false;
  
  chartOptions5:ChartConfiguration<any>['options'] = BAR_CHART_OPTIONS_5;
  chartOptions6:ChartConfiguration<any>['options'] = BAR_CHART_OPTIONS_6;
  title: string = DEFAULT_TITLE;
  constructor(private storageService:StorageService) { }
  
  async ngOnInit() {
    this.allRecords = await this.storageService.readDbReference(RECORDS_DB_KEY) as Highscores[];
    this.allRecords = this.allRecords.filter(r => r);

    setInterval(() => (this.animateReverse = !this.animateReverse), 10000);
  }

  showChart(userRecord:Highscores){
    this.title = userRecord.name.toUpperCase();
    this.labels5 = [];
    this.labels6 = [];
    
    this.data5 = {
      datasets: [{ 
        data: [],
        ...DATASET_OPTIONS
    }]};
    this.data6 = {
      datasets: [{ 
        data: [],
        ...DATASET_OPTIONS
    }]};
    
    const totalGuesses5:number = userRecord.words5.details.reduce((prev:number, cur:number)=> prev + cur, 0);
    const totalGuesses6:number = userRecord.words6.details?.reduce((prev:number, cur:number)=> prev + cur, 0);
    
    if(userRecord.words5.games > 0){
      userRecord.words5.details.forEach((count:number, attempts:number) => {
        this.data5.datasets[0].data.push(count);
        const percentage = (count/totalGuesses5*100).toFixed(2);
        this.labels5.push(`${attempts} attempts (${percentage}%)`);
      });
      this.data5.labels = this.labels5;
    }

    if(userRecord.words6.games > 0){
      userRecord.words6.details.forEach((count:number, attempts:number) => {
        this.data6.datasets[0].data.push(count);
        const percentage = (count/totalGuesses6*100).toFixed(2);
        this.labels6.push(`${attempts} attempts (${percentage}%)`);
      });
      this.data6.labels = this.labels6;
    }

    this.displayChart = true;
  }

  backClicked(){
    this.displayChart = false;
    this.title = DEFAULT_TITLE;
  }
}
