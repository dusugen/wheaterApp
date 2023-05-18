export interface WeatherData {
  name: string;
  main: {
    feels_like: number;
    temp: number;
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
    gust: number;
  };
  weather: [
    {
      main: string;
      icon: string;
      description:string
    }
  ];
  sys: {
    country: string;
  };
}
