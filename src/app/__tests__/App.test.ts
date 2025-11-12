import App from '../App';

describe('App', () => {
  it('exports the component correctly', () => {
    expect(App).toBeDefined();
    expect(typeof App).toBe('function');
  });
});
