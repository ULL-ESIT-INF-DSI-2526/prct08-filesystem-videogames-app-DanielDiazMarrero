import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import fs from "fs";
import path from "path";
import { GameLibrary } from "../../src/ej1/gameLibrary";
import { VideoGame } from "../../src/ej1/videoGame";
import { Genre, Platform } from "../../src/ej1/types/types";

describe("GameLibrary", () => {
  const username = "testuser";
  const userDir = path.join("data", username);

  const game1: VideoGame = {
    id: "1",
    name: "Elden Ring",
    description: "Soulslike",
    platform: Platform.PC,
    genre: Genre.RPG,
    developer: "FromSoftware",
    releaseYear: 2022,
    multiplayer: true,
    estimatedHours: 80,
    marketValue: 60
  };

  const game2: VideoGame = {
    id: "2",
    name: "Black Desert",
    description: "MMO",
    platform: Platform.PS,
    genre: Genre.MMO,
    developer: "Pearls AByss",
    releaseYear: 2023,
    multiplayer: true,
    estimatedHours: 100,
    marketValue: 40
  };

  beforeEach(() => {
    if (fs.existsSync(userDir)) {
      fs.rmSync(userDir, { recursive: true, force: true });
    }
    if (fs.existsSync("data") && fs.readdirSync("data").length === 0) {
      fs.rmSync("data", { recursive: true, force: true });
    }
  });

  afterEach(() => {
    if (fs.existsSync(userDir)) {
      fs.rmSync(userDir, { recursive: true, force: true });
    }
    if (fs.existsSync("data") && fs.readdirSync("data").length === 0) {
      fs.rmSync("data", { recursive: true, force: true });
    }
  });

  test("Crea carpeta de usuario automáticamente", () => {
    new GameLibrary(username);
    expect(fs.existsSync(userDir)).toBe(true);
  });

  test("Añade videojuego correctamente y crea JSON", () => {
    const library = new GameLibrary(username);

    library.addGame(game1);

    const filePath = path.join(userDir, "1.json");
    expect(fs.existsSync(filePath)).toBe(true);

    const raw = fs.readFileSync(filePath, "utf-8");
    const loaded = JSON.parse(raw);

    expect(loaded.name).toBe("Elden Ring");
    expect(loaded.marketValue).toBe(60);
  });

  test("No permite añadir un videojuego con ID repetido", () => {
    const library = new GameLibrary(username);

    const spy = vi.spyOn(console, "log");

    library.addGame(game1);

    expect(() => library.addGame(game1)).toThrowError("YA existe un videojuego con ese ID")
  });

  test("Modifica videojuego correctamente", () => {
    const library = new GameLibrary(username);

    library.addGame(game1);

    library.modifyGame("1", new VideoGame(
    "1",
    "PokeMMO",
    "MMO",
    Platform.PC,
    Genre.MMO,
    "Indie",
    2023,
    true,
    100,
    40
    ));

    const raw = fs.readFileSync(path.join(userDir, "1.json"), "utf-8");
    const loaded = JSON.parse(raw);

    expect(loaded.marketValue).toBe(40);
    expect(loaded.name).toBe("PokeMMO");
  });

  test("Modificar un juego inexistente muestra error", () => {
    const library = new GameLibrary(username);

    expect(() => library.modifyGame("999", new VideoGame(
    "1",
    "PokeMMO",
    "MMO",
    Platform.PC,
    Genre.MMO,
    "Indie",
    2023,
    true,
    100,
    40
    ))).toThrowError("No existe videojuego con ID 999");
  });

  test("Elimina videojuego correctamente", () => {
    const library = new GameLibrary(username);

    library.addGame(game1);
    expect(fs.existsSync(path.join(userDir, "1.json"))).toBe(true);

    library.removeGame("1");
    expect(fs.existsSync(path.join(userDir, "1.json"))).toBe(false);
  });

  test("Eliminar un juego inexistente muestra error", () => {
    const library = new GameLibrary(username);

    const spy = vi.spyOn(console, "log");
    library.removeGame("999");

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test("loadGames carga correctamente los videojuegos guardados", () => {
    const library = new GameLibrary(username);

    library.addGame(game1);
    library.addGame(game2);

    const games = library.loadGames();

    expect(games.length).toBe(2);
  });

  test("listGames llama a console.table", () => {
    const library = new GameLibrary(username);

    library.addGame(game1);
    library.addGame(game2);

    const spy = vi.spyOn(console, "table").mockImplementation(() => {});

    library.listGames();

    expect(spy).toHaveBeenCalled();

    spy.mockRestore();
  });

  test("showGame llama a console.table si existe el juego", () => {
    const library = new GameLibrary(username);

    library.addGame(game1);

    const spy = vi.spyOn(console, "table").mockImplementation(() => {});
    library.showGame("1");

    expect(spy).toHaveBeenCalled();

    spy.mockRestore();
  });

  test("showGame muestra error si no existe", () => {
    const library = new GameLibrary(username);

    const spy = vi.spyOn(console, "log");

    library.showGame("999");

    expect(spy).toHaveBeenCalled();

    spy.mockRestore();
  });
});