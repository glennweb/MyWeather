import { Coord } from "./Coord";

export interface City {
    id: number;
    name: string;
    state: string;
    country: string;
    coord: Coord;
}
