// tests/suma.test.js
const { suma } = require('../app');

test('debería sumar dos números correctamente', () => {
  const resultado = suma(2, 3);
  expect(resultado).toBe(5);
});

test('debería manejar números negativos', () => {
  const resultado = suma(-1, 1);
  expect(resultado).toBe(0);
});
