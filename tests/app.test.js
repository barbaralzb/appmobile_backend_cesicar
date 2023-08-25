const app = require('./app');

test('debería crear una instancia de la aplicación Express sin errores', () => {
  expect(() => {
    app.listen(3000, () => {});
  }).not.toThrow();
});
