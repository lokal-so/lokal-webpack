import { Lokal } from 'lokal-js';

class lokalTunnel {
	constructor(options = {}) {
		this.options = options;
		this.hasRun = false;
		this.isDev = !!options.isDev || process.env.NODE_ENV !== 'production';
	}

	apply(compiler) {
		compiler.hooks.afterEmit.tapAsync('LokalTunnelPlugin', async (compilation, callback) => {
			if (this.hasRun || !this.isDev) {
				callback();
				return;
			}

			try {
				const { tunnelName, lanAddress, publicAddress, debugMode, baseURL } = this.options;
				const port = parseInt(process.env.PORT);
				const host = 'localhost';

				if (port > 0) {
					let lokal = new Lokal();

					if (debugMode) {
						lokal = lokal.debugMode(true);
					}

					if (baseURL) {
						lokal.setBaseURL(baseURL);
					}

					await lokal
						.newTunnel()
						.setLocalAddress(`${host}:${port}`)
						.setTunnelType('HTTP')
						.setName(tunnelName)
						.setPublicAddress(publicAddress)
						.setLANAddress(lanAddress)
						.showStartupBanner()
						.ignoreDuplicate()
						.create();

					console.log('Lokal tunnel created successfully');
				} else {
					console.warn('Cannot run Lokal:', host, port);
				}

				this.hasRun = true;
			} catch (error) {
				console.error('Error in lokalTunnel:', error);
			}

			callback();
		});
	}
}

export default lokalTunnel;
