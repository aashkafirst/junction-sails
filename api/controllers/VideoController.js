var axios=require('axios');

function highlights(req, res){
	// sails.log("videoId",req.body[1]['videoId']);
	// sails.log("duration",req.body[1]['duration']);
	// sails.log("highlights",req.body[2]['highlights']);
	// sails.log("idToken",req.body[0]['idToken']);
	sails.log('Jwt',JSON.stringify(req.body), req.body[0]['highlights']);
	UserService.verifyJwt(req.body[0]['jwtToken'])
	.then(function(email){
		sails.log("user verified first",email);

		UserService.saveHighlights(email, req.body[0]['videoId'], req.body[0]['duration'], req.body[0]['highlights'], req.body[0]['type'])
		.then(function(data){
			sails.log('before axios', JSON.stringify(data));
			axios.post('http://localhost:5000/processCrisps', {
			    videoId:req.body[0]['videoId'],
			    duration:req.body[0]['duration'],
			    crisps:req.body[0]['highlights']
		  	})
		  	.then(function (response) {
			    console.log('processHighlights', response);
			    return res.json({'msg':'highlights saved successfully'});
		  	})
		  	.catch(function (error) {
			    console.log('processHighlights error', error);
			    return res.json({'msg':'highlights saved successfully'});
		  	});

		})
		.catch(function(error){
			sails.log('second catch : ', error);
			return res.serverError(error);
		});

	})
	.catch(function(err){
		sails.log('first catch : user not verified');
		return res.serverError('User not verified');
	});
}

function summary(req, res){
	sails.log('Jwt',req.body['jwtToken']);
	sails.log('videoId', req.body['videoId']);
	UserService.verifyJwt(req.body['jwtToken'])
	.then(function(email){
		sails.log("user verified",email);

		VideoDbService.getSummary(req.body['videoId'])
		.then(function(summary){
			sails.log("summary frm ctrl",summary);
			return res.json(summary);
		})
		.catch(function(error){
			return res.serverError(error);
		});

	})
	.catch(function(err){
		return res.serverError('User not verified');
	});
}

const VideoController = {
	highlights,
	summary
};

module.exports = VideoController;
