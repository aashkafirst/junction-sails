/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

const env = {

	JWT: {
		VALIDITY: '30d',
		// SECRET: 'J4VmSCpXTER7t3GtgiCGHyeiUIV93+6JzZc+7qHWTRI='
			// Production Server Secret
		SECRET: 'aashka06/08rida14/01'
	},

	GOOGLE: {
		CLIENT_ID: '255256607501-nkrlqpqr4im20ef8tdg05ottlo3btndh.apps.googleusercontent.com',
		CLIENT_SECRET: 'InC9iGaJ8TzsyFlCKtwbs4Vc',
		REDIRECT_URI: 'http://localhost:1337/oauth'
	}

};
module.exports = env;
