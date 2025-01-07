export class TableEntry {
  private known: boolean;
  private dist: number;
  private path: number; //previous vertex index
  private time: number;
  private cost: number;
  private name:string;

  constructor(name:string) {
    this.known = false;
    this.dist = Infinity;
    this.path = -1;
    this.time = Infinity;
    this.cost = Infinity;
    this.name = name;
   
  }
// getters for string 
public getName():string{
    return this.name;
    }
//setter for string
public setName(name:string):void{
    this.name=name;
    }
  //getters for known
  public getKnown(): boolean {
    return this.known;
  }

  //getters for dist

  public getDist(): number {
    return this.dist;
  }

  //getters for path 
  public getPath(): number {
    return this.path;
  }
  //getter for time
  public getTime(): number {
    return this.time;
  }
  //getter for cost
  public getCost(): number {
    return this.cost;
  }
  //setter for known
  public setKnown(known: boolean): void {
    this.known = known;
  }
  //setter for dist
  public setDist(dist: number): void {
    this.dist = dist;
  }
  //setter for path
  public setPath(path: number): void {
    this.path = path;
  }
  //setter for time
  public setTime(time: number): void {
    this.time = time;
  }
  //setter for cost
  public setCost(cost: number): void {
    this.cost = cost;
  }

  //reset All
  public resetAll(): void {
    this.known = false;
    this.dist = Infinity;
    this.path = -1;
    this.time = Infinity;
    this.cost = Infinity;
    }

    //tostring
    public toString(): string {
        return `Known: ${this.known}, Dist: ${this.dist}, Path: ${this
            .path}, Time: ${this.time}, Cost: ${this.cost}`;
            }

    


}
