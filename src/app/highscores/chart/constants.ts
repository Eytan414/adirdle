export interface Dataset{
    data: Array<any>
}
export interface GraphData{
  type?:	string,
  parsing?: boolean | object,
  data:{ datasets: Array<Dataset>}
}

export const BAR_CHART_OPTIONS = {
    responsive: false,
 };