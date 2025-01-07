import { Tab } from "@material-tailwind/react";
import { Graph } from "./Graph";
import { LinkedList } from "./LinkedList";
import { TableEntry } from "./TableEntry";
import { Vertex } from "./Vertex";
import { Country } from "./Country";
import { Edge } from "./Edge";

export class Dijkstra {
  private Table: TableEntry[] = [];
  private vertices: Vertex[] = [];
  //setters
  public setTable(table: TableEntry[]): void {
    this.Table = table;
  } //getters
  public getTable(): TableEntry[] {
    return this.Table;
  }
  //setters
  public setVertices(vertices: Vertex[]): void {
    this.vertices = vertices;
  }
  //getters
  public getVertices(): Vertex[] {
    return this.vertices;
  }
  // Initialize Table
  public initializeTable(start: Vertex, g: Graph): void {
    this.vertices = g.getVertices();
    this.vertices.forEach((vertex, index) => {
      this.Table[index] = new TableEntry(vertex.getCountry().getCountryName());

      console.log(
        `Initialized ${vertex
          .getCountry()
          .getCountryName()} with Inf values for dist, time, and cost.`
      );
    });

    const indexStart = this.Table.findIndex(
      (entry) => entry.getName() === start.getCountry().getCountryName()
    );

    if (indexStart !== -1) {
      this.Table[indexStart].setDist(0); // Set start vertex distance to 0
      this.Table[indexStart].setTime(0); // Set start vertex time to 0
      this.Table[indexStart].setCost(0); // Set start vertex cost to 0
      console.log(this.Table[indexStart].getTime());
      console.log(
        `Starting point ${start
          .getCountry()
          .getCountryName()} initialized with dist, time, and cost as 0.`
      );
    }
  }

  public dijkstra(
    type: "time" | "cost" | "dist",
    start: Vertex,
    g: Graph,
    end: Vertex
  ): void {
    this.initializeTable(start, g);
    const targetIndex = this.Table.findIndex(
      (entry) => entry.getName() === end.getCountry().getCountryName()
    );

    for (;;) {
      // Get the smallest unknown vertex based on the filter
      const startIndex = this.getSmallest_Unknown_Vertex(type);

      // If the target vertex is reached, break => this makes it from source to destination
      if (startIndex === targetIndex) {
        console.log("Reached the target vertex");
        break;
      }

      // If no more vertices to process, break
      if (startIndex === -1) {
        console.log("No more vertices to process");
        break;
      }

      const currentEntry: TableEntry = this.Table[startIndex];
      currentEntry.setKnown(true); // Mark the current vertex as visited

      const currentVertex = this.vertices[startIndex];
      if (currentVertex === null) continue;

      const edgesLinkedList: LinkedList = currentVertex.getVertices();

      for (let i = 0; i < edgesLinkedList.getSize(); i++) {
        const dest: Vertex = edgesLinkedList
          .getNodeByIndex(i)
          .getEdge()
          .getDestination();
        const destIndex = this.vertices.indexOf(dest);

        if (destIndex === -1) continue; //  invalid vertex index

        const edge = edgesLinkedList.getNodeByIndex(i).getEdge();
        const newDist = currentEntry.getDist() + edge.getdistance();
        const newTime = currentEntry.getTime() + edge.getTime();
        const newCost = currentEntry.getCost() + edge.getCost();

        const x = {
          dist: () => newDist < this.Table[destIndex].getDist(),
          time: () => newTime < this.Table[destIndex].getTime(),
          cost: () => newCost < this.Table[destIndex].getCost(),
        };

        if (!this.Table[destIndex].getKnown() && x[type]()) {
          this.Table[destIndex].setDist(newDist);
          this.Table[destIndex].setTime(newTime);
          this.Table[destIndex].setCost(newCost);
          this.Table[destIndex].setPath(this.Table.indexOf(currentEntry));
        }
      }
    }
  }

  // Get the index of the vertex in the Table
  getVertexIndexInTable(v: Vertex): number {
    return this.Table.findIndex(
      (entry) => entry.getName() === v.getCountry().getCountryName()
    );
  }

