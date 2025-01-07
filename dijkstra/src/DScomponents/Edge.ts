import { Vertex } from "./Vertex";

export class Edge {
  private source: Vertex;
  private destination: Vertex;
  private distance: number;
  private time: number;
  private cost: number;
  constructor(source: Vertex, destination: Vertex, cost: number, time: number) {
    this.source = source;
    this.destination = destination;
    this.cost = cost;
    this.time = time;
    this.distance = this.calculatedistance(); // Automatically calculate distance during construction
  }

  private calculatedistance(): number {
    // Check if source and destination are defined
    if (!this.source || !this.destination) {
      console.error("Source or destination is undefined.");
      return 0; 
    }

    // Get country object from source and destination
    const sourceCountry = this.source.getCountry();
    const destinationCountry = this.destination.getCountry();

    // Check if the country objects are valid
    if (!sourceCountry || !destinationCountry) {
      console.error("Source or destination country is undefined.");
      return 0; 
    }

    // Get latitude and longitude, defaulting to 0 if undefined
    const srcLat = this.toRadians(sourceCountry.getLatitude() || 0);
    const srcLong = this.toRadians(sourceCountry.getLongitude() || 0);
    const destLat = this.toRadians(destinationCountry.getLatitude() || 0);
    const destLong = this.toRadians(destinationCountry.getLongitude() || 0);

    // Calculate the difference in latitudes and longitudes
    const dLat = destLat - srcLat;
    const dLong = destLong - srcLong;

    // Haversine formula to calculate distance
    const curveddistance =
      Math.pow(Math.sin(dLat / 2), 2) +
      Math.pow(Math.sin(dLong / 2), 2) * Math.cos(srcLat) * Math.cos(destLat);

    const EarthRad = 6371; // Earth's radius in kilometers
    const centralAngle = 2 * Math.asin(Math.sqrt(curveddistance));
    this.distance = EarthRad * centralAngle;

    return this.distance;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Getter methods
  public getSource(): Vertex {
    return this.source;
  }

  public getDestination(): Vertex {
    return this.destination;
  }

  public getdistance(): number {
    return this.distance;
  }
  public getCost(): number {
    return this.cost;
  }
  public getTime(): number {
    return this.time;
  }

  // Setter for distance, if needed
  public setdistance(distance: number): void {
    this.distance = distance;
  }

  public setCost(cost: number): void {
    this.cost = cost;
  }
  public setTime(time: number): void {
    this.time = time;
  }
}
