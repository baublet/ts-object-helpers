import type { Config } from "@jest/types";

// Sync object
const config: Config.InitialOptions = {
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testPathIgnorePatterns: ["/node_modules/", "/build/"],
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
};

export default config;
