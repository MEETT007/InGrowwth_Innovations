import { expect, test, describe, vi } from 'vitest';
import { modelManager } from '../source/managers/ModelManager';
import { contextManager } from '../source/managers/ContextManager';
import { ILLMProvider } from '../source/interfaces';

describe('Model Manager', () => {
  test('should register and retrieve LLM provider', () => {
    const mockProvider: ILLMProvider = {
      name: 'ollama',
      generateText: vi.fn(),
      streamText: vi.fn() as any,
      healthCheck: vi.fn().mockResolvedValue(true)
    };

    modelManager.registerLLMProvider(mockProvider);
    const provider = modelManager.getActiveLLMProvider();
    expect(provider.name).toBe('ollama');
  });
});

describe('Context Manager', () => {
  test('should store and retrieve session context', () => {
    contextManager.createContext('session-1', 'You are a helpful assistant.');
    contextManager.addMessage('session-1', { role: 'user', content: 'Hello' });
    
    const context = contextManager.getContext('session-1');
    expect(context.length).toBe(2);
    expect(context[0].role).toBe('system');
    expect(context[1].role).toBe('user');
  });
});
