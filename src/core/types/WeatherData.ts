export interface WeatherData {
  code: number;
  list: WeatherMainData[];
  city: {
    name: string;
    country: string;
  };
}

export interface WeatherMainData {
  dt: number;
  dt_txt: string;
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
      description: string;
    }
  ];
}
