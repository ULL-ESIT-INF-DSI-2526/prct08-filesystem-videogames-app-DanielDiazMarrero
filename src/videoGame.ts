import chalk from "chalk";
import { Genre, Platform, Developer } from "./types/types.js";

export class VideoGame {
  constructor (
    public id: string, 
    public name: string,
    public description: string,
    public platform: Platform,
    public genre: Genre,
    public developer: string,
    public releaseYear: number,
    public multiplayer: boolean,
    public estimatedHours: number,
    public marketValue: number) 
    {
      if (releaseYear < 0) {
        throw new Error(chalk.red("Fecha no válida"));
      }
      if (estimatedHours < 0) {
        throw new Error(chalk.red("Horas no válidas"));
      }
      if (marketValue < 0) {
        throw new Error(chalk.red("Valor de mercado no válido"))
      }
    }

    /*getData(): string | undefined {
        
      return 
        `ID: ${this.id}, 
        NAME: ${this.name},
        DESC: ${this.description},
        PLATFORM: ${this.platform},
        GENRE: ${this.genre},
        DEVELOPER: ${this.developer},
        RELEASE: ${this.releaseYear},
        MULTIPLAYER: ${this.multiplayer},
        ESTIMATEDHOURS: ${this.estimatedHours},
        MARKETVALUE: ${this.marketValue},`
    }*/
}