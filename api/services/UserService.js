var axios=require('axios');
const JWT = require('jsonwebtoken');

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

function verifyUser(idToken, clientId){
	sails.log("verifyUser ",idToken, clientId);
	return new Promise(function(resolve, reject) {
		axios.get('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + idToken)
		.then(function(res){
			if ((res.status === 200) && (res.data.email_verified && res.data.email && res.data.aud===clientId)) {
				sails.log("verifyUser then if");
				var user = {
					'name': res.data.name,
					'picture': res.data.picture,
					'email': res.data.email
				};
				resolve(user);
			} else {
				sails.log("verifyUser then else");
				reject('Token Invalid.');
			}
		})
		.catch(function(err){
			sails.log("verifyUser err",err);
			reject(err);
		});

	});
}

function getJwtToken(user){
	let tokenData = { 'email' : user.email,
					  'name' : user.name
					};

	return new Promise(function(resolve, reject) {
		sails.log('sails.config.JWT.SECRET', sails.config.JWT.SECRET);
		JWT.sign(tokenData, sails.config.JWT.SECRET, {expiresIn: sails.config.JWT.VALIDITY}, function(err, token) {
			if (err) {
				reject(err);
			} else {
				sails.log('jwt', token);
				resolve(token);
			}
		});
	});
}

function verifyJwt(jwtToken){
	return new Promise((resolve, reject) => {
		sails.log('verifyJwt',jwtToken);
		JWT.verify(jwtToken, sails.config.JWT.SECRET, {maxAge: '30d'}, function(err, decoded){
			if (err) {
				reject(err);
			} else {
				resolve(decoded.email);
			}
		});
	});
}

function getRefreshToken(serverAuthCode, clientId, clientSecret){
	return new Promise(function(resolve, reject) {
		axios({
		    url: 'https://www.googleapis.com/oauth2/v4/token',
		    method: 'post',
		    params: {
		      code: serverAuthCode,
		      client_id: clientId,
		      client_secret: clientSecret,
		      redirect_uri: sails.config.GOOGLE.REDIRECT_URI,
		      grant_type: 'authorization_code',
		    }
	  	})
	  	.then(function(res) {
	  		if ((res.status === 200) && (res.data.refresh_token !== null))
	  		{
	  			sails.log("access_token",res.data.access_token);
	  			resolve(res.data.refresh_token);
	  		}
	  		else
	  		{
	  			sails.log("no refresh_token");
	  			reject('refresh token not found');
	  		}
	  	})
	  	.catch(function(err) {
	    	sails.log("err",err.response.data);
	    	reject(err);
	  	});
	});
}

function getAccessToken(refreshToken, clientId, clientSecret){
	sails.log("refreshToken frm access_token",refreshToken);
	return new Promise(function(resolve, reject) {
		axios({
		    url: 'https://www.googleapis.com/oauth2/v4/token',
		    method: 'post',
		    params: {
		      client_id: clientId,
		      client_secret: clientSecret,
		      refresh_token: refreshToken,
		      grant_type: 'refresh_token',
		    }
  		})
	  	.then(function(res) {
	  		if ((res.status === 200) && (res.data.access_token !== null))
	  		{
	  			sails.log("accessToken ",res.data.access_token);
	  			resolve(res.data.access_token);
	  		}
	  		else
	  		{
	  			reject(null);
	  		}
	  	})
	  	.catch(function(err) {
	    	sails.log(err);
	    	reject(null);
	  	});
	});
}

function saveHighlights(email, videoId, duration, highlights, type){
	return new Promise(function(resolve, reject) {
		UserDbService.getUser(email)
		.then(function(user){
			sails.log("getUser ",user);

			VideoService.createVideoJson(user, videoId, duration, highlights, type)
			.then(function(videos){
				sails.log("videos ",videos);

				UserDbService.updateHighlights(email, videos)
				.then(function(updated){
					sails.log("updated ",updated);
					resolve(updated);
				})
				.catch(function(err){
					sails.log("err fm update highlights ",err);
					reject(error);
				});

			})
			.catch(function(err) {
				sails.log('error from createVideoJson', err);
				reject(err);
			});

		})
		.catch(function(error){
			sails.log("err frm getUser ",error);
			reject(error);
		});
	});
}

function revoke(accessToken){
	return new Promise(function(resolve, reject) {
		axios.get('https://accounts.google.com/o/oauth2/revoke?token=' + accessToken)
			.then(function(res){
				sails.log("",res);
				resolve("done");
			})
			.catch(function(error){
				sails.log("err",error);
				reject(error);
			});
	});
}

const UserService = {
	verifyUser,
	verifyJwt,
	getJwtToken,
	getRefreshToken,
	getAccessToken,
	saveHighlights,
	revoke
};

module.exports = UserService;
