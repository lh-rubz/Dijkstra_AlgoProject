import { LinkedList } from "./LinkedList";
import { Country } from "./Country";  

export class Vertex {
    private country: Country;
    private vertices: LinkedList;
    private visited: boolean;

    constructor(country: Country) {
        this.country = country;
        this.visited = false;
        this.vertices = new LinkedList(); 
    }

    public getCountry(): Country {
        return this.country;
    }

    public getVertices(): LinkedList {
        return this.vertices;
    }

    public isVisited(): boolean {
        return this.visited;
    }

    public setVisited(visited: boolean): void {
        this.visited = visited;
    }

  
}
