function addUser(user, res, jwtToken){
	Users.findOrCreate({email:user.email}, user).exec(function createFindCB(err, createdOrFoundRecords){
		if (err)
		{
			sails.log(err);
			return res.json({ 'loggedIn': null });
		}
		return res.json({ 'loggedIn': jwtToken });
	});
}

function getUser(email){
	return new Promise(function(resolve, reject) {
		Users.find({"email":email}).exec(function (err, user){
		  	if (!err)
		  	{
		  		resolve(user);
		  	}
		  	else{
		  		reject(null);
		  	}
		});
	});
}

function updateHighlights(email, videos){
	sails.log("email ",email);
	return new Promise(function(resolve, reject) {
		Users.update({"email":email},{"videos":videos}).exec(function (err, updated){
		 	if (!err) {
				resolve(updated);
	 		}
	 		else{
	 			reject(err);
	 		}

		});
	});
}

function getCrisps(email, type){
	sails.log("email ",email);
	var reqCrispsList = [];
	return new Promise(function(resolve, reject) {
		Users.find({"email":email, select: ['videos']}).exec(function (err, crispsList){
		 	if (!err) {
		 		sails.log('crisps', crispsList, crispsList[0].videos);
				for(var i=0; i < crispsList[0].videos.length ; i++){
					sails.log(crispsList[0].videos[i].type)
					if(crispsList[0].videos[i].type === type){
						reqCrispsList.push(crispsList[0].videos[i]);
					}
				}
				sails.log(JSON.stringify(reqCrispsList));
				resolve(reqCrispsList);
	 		}
	 		else{
	 			reject(err);
	 		}

		});
	});
}

function deleteCrisp(email, videoId, type){
	sails.log("email ",email, videoId, type);
	var reqCrispsList = [];
	return new Promise(function(resolve, reject) {
		Users.find({"email":email, select: ['videos']}).exec(function (err, crispsList){
		 	if (!err) {
		 		for(var i=0 ; i<crispsList[0].videos.length ; i++){
					if((crispsList[0].videos[i].videoId !== videoId) || (crispsList[0].videos[i].type !== type)){
						reqCrispsList.push(crispsList[0].videos[i]);
					}
				}
				sails.log('reqCrispsList', JSON.stringify(reqCrispsList));

				Users.update({"email":email},{"videos":reqCrispsList}).exec(function (err, updated){
				 	if (!err) {
						sails.log('updated', JSON.stringify(updated));
						resolve(updated);
			 		}
			 		else{
			 			reject(err);
			 		}
				});

	 		}
	 		else{
	 			reject(err);
	 		}

		});
	});
}

const UserDbService = {
	addUser,
	getUser,
	updateHighlights,
	getCrisps,
	deleteCrisp
};

module.exports = UserDbService;
