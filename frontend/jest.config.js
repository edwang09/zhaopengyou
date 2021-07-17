module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ["jest-canvas-mock", "jest-webgl-canvas-mock","jest-localstorage-mock"],
  testEnvironmentOptions: { "resources": "usable" },
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js"
  }
};
