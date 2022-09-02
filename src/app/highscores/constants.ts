export interface Dataset{
    data: Array<any>,
    label?: string,
    fill?:string,
}
export interface GraphData{
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
    },
    scales: {
      x: {
        display: true,
      },
      y: {
        type: 'logarithmic',
        display: true,
      }
    },
 };
export const BAR_CHART_OPTIONS_6 = {
  responsive: true,
    plugins: {
      title:{
        display: true,
        text: 'Dirdle 6'
      },
      legend: {
        display: false
      },
      scales: {
        x: {
          display: true,
        },
        y: {
          type: 'logarithmic',
          display: true,
        }
      },
    }
 };