  // Get the smallest unknown vertex based on the specified type (cost, time, dist)
  getSmallest_Unknown_Vertex(type: "time" | "cost" | "dist"): number {
    if (this.Table.length === 0) return -1;

    let min = Number.MAX_SAFE_INTEGER;
    let minIndex = -1;

    // Iterate through all the vertices
    for (let i = 0; i < this.Table.length; i++) {
      const vertex = this.Table[i];

      // Skip known vertices
      if (vertex.getKnown()) {
        continue;
      }

      // Log the current vertex values for debugging
      console.log(`Checking vertex at index ${i}:`);
      console.log(
        `Cost: ${vertex.getCost()}, Time: ${vertex.getTime()}, Dist: ${vertex.getDist()}`
      );

      // Compare values based on type
      if (type === "cost" && vertex.getCost() < min) {
        min = vertex.getCost();
        minIndex = i;
      } else if (type === "time" && vertex.getTime() < min) {
        min = vertex.getTime();
        minIndex = i;
      } else if (type === "dist" && vertex.getDist() < min) {
        min = vertex.getDist();
        minIndex = i;
      }
    }

    console.log(`Smallest vertex index: ${minIndex}`);
    return minIndex;
  }

  // Get the index of the vertex in the vertices array
  getVertexIndexInVertices(name: string): number {
    return this.vertices.findIndex(
      (vertex) => name === vertex.getCountry().getCountryName()
    );
  }

  // Print the path from the source to the destination
  public printPath(v: Vertex): void {
    const vIndex = this.getVertexIndexInTable(v);
    if (vIndex === -1) {
      console.log("Vertex not found in the table.");
      return;
    }

    // If the vertex has a previous path, recursively print the previous vertex
    if (this.Table[vIndex].getPath() !== -1) {
      const previousIndex = this.Table[vIndex].getPath(); // Get the index of the previous vertex
      const previousVertex = this.vertices[previousIndex]; // Retrieve the previous vertex
      this.printPath(previousVertex);
      console.log("to");
    }

    // Print the current vertex name
    console.log(this.Table[vIndex].getName());
  }

  // Get the final values (cost, time, dist) for a destination vertex
  public getFinalValues(
    destination: Vertex
  ): { cost: number; time: number; dist: number } | null {
    const destIndex = this.getVertexIndexInTable(destination);
    if (destIndex === -1) {
      console.log("Destination vertex not found in the table.");
      return null;
    }

    console.log(
      `Final values for destination ${destination
        .getCountry()
        .getCountryName()}:`
    );
    console.log(`Cost: ${this.Table[destIndex].getCost()}`);
    console.log(`Time: ${this.Table[destIndex].getTime()}`);
    console.log(`Distance: ${this.Table[destIndex].getDist()}`);

    return {
      cost: this.Table[destIndex].getCost(),
      time: this.Table[destIndex].getTime(),
      dist: this.Table[destIndex].getDist(),
    };
  }

  public getPathAndVertices(v: Vertex): {
    pathString: string;
    vertices: Vertex[];
  } {
    const vIndex = this.getVertexIndexInTable(v);
    if (vIndex === -1) {
      console.log("Vertex not found in the table.");
      return { pathString: "", vertices: [] };
    }

    let pathString = "";
    let vertices: Vertex[] = []; //  stores the vertices in the order they are visited

    //  make the path if there is a previous vertex
    if (this.Table[vIndex].getPath() !== -1) {
      const previousIndex = this.Table[vIndex].getPath();
      const previousVertex = this.vertices[previousIndex];

      // gets the path for the previous vertex
      const previousPathAndVertices = this.getPathAndVertices(previousVertex);

      // add it to the path string
      pathString += previousPathAndVertices.pathString;

      //edge details
      const edgeDetails = `
      From: ${previousVertex.getCountry().getCountryName()} 
      To: ${this.Table[vIndex].getName()}
      Distance: ${this.Table[vIndex].getDist().toFixed(3)} km
      Cost: ${this.Table[vIndex].getCost()} $
      Time: ${this.Table[vIndex].getTime()} minutes\n`;

      pathString += edgeDetails; // Append current edge details

      // Add the current vertex to the vertices array
      vertices = [...previousPathAndVertices.vertices, v];
    } else {
      vertices = [v];
    }

    return { pathString, vertices };
  }
}
