import { wss } from './src/ws_server/index';
import { httpServer } from './src/http_server/index';

const HTTP_PORT = 8181;
const WS_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

console.log(`WS server started on the ws://localhost:${WS_PORT}/`);
wss(WS_PORT);
