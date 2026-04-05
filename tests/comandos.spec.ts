import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

describe("CLI tests (yargs)", () => {
  const username = "cliuser";
  const userDir = path.join("data", username);

  const run = (command: string) => {
    return execSync(command, { encoding: "utf-8" });
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

  test("add crea el JSON del videojuego", () => {
    run(
      `node dist/comandos.js add --user ${username} --id 1 --name "Elden Ring" --description "Soulslike" --platform "PC" --genre "Rol" --developer "FromSoftware" --releaseYear 2022 --multiplayer true --estimatedHours 80 --marketValue 60`
    );

    expect(fs.existsSync(path.join(userDir, "1.json"))).toBe(true);
  });

  test("show muestra información del videojuego", () => {
    run(
      `node dist/comandos.js add --user ${username} --id 1 --name "Elden Ring" --description "Soulslike" --platform "PC" --genre "Rol" --developer "FromSoftware" --releaseYear 2022 --multiplayer true --estimatedHours 80 --marketValue 60`
    );

    const output = run(`node dist/comandos.js show --user ${username} --id 1`);

    expect(output).toContain("Elden Ring");
    expect(output).toContain("FromSoftware");
  });

  test("list lista videojuegos del usuario", () => {
    run(
      `node dist/comandos.js add --user ${username} --id 1 --name "Elden Ring" --description "Soulslike" --platform "PC" --genre "RPG" --developer "FromSoftware" --releaseYear 2022 --multiplayer true --estimatedHours 80 --marketValue 60`
    );

    run(
      `node dist/comandos.js add --user ${username} --id 2 --name "FIFA 24" --description "Football" --platform "PC" --genre "MMO" --developer "FromSoftware" --releaseYear 2023 --multiplayer true --estimatedHours 100 --marketValue 40`
    );

    const output = run(`node dist/comandos.js list --user ${username}`);

    expect(output).toContain("Elden Ring");
    expect(output).toContain("FIFA 24");
  });

  test("modify modifica correctamente un videojuego", () => {
    run(
      `node dist/comandos.js add --user ${username} --id 1 --name "Elden Ring" --description "Soulslike" --platform "PC" --genre "Rol" --developer "FromSoftware" --releaseYear 2022 --multiplayer true --estimatedHours 80 --marketValue 60`
    );

    run(
      `node dist/comandos.js modify --user ${username} --id "1" --newId "1" --name "FIFA 24" --description "Football" --platform "PC" --genre "MMO" --developer "FromSoftware" --releaseYear 2023 --multiplayer true --estimatedHours 100 --marketValue 40`
    );

    const raw = fs.readFileSync(path.join(userDir, "1.json"), "utf-8");
    const data = JSON.parse(raw);

    expect(data.marketValue).toBe(40);
  });

  test("remove elimina correctamente un videojuego", () => {
    run(
      `node dist/comandos.js add --user ${username} --id 1 --name "Elden Ring" --description "Soulslike" --platform "PC" --genre "Rol" --developer "FromSoftware" --releaseYear 2022 --multiplayer true --estimatedHours 80 --marketValue 60`
    );

    expect(fs.existsSync(path.join(userDir, "1.json"))).toBe(true);

    run(`node dist/comandos.js remove --user ${username} --id 1`);

    expect(fs.existsSync(path.join(userDir, "1.json"))).toBe(false);
  });

  test("load carga los videojuegos (solo verifica que no falla)", () => {
    run(
      `node dist/comandos.js add --user ${username} --id 1 --name "Elden Ring" --description "Soulslike" --platform "PC" --genre "Rol" --developer "FromSoftware" --releaseYear 2022 --multiplayer true --estimatedHours 80 --marketValue 60`
    );

    const output = run(`node dist/comandos.js load --user ${username}`);

    expect(output).toContain("videojuegos cargados");
  });

  test("add con ID repetido muestra error", () => {
    run(
      `node dist/comandos.js add --user ${username} --id 1 --name "Elden Ring" --description "Soulslike" --platform "PC" --genre "RPG" --developer "FromSoftware" --releaseYear 2022 --multiplayer true --estimatedHours 80 --marketValue 60`
    );

    expect(() => run(
      `node dist/comandos.js add --user ${username} --id 1 --name "Duplicado" --description "Dup" --platform "PC" --genre "RPG" --developer "X" --releaseYear 2022 --multiplayer true --estimatedHours 80 --marketValue 60`
    )).toThrowError("YA existe un videojuego con ese ID");
  });
});