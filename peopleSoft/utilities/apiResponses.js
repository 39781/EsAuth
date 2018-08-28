var fs 		= require('fs');
var config 	= require('./../config.js');

module.exports = {
	buildResponse:function(resp){
		return new Promise(function(resolve, reject){
			switch(resp.type.toLowerCase()){
				case 'leavebalance':resolve(leavebalance(resp.data));break;
			}
		});
	}
}

var leavebalance = function(data){
	var responseObj = JSON.parse(JSON.stringify(config.responseObj));
	var lists = {
		title:'your leave balance details',
		items:[]
	};
	data.root.HX_LV_BAL_SUB.forEach(function(lb){
		lists.items.push({
              "optionInfo": {
                "key": lb.LEAVEDESC,
                "synonyms": []
              },
              "title": lb.LEAVEDESC,
              "description": lb.LEAVEBALANCE,
              "image": {}
            })
	});
	responseObj.payload.google={
		richResponse:{
			items:[
				{
					simpleResponse:{
						textToSpeach:'Following are the leave balance available for you',
						displayText:'Following are the leave balance available for you'
					}
				}
			],
			suggestions : [
				{
					title:'Apply leave'
				},
				{
					title:'Holiday list'
				},
				{
					title:'Leave status'
				},
				{
					title:'Leave balance'
				},
				{
					title:'Go to menu'
				}
			]
		},
		systemIntent:{
			"intent": "actions.intent.OPTION",
			"data": {
				"@type": "type.googleapis.com/google.actions.v2.OptionValueSpec",
				"listSelect": lists
			}
		}
	}
	return responseObj;
}