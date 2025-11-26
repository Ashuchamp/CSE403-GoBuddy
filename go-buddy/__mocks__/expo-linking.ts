module.exports = {
  openURL: jest.fn(),
  canOpenURL: jest.fn(() => Promise.resolve(true)),
  createURL: jest.fn(() => 'https://example.com'),
};
