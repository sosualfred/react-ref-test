export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },

  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "^.+\\.svg$": "jest-transformer-svg",
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputName: "output.xml",
        suiteName: "REACT COMBOBOX TESTS",
        classNameTemplate: "{classname}",
        titleTemplate: "{title}",
      },
    ],
  ],

  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};
