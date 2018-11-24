/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

//var axios=require('axios');

//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
//const JWT = require('jsonwebtoken');

function login(req, res){
	sails.log("idToken frm login ",req.body['idToken']);
	UserService.verifyUser(req.body['idToken'], sails.config.GOOGLE.CLIENT_ID)
	.then(function(user){

		sails.log("user verified",user);
		user['videos']=[];

		UserService.getJwtToken(user)
		.then(function(jwtToken){

			UserDbService.getUser(user.email)
			.then(function(userExists){
				if(!userExists.length)
				{
					sails.log('serverAuthCode', req.body['serverAuthCode']);
					UserService.getRefreshToken(req.body['serverAuthCode'], sails.config.GOOGLE.CLIENT_ID, sails.config.GOOGLE.CLIENT_SECRET)
					.then(function(refreshToken){
						sails.log("refreshToken frm login",refreshToken);
						user['refreshToken']=refreshToken;
						sails.log("user",user);
						return UserDbService.addUser(user, res, jwtToken);
					})
					.catch(function(error){
						sails.log("no refreshToken",error);
						return res.json({ 'loggedIn': null });
					});

				}
				else{
					sails.log("else");
					return res.json({ 'loggedIn': jwtToken });
				}
			})
			.catch(function(userExistsErr){
				sails.log("userExistsErr",userExistsErr);
				return res.json({ 'loggedIn': null });
			});

		})
		.catch(function(noJwtToken){
			sails.log("noJwtToken", noJwtToken);
		});

	})
	.catch(function(err){
		sails.log("user not verified",err);
		return res.json({ 'loggedIn': false });
	});

	// UserService.revoke('ya29.Gl2RBNa2_8EjnfCKDbYormN9JSsuDekPNIG5zbki61jnpzJ_A4IGYiGp9n4Bkz4lNN4ygyRuyvdeCDqegzL34koFDzdF25G57e5Oq4e2LAf1XzUNazY65nslfZWs58I')
	// .then(function(revoke){
	// 	return res.json({ 'loggedIn': true });
	// })
	// .catch(function(err){
	// 	return res.json({ 'loggedIn': true });
	// });
}

function oauth(req, res){

}

function refreshAccessToken(req, res){
	UserService.verifyJwt(req.body['jwtToken'])
	.then(function(email){
		sails.log("email ",email);

		UserDbService.getUser(email)
		.then(function(userFromDb){
			sails.log("userFromDb ",userFromDb);

			UserService.getAccessToken(userFromDb[0]['refreshToken'], sails.config.GOOGLE.CLIENT_ID, sails.config.GOOGLE.CLIENT_SECRET)
			.then(function(accessToken){
				sails.log("accessToken ",accessToken);
				return res.json({ 'accessToken': accessToken });
			})
			.catch(function(err){
				sails.log("err form accessToken ",err);
				return res.json({ 'accessToken': null });
			});

		})
		.catch(function(noUserFromDb){
			sails.log("noUserFromDb ",noUserFromDb);
			return res.json({ 'accessToken': null });
		});

	})
	.catch(function(error){
		return res.json({'accessToken': null});
	});
}

function getCrisps(req, res){
	sails.log('Jwt',req.body['jwtToken']);
	UserService.verifyJwt(req.body['jwtToken'])
	.then(function(email){
		sails.log("user verified",email);

		UserDbService.getCrisps(email, req.body['type'])
		.then(function(reqCrispsList){
			sails.log("myCrisps frm ctrl",reqCrispsList);
			return res.json(reqCrispsList);
		})
		.catch(function(error){
			return res.serverError(error);
		});

	})
	.catch(function(err){
		return res.serverError('User not verified');
	});
}

function deleteCrisp(req, res){
	sails.log('Jwt',req.body['jwtToken']);
	UserService.verifyJwt(req.body['jwtToken'])
	.then(function(email){
		sails.log("user verified",email);

		UserDbService.deleteCrisp(email, req.body['videoId'], req.body['type'])
		.then(function(reqCrispsList){
			sails.log("myCrisps frm ctrl",reqCrispsList);
			return res.json(reqCrispsList);
		})
		.catch(function(error){
			return res.serverError(error);
		});

	})
	.catch(function(err){
		return res.serverError('User not verified');
	});
}

const UserController = {
	login,
	oauth,
	refreshAccessToken,
	getCrisps,
	deleteCrisp
};

module.exports = UserController;
