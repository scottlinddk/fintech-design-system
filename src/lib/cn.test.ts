import { describe, expect, it } from 'vitest';
import { cn } from './cn.js';

describe('cn', () => {
  it('joins nonempty class names', () => expect(cn('a', false, undefined, 'b')).toBe('a b'));
});
