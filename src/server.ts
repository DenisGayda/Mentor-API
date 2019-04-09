import { ServerLoader, ServerSettings, GlobalAcceptMimesMiddleware } from '@tsed/common';
import * as admin from 'firebase-admin';
import { UserCtrl } from './controllers/UserCtrl';
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const rootDir = __dirname;
const serviceAccount = require("../serviceAccountKey.json");
const server_ip = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
const server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
const whitelist = ['http://localhost:4200', 'http://127.0.0.1:8081', 'https://mentor-andersen.firebaseapp.com'];
const port = `${server_ip}:${server_port}`;

const corsOptions = {
	origin: function (origin, callback) {
		if (whitelist.indexOf(origin) !== -1) {
			callback(null, true)
		} else {
			callback(new Error('Not allowed by CORS'))
		}
	}
};

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

@ServerSettings({
	rootDir,
	acceptMimes: ["application/json"],
	httpPort: port,
	httpsPort: port,
	mount: {
		"/user": UserCtrl
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
	
	public $onServerInitError(err){
		console.error(err);
	}
}

new Server().start()
	.then(() => console.log(`server is listening on ${port}`))
	.catch((err) => console.log('something bad happened', err));
