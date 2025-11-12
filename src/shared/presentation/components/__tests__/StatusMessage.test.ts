import StatusMessage from '../StatusMessage/StatusMessage';

describe('StatusMessage', () => {
  it('has displayName set for debugging', () => {
    expect(StatusMessage.displayName).toBe('StatusMessage');
  });
});
