import { ServerLoader, ServerSettings, GlobalAcceptMimesMiddleware } from '@tsed/common';
import * as admin from 'firebase-admin';
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const rootDir = __dirname;
const server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
const server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
const httpPort = `${server_ip_address}:${server_port}`;
const whitelist = ['http://localhost:4200', 'http://127.0.0.1:8081', 'https://mentor-andersen.firebaseapp.com'];
const corsOptions = {
	origin: function (origin, callback) {
		if (whitelist.indexOf(origin) !== -1) {
			callback(null, true)
		} else {
			callback(new Error('Not allowed by CORS'))
		}
	}
};

@ServerSettings({
	rootDir,
	acceptMimes: ["application/json"],
	httpPort: server_port,
	httpsPort: server_port,
	statics: {
		"/": `https://mentor-andersen.firebaseapp.com/`
	}
	
})
export class Server extends ServerLoader {

	/**
	 * This method let you configure the express middleware required by your application to works.
	 * @returns {Server}
	 */
	public $onMountingMiddlewares(): void|Promise<any> {
		this
			.use(GlobalAcceptMimesMiddleware)
			.use(cookieParser())
			.use(cors(corsOptions))
			.use(compress({}))
			.use(methodOverride())
			.use(bodyParser.json())
			.use(bodyParser.urlencoded({
				extended: true
			}));
		
		return null;
	}
	
	public $onReady(){
		console.error('httpPort', httpPort);
	}
	
	public $onServerInitError(err){
		console.error(err);
	}
}

new Server().start();
