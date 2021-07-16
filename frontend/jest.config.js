module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ["jest-canvas-mock", "jest-webgl-canvas-mock"]
};
