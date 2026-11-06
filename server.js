import {createServer as createHttpServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';

const indexPath = fileURLToPath(new URL('./index.html', import.meta.url));

export function createServer({ttlMs = 12000, sweepIntervalMs = 2000, now = Date.now} = {}) {
	const races = new Map();
	const subscribers = new Set();
	const publicRaces = () => [...races.values()].map(({token, ...race}) => race);
	const publish = () => {
		const payload = `data: ${JSON.stringify(publicRaces())}\n\n`;
		for (const subscriber of subscribers) subscriber.write(payload);
	};
	const removeExpired = () => {
		let changed = false;
		for (const [code, race] of races) {
			if (race.expiresAt <= now()) {
				races.delete(code);
				changed = true;
			}
		}
		if (changed) publish();
	};
	const sweepTimer = setInterval(removeExpired, sweepIntervalMs);
	sweepTimer.unref();

	const server = createHttpServer(async (request, response) => {
		const url = new URL(request.url, 'http://localhost');
		removeExpired();
		if (request.method === 'GET' && (url.pathname === '/' || url.pathname === '/index.html')) {
			try {
				const html = await readFile(indexPath);
				response.writeHead(200, {'content-type': 'text/html; charset=utf-8'}).end(html);
			} catch {
				response.writeHead(500).end('Unable to load the game.');
			}
			return;
		}
		if (request.method === 'GET' && url.pathname === '/api/races') {
			response.writeHead(200, {'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store'}).end(JSON.stringify(publicRaces()));
			return;
		}
		if (request.method === 'GET' && url.pathname === '/api/events') {
			response.writeHead(200, {
				'content-type': 'text/event-stream; charset=utf-8',
				'cache-control': 'no-cache, no-transform',
				'connection': 'keep-alive'
			});
			response.write(`data: ${JSON.stringify(publicRaces())}\n\n`);
			subscribers.add(response);
			const heartbeat = setInterval(() => response.write(': keep-alive\n\n'), 15000);
			request.on('close', () => {
				clearInterval(heartbeat);
				subscribers.delete(response);
			});
			return;
		}
		if (request.method === 'POST' && url.pathname === '/api/races') {
			let body;
			try {
				let raw = '';
				for await (const chunk of request) {
					raw += chunk;
					if (raw.length > 4096) throw new Error('Request too large');
				}
				body = JSON.parse(raw);
			} catch {
				response.writeHead(400).end('Invalid request body.');
				return;
			}
			const code = typeof body.roomCode === 'string' ? body.roomCode.toUpperCase() : '';
			if (!/^[A-Z0-9]{6}$/.test(code) || typeof body.token !== 'string' || body.token.length < 16 ||
				typeof body.host !== 'string' || typeof body.name !== 'string' ||
				!Number.isInteger(body.players) || body.players < 1 || body.players > 8 ||
				!['Wartet', 'Läuft'].includes(body.status)) {
				response.writeHead(400).end('Invalid race details.');
				return;
			}
			const existing = races.get(code);
			if (existing && existing.token !== body.token) {
				response.writeHead(409).end('Room code is already published.');
				return;
			}
			races.set(code, {
				token: body.token,
				roomCode: code,
				name: body.name.slice(0, 40),
				host: body.host.slice(0, 16),
				players: body.players,
				maxPlayers: 8,
				status: body.status,
				expiresAt: now() + ttlMs
			});
			publish();
			response.writeHead(204).end();
			return;
		}
		const deleteMatch = request.method === 'DELETE' && url.pathname.match(/^\/api\/races\/([A-Z0-9]{6})$/);
		if (deleteMatch) {
			let body;
			try {
				let raw = '';
				for await (const chunk of request) raw += chunk;
				body = JSON.parse(raw);
			} catch {
				response.writeHead(400).end('Invalid request body.');
				return;
			}
			const race = races.get(deleteMatch[1]);
			if (!race) {
				response.writeHead(204).end();
				return;
			}
			if (race.token !== body.token) {
				response.writeHead(403).end('Invalid host token.');
				return;
			}
			races.delete(deleteMatch[1]);
			publish();
			response.writeHead(204).end();
			return;
		}
		response.writeHead(404).end('Not found.');
	});

	server.on('close', () => clearInterval(sweepTimer));
	return server;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	const port = Number(process.env.PORT) || 8000;
	createServer().listen(port, '0.0.0.0', () => console.log(`APEX Racing läuft auf Port ${port}`));
}