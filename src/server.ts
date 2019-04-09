import { ServerLoader, ServerSettings, GlobalAcceptMimesMiddleware } from '@tsed/common';
import * as admin from 'firebase-admin';
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const rootDir = __dirname;
const serviceAccount = require("../serviceAccountKey.json");
const ip = process.env.IP || '0.0.0.0';
const port = process.env.PORT || 8080;

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

const whitelist = ['http://localhost:4200', 'http://127.0.0.1:8081', 'https://mentor-andersen.firebaseapp.com'];
const corsOptions = {
	origin: function (origin, callback) {
		if (whitelist.indexOf(origin) !== -1) {
			callback(null, true)
		} else {
			callback(new Error('Not allowed by CORS'))
		}
	}
}

@ServerSettings({
	rootDir,
	acceptMimes: ["application/json"],
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
		console.log('running at ' + ip + ':' + port);
	}
	
	public $onServerInitError(err){
		console.error(err);
	}
}

new Server().start();
