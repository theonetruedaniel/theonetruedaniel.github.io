import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { matchesRepository } from './repository-catalog.mjs';

const catalog = JSON.parse(readFileSync(new URL('./repository-catalog.json', import.meta.url)));
const rows = catalog.repositories.map(row => ({ ...row, search: Object.values(row).flat().join(' ') }));
test('all records are visible with empty filters', () => {
  assert.equal(rows.filter(row => matchesRepository(row)).length, catalog.github_repository_count);
});
test('all search terms must match, independent of case and whitespace', () => {
  const matches = rows.filter(row => matchesRepository(row, { query: '  PRIME   lifecycle ' }));
  assert.deepEqual(matches.map(row => row.repository), ['PrimeIntellect-ai/prime-agent']);
});
test('historical repository names remain searchable after redirects', () => {
  assert.equal(rows.filter(row => matchesRepository(row, { query: 'Gitlawb/openclaude' })).length, 1);
  assert.equal(rows.filter(row => matchesRepository(row, { query: 'Twigpine/openclaude' })).length, 1);
});
test('status and architecture layer filters intersect', () => {
  const found = rows.filter(row => matchesRepository(row, { stage: 'tested', layer: 'Decision components' }));
  assert.deepEqual(found.map(row => row.repository), ['NandhaKishorM/laya']);
  assert.equal(rows.filter(row => matchesRepository(row, { stage: 'tested', layer: 'Agent runtimes' })).length, 0);
});
test('no repository is silently promoted into adopted integrations', () => {
  assert.equal(rows.filter(row => matchesRepository(row, { stage: 'adopted' })).length, 0);
  assert.equal(rows.filter(row => row.stage === 'selected-content').length, 1);
});
test('unknown text and literal markup produce no matches', () => {
  for (const query of ['not-a-real-repository-123', '<script>alert(1)</script>']) {
    assert.equal(rows.filter(row => matchesRepository(row, { query })).length, 0);
  }
});
test('repository names and current canonical destinations are unique', () => {
  for (const key of ['repository', 'url']) assert.equal(new Set(rows.map(row => row[key].toLowerCase())).size, rows.length);
});
test('every upstream URL has dated verification and every card has a fit and next gate', () => {
  for (const row of rows) {
    assert.match(row.url, /^https:\/\/github\.com\/[^/]+\/[^/]+$/);
    assert.match(row.link_checked, /^2026-10-(07|09|10)$/);
    assert.ok(row.purpose && row.fit && row.disposition && row.next_gate && row.evidence_basis);
  }
});
