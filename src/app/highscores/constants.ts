export interface Dataset{
    data?: Array<any>,
    label?: string,
    backgroundColor?:string,
    borderColor?:string,
    borderWidth?:number,
    barPercentage?:number,
}
export interface GraphData{
  labels?:	string[],
  parsing?: boolean | object,
  datasets: Array<Dataset>
}

export const DEFAULT_TITLE = 'Records';
export const COLORS_BARCA_BLUE = '#004D98';
export const COLORS_BARCA_BURGUNDY = '#A50044';

export const DATASET_OPTIONS = {
    backgroundColor: COLORS_BARCA_BLUE,
    borderColor: COLORS_BARCA_BURGUNDY,
    borderWidth: 2,
    barPercentage: .9
};

const scales = {
  x: {
    display: false,
  },
  y: {
    type: 'logarithmic',
    min: .5,
  },
}
export const BAR_CHART_OPTIONS_5 = {
  responsive: true,
  scales,
  plugins: {
    title:{
      display: true,
      text: 'Dirdle 5'
    },
    legend: {
      display: false
    },
  },
 };
export const BAR_CHART_OPTIONS_6 = {
  responsive: true,
  scales,
  plugins: {
    title:{
      display: true,
      text: 'Dirdle 6'
    },
    legend: {
      display: false
    },
  },    
 };