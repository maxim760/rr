export type Matrix = Array<Array<number>>;
export type Pair = [number, number];
export type Path = Pair[];

export interface Node {
  cost: number;
  level: number;
  path: Path;
  reducedMatrix: Matrix;
  vertex: number;
}

export type Point = {
  coordinates: Pair;
  type: 'Point';
};