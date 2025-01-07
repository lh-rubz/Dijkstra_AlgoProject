export class Country {
  private countryName: string = "";
  private longitude: number = 0;
  private latitude: number = 0;

  

  constructor(countryName: string, longitude: number, latitude: number) {
    this.setCountryName(countryName);
    this.setLatitude(latitude);
    this.setLongitude(longitude);
    
  }

  public getCountryName(): string {
    return this.countryName;
  }

  public setCountryName(countryName: string): void {
    this.countryName = countryName;
  }

  public getLongitude(): number {
    return this.longitude;
  }

  public setLongitude(longitude: number): void {
    this.longitude = longitude;
  }

  public getLatitude(): number {
    return this.latitude;
  }

  public setLatitude(latitude: number): void {
    this.latitude = latitude;
  }

 
}
