import { expect, test, describe } from 'vitest';
import { config } from '../source/config/env';

describe('Configuration Engine', () => {
  test('should load default configuration', () => {
    expect(config.AI_API_PORT).toBeDefined();
    expect(config.ACTIVE_LLM_PROVIDER).toBe('ollama');
    expect(config.ACTIVE_VECTOR_STORE).toBe('qdrant');
  });
});
