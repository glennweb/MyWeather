import { Clouds } from "./Clouds";
import { Coord } from "./Coord";
import { Main } from "./Main";
import { Sys } from "./Sys";
import { Weather } from "./Weather";
import { Wind } from "./Wind";

export interface CityWeather {
  coord: Coord;
  sys: Sys;
  weather: Weather[];
  main: Main;
  visibility: number;
  wind: Wind;
  clouds: Clouds;
  dt: number;
  id: number;
  name: string;
}
