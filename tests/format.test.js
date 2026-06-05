import test from 'node:test';
import assert from 'node:assert/strict';

import { formatMoney, formatRam, formatDuration } from '../src/lib/format.js';

test('formats money with compact suffixes', () => {
  assert.equal(formatMoney(0), '$0.00');
  assert.equal(formatMoney(1532), '$1.53k');
  assert.equal(formatMoney(2_500_000), '$2.50m');
});

test('formats RAM in Bitburner units', () => {
  assert.equal(formatRam(8), '8.00GB');
  assert.equal(formatRam(2048), '2.00TB');
});

test('formats durations from milliseconds', () => {
  assert.equal(formatDuration(1200), '1.2s');
  assert.equal(formatDuration(125000), '2m 5s');
});
