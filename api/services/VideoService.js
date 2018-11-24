function createVideoJson(user, videoId, duration, highlights, type){
	return new Promise(function(resolve, reject) {
		var flag=0;
		user[0]['videos'].forEach(function(vid, index) {
			sails.log("forEach");
			if(vid['videoId']===videoId && vid['type']===type){
				flag=1;
				user[0]['videos'][index]['highlights'] = highlights;
				sails.log("user after highlights ",user);
				resolve(user[0]['videos']);
			}
		});
		if(!flag)
		{
			sails.log("flag ",flag);
			user[0]['videos'].push({
				"videoId":videoId,
	  		"duration":duration,
	  		"highlights":highlights,
				"type":type
			});
			sails.log(user);
			resolve(user[0]['videos']);
		}
	});
}

const VideoService = {
	createVideoJson
};

module.exports = VideoService;
