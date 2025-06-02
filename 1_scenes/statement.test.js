import { describe, it, expect } from 'vitest';
import statement from './after.js';
import invoice from './invoice.json' with { type: 'json' };
import plays from './plays.json' with { type: 'json' };

describe('statement', () => {
    it('should return formatted statement', () => {
        const result = statement(invoice, plays);

        // Примеры проверок
        expect(result).toContain('Счёт для');
        expect(result).toContain('Итого с вас');
        expect(result).toContain('бонусов');
        expect(result).toMatch(/[\d]+ мест/); // проверка на количество мест
    });
});
