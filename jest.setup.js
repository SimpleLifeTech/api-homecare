// Define o tempo máximo de execução para cada teste
jest.setTimeout(10000);

// Limpa todos os mocks após cada teste
jest.clearAllMocks();

// Desativa os logs durante os testes
global.console = {
  ...console,
  // Mantém o erro no console
  error: jest.fn(),
  // Desativa logs de informação
  log: jest.fn(),
  // Desativa logs de aviso
  warn: jest.fn(),
  // Desativa logs de informação
  info: jest.fn(),
  // Desativa logs de depuração
  debug: jest.fn(),
};

// Define variáveis de ambiente para teste
process.env.NODE_ENV = 'test';