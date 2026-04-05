import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { GameLibrary } from "./gameLibrary.js";
import { Genre, Platform, Developer } from "./types/types.js";
import { VideoGame } from "./videoGame.js";

yargs(hideBin(process.argv))

  // ADD
  .command(
    "add",  // nombre
    "Añadir videojuego",  // info del --help
    {  // argumentos
      user: { type: "string", demandOption: true },  // demandOption es para que sea obligatorio y nunca sea undefined
      id: { type: "string", demandOption: true },
      name: { type: "string", demandOption: true },
      description: { type: "string", demandOption: true },
      platform: { type: "string", demandOption: true },
      genre: { type: "string", demandOption: true },
      developer: { type: "string", demandOption: true },
      releaseYear: { type: "number", demandOption: true },
      multiplayer: { type: "boolean", demandOption: true },
      estimatedHours: { type: "number", demandOption: true },
      marketValue: { type: "number", demandOption: true },
    },
    (argv) => {  // funcion del comando
      const library = new GameLibrary(argv.user);

      library.addGame(new VideoGame(
        argv.id,
        argv.name,
        argv.description,
        argv.platform as Platform,
        argv.genre as Genre,
        argv.developer,
        argv.releaseYear,
        argv.multiplayer,
        argv.estimatedHours,
        argv.marketValue
      ));
    }
  )

  // MODIFY
  .command(
    "modify",
    "Modificar videojuego",
    {
      user: { type: "string", demandOption: true },
      id: { type: "string", demandOption: true },
      newId: { type: "string", demandOption: true},
      name: { type: "string", demandOption: true},
      description: { type: "string", demandOption: true },
      platform: { type: "string" , demandOption: true},
      genre: { type: "string", demandOption: true },
      developer: { type: "string", demandOption: true },
      releaseYear: { type: "number", demandOption: true },
      multiplayer: { type: "boolean", demandOption: true },
      estimatedHours: { type: "number", demandOption: true },
      marketValue: { type: "number", demandOption: true }
    },
    (argv) => {
      const library = new GameLibrary(argv.user);

      library.modifyGame(argv.id, new VideoGame(
        argv.newId,
        argv.name,
        argv.description,
        argv.platform as Platform,
        argv.genre as Genre,
        argv.developer,
        argv.releaseYear,
        argv.multiplayer,
        argv.estimatedHours,
        argv.marketValue
      ));
    }
  )

  // REMOVE
  .command(
    "remove",
    "Eliminar videojuego",
    {
      user: { type: "string", demandOption: true },
      id: { type: "string", demandOption: true }
    },
    (argv) => {
      const library = new GameLibrary(argv.user);
      library.removeGame(argv.id);
    }
  )

  // LIST
  .command(
    "list",
    "Listar videojuegos",
    {
      user: { type: "string", demandOption: true }
    },
    (argv) => {
      const library = new GameLibrary(argv.user);
      library.listGames();
    }
  )

  // SHOW
  .command(
    "show",
    "Mostrar videojuego",
    {
      user: { type: "string", demandOption: true },
      id: { type: "string", demandOption: true }
    },
    (argv) => {
      const library = new GameLibrary(argv.user);
      library.showGame(argv.id);
    }
  )

  // LOAD
  .command(
    "load",
    "Cargar videojuegos desde ficheros JSON",
    {
      user: { type: "string", demandOption: true }
    },
    (argv) => {
      const library = new GameLibrary(argv.user);
      library.loadGames();
    }
  )

  .demandCommand(1)
  .help()
  .parse();