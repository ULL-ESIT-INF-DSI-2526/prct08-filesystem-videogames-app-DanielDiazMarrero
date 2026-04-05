import { describe, test, expect } from "vitest";
import { VideoGame } from "../../src/ej1/videoGame";
import { Genre, Platform } from "../../src/ej1/types/types";

describe("VideoGame", () => {
  test("Se crea correctamente y devuelve ID", () => {
    const game = new VideoGame(
      "1",
      "Elden Ring",
      "Soulslike",
      Platform.PC,
      Genre.RPG,
      "FromSoftware",
      2022,
      true,
      80,
      60
    );
  });
});