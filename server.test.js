import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from './server.js';

async function withServer(options, run) {
	const server = createServer(options);
	await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
	try {
		await run(`http://127.0.0.1:${server.address().port}`);
	} finally {
		await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
	}
}

const race = (overrides = {}) => ({
	roomCode: 'ABC123', token: 'host-session-token-123', host: 'Testfahrer',
	name: 'Alpine GP', players: 1, status: 'Wartet', ...overrides
});

test('public races are unique, update live, and hide host tokens', async () => {
	await withServer({}, async base => {
		for (const details of [race(), race({players: 3, status: 'Läuft'})]) {
			const response = await fetch(`${base}/api/races`, {method: 'POST', body: JSON.stringify(details)});
			assert.equal(response.status, 204);
		}
		const list = await (await fetch(`${base}/api/races`)).json();
		assert.equal(list.length, 1);
		assert.equal(list[0].players, 3);
		assert.equal(list[0].status, 'Läuft');
		assert.equal('token' in list[0], false);
	});
});

test('only the host can remove a race; deleting it sends an SSE update', async () => {
	await withServer({}, async base => {
		const events = await fetch(`${base}/api/events`);
		const reader = events.body.getReader();
		const decoder = new TextDecoder();
		await reader.read();
		await fetch(`${base}/api/races`, {method: 'POST', body: JSON.stringify(race())});
		const update = decoder.decode((await reader.read()).value);
		assert.match(update, /ABC123/);
		const denied = await fetch(`${base}/api/races/ABC123`, {method: 'DELETE', body: JSON.stringify({token: 'wrong-token-value'})});
		assert.equal(denied.status, 403);
		const removed = await fetch(`${base}/api/races/ABC123`, {method: 'DELETE', body: JSON.stringify({token: race().token})});
		assert.equal(removed.status, 204);
		assert.deepEqual(await (await fetch(`${base}/api/races`)).json(), []);
		await reader.cancel();
	});
});

test('expired announcements are removed from the public list', async () => {
	let currentTime = 1000;
	await withServer({ttlMs: 100, sweepIntervalMs: 10000, now: () => currentTime}, async base => {
		await fetch(`${base}/api/races`, {method: 'POST', body: JSON.stringify(race())});
		currentTime = 1101;
		assert.deepEqual(await (await fetch(`${base}/api/races`)).json(), []);
	});
});