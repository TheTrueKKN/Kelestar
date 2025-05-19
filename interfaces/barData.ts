export interface BarData{
    labels: string[];
  datasets: {
    data: number[];
    colors?: (() => string)[];
  }[];
}