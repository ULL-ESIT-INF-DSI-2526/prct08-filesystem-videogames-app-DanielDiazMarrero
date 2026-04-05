import fs from 'fs';  // sisetma de ficheros
import path from "path"; //  para hacer las rutas
import chalk from "chalk";
import { VideoGame } from './videoGame.js';

export class GameLibrary {
  private userDir: string;

  constructor (private username: string) {
    this.userDir = path.join("data", this.username);
    this.ensureUserDirectory();
  }

  private ensureUserDirectory(): void {
    if (!fs.existsSync("data")) fs.mkdirSync("data");  // Si no exitse /data se crea
    if (!fs.existsSync(this.userDir)) fs.mkdirSync(this.userDir);  // Si no existe /data/user se crea
  }

  private getGamePath(id: string): string {  // Retorna la ruta de los datos del juego
    return path.join(this.userDir, `${id}.json`);
  }

  private marketValueColor(value: number): string {
    if (value < 20) return chalk.red(value.toString());  // Para usar chalk debe ser string
    if (value < 50) return chalk.yellow(value.toString());
    if (value < 80) return chalk.blue(value.toString());
    return chalk.green(value.toString());
  }

  addGame(game: VideoGame): void {
    const filePath = this.getGamePath(game.id);

    if(fs.existsSync(filePath)) {
      throw new Error(chalk.red("YA existe un videojuego con ese ID"))
    }

    fs.writeFileSync(filePath, JSON.stringify(game, null, 2));
    console.log(chalk.green("Videojuego añadido correctamente"));
  }

  modifyGame(id: string, newGame: VideoGame): void {
    const filePath = this.getGamePath(id);

    if (!fs.existsSync(filePath)) {
      throw new Error(chalk.red(`No existe videojuego con ID ${id}`));
      return;
    }

    fs.writeFileSync(filePath, JSON.stringify(newGame, null, 2));  // Cambiamos el contenido
    const newPath = this.getGamePath(newGame.id);
    fs.renameSync(filePath, newPath)  // Renombramos el fichero
    console.log(chalk.green(`Videojuego con ID ${id} modificado correctamente.`));
  }

  removeGame(id: string): void {
    const filePath = this.getGamePath(id);

    if (!fs.existsSync(filePath)) {
      console.log(chalk.red(`No existe videojuego con ID ${id}`));
      return;
    }

    fs.unlinkSync(filePath);
    console.log(chalk.green(`Videojuego con ID ${id} eliminado correctamente.`));
  }

  listGames(): void {
    const files: string[] = fs.readdirSync(this.userDir).filter((f: string) => f.endsWith(".json"));

    if (files.length === 0) {
      console.log(chalk.red("No hay videojuegos en la lista."));
      return;
    }

    const games: object[] = files.map((file: string) => {
      const data: VideoGame = JSON.parse(
        fs.readFileSync(path.join(this.userDir, file), "utf-8")
      ) as VideoGame;

      return {
        ID: data.id,
        Name: data.name,
        Platform: data.platform,
        Genre: data.genre,
        Developer: data.developer,
        Year: data.releaseYear,
        Multiplayer: data.multiplayer,
        Hours: data.estimatedHours,
        MarketValue: this.marketValueColor(data.marketValue)
      };
    });

    console.table(games);
  }

   showGame(id: string): void {
    const filePath = this.getGamePath(id);

    if (!fs.existsSync(filePath)) {
      console.log(chalk.red(`No existe videojuego con ID ${id}`));
      return;
    }

    const data: VideoGame = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    console.table([{
      ID: data.id,
      Name: data.name,
      Description: data.description,
      Platform: data.platform,
      Genre: data.genre,
      Developer: data.developer,
      ReleaseYear: data.releaseYear,
      Multiplayer: data.multiplayer,
      EstimatedHours: data.estimatedHours,
      MarketValue: this.marketValueColor(data.marketValue)
    }]);
  }

  loadGames(): VideoGame[] {
    const files = fs.readdirSync(this.userDir).filter((f: string) => f.endsWith(".json"));

    const games: VideoGame[] = [];

    for (const file of files) {
      const raw = fs.readFileSync(path.join(this.userDir, file), "utf-8");
      const data: VideoGame = JSON.parse(raw);
      games.push(data);
    }

    console.log(chalk.green(`${games.length} videojuegos cargados para ${this.username}`));
    return games;
  }
}