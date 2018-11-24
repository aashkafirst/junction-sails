function getSummary(videoId){
	return new Promise(function(resolve, reject) {
		Crisps.find({"videoId":videoId}).exec(function (err, video){
		  	if (!err)
		  	{
		  		sails.log('summary', video[0]);

					if(video[0] === undefined){
						resolve(null);
					}
					else {
						resolve({
							crisps : video[0].summary,
							videoId : video[0].videoId,
							duration : video[0].duration
						});
					}

		  	}
		  	else{
		  		reject(err);
		  	}
		});
	});
}

const VideoDbService = {
	getSummary
};

module.exports = VideoDbService;
