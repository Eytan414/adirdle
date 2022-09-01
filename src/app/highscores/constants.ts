export interface Dataset{
    data: Array<any>,
    label?: string,
}
export interface GraphData{
  type:	string,
  labels?:	string[],
  parsing?: boolean | object,
  datasets: Array<Dataset>
}

export const DEFAULT_TITLE = 'Records';

export const BAR_CHART_OPTIONS_5 = {
    responsive: true,
    plugins: {
      title:{
        display: true,
        text: 'Dirdle 5'
      },
      legend: {
        display: false
      },
    }
 };
export const BAR_CHART_OPTIONS_6 = {
    responsive: false,
    plugins: {
      title:{
        display: true,
        text: 'Dirdle 6'
      },
      legend: {
        display: false
      },
    }
 };