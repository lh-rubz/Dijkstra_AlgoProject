type vertex = number;
import { Country } from "./Country";
import { Edge } from "./Edge";
import { Vertex } from "./Vertex";

export class Graph {
  private vertices: Vertex[];

  constructor(vertices: Vertex[]) {
    this.vertices = vertices;
  }

  addEdge(edge: Edge, bidirectional?: boolean): void {
    const source = edge.getSource();
    // const destination = edge.getDestination();

    source.getVertices().addLast(edge);
    console.log("edge added");

    // if (bidirectional) {
    //     destination.addNeighbor(source);
    // }
  }
  //getter
  getVertices(): Vertex[] {
    return this.vertices;
  }
  getVertexCount(): void {
    console.log(`The graph has ${this.vertices.length} vertex/vertices.`);
  }

  getEdgesCount(): void {
    let count = 0;

    for (const vertex of this.vertices) {
      count += vertex.getVertices().getSize();
    }

    console.log(`The graph has ${count} edge(s).`);
  }

  hasVertex(vertex: Vertex): boolean {
    const vertexExists = this.vertices.includes(vertex);
    if (vertexExists) {
      return true;
    } else {
      return false;
    }
  }

  hasEdge(source: Vertex, destination: string): boolean {
    if (source.getVertices().get(destination)) {
      return true;
    } else {
      return false;
    }
  }
  getVertexByName(name: string): Vertex | undefined {
    return this.vertices.find(
      (vertex) =>
        vertex.getCountry().getCountryName()?.toLowerCase() ===
        name.toLowerCase()
    );
  }

  neighbours(vertex: Vertex): void {
    const vertexIndex = this.vertices.indexOf(vertex);
    if (vertexIndex >= 0) {
      console.log(
        `The neighbors of vertex ${vertex.getCountry().getCountryName()} are `
      );
      vertex.getVertices().printList();
    } else {
      console.log(
        `The vertex ${vertex
          .getCountry()
          .getCountryName()} does not exist in the graph.`
      );
    }
  }

  toString(): string {
    return this.vertices.map((vertex) => vertex.toString()).join("\n");
  }
}

// Driver Code
const countryA = new Country("USA", 0, 1);
const countryB = new Country("Canada", 1, 3);
const countryC = new Country("Mexico", 4, 5);

// Create vertices
const vertexA = new Vertex(countryA);
const vertexB = new Vertex(countryB);
const vertexC = new Vertex(countryC);

// Create edges
const edgeAB = new Edge(vertexA, vertexB, 10, 20);
const edgeAC = new Edge(vertexA, vertexC, 20, 10);

// Create a graph and add vertices
const graph = new Graph([vertexA, vertexB, vertexC]);

// Add edges to the graph
graph.addEdge(edgeAB, true);
graph.addEdge(edgeAC, true);

// Print graph details
graph.getVertexCount();
graph.getEdgesCount();

// Check if a vertex exists
console.log("Checking for vertex A:");
console.log(graph.hasVertex(vertexA));

// Check if an edge exists
console.log("Checking for edge between A and B:");
console.log(graph.hasEdge(vertexA, vertexB.getCountry().getCountryName()!));

// Get neighbors
graph.neighbours(vertexA);

// Print graph's string representation
console.log("Graph Representation:");
console.log(graph.toString());
