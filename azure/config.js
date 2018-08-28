module.exports = {
		authorizeEndpoint:'https://login.microsoftonline.com/70064479-4fe3-4c43-8f71-44208e7c8e74/oauth2/authorize',
		tokenEndpoint:'https://login.microsoftonline.com/70064479-4fe3-4c43-8f71-44208e7c8e74/oauth2/v2.0/token',
		client_id:'ef1e541e-365c-477d-9a93-ff8fda666d4b',
		redirect_uri:'https://df8qy9srl5.execute-api.us-east-1.amazonaws.com/V1/chatbot360',
		redirect_uri1:'http://ec2-54-172-70-40.compute-1.amazonaws.com:3000/getToken',
		repuri:'http://ec2-54-172-70-40.compute-1.amazonaws.com%2F3000',
		resource:'https://graph.windows.net',
		client_secret:'wRKL8sSkOZMIOo04ECYShI80O3uEz/AHspsfydqheCE=',
		grant_type:'authorization_code',
		state:12345,		
		scope:'openid profile offline_access Contacts.ReadWrite',
		nonce:882773,
		jwksUri : 'https://login.microsoftonline.com/70064479-4fe3-4c43-8f71-44208e7c8e74/discovery/v2.0/keys',		
		issuer:'https://sts.windows.net/70064479-4fe3-4c43-8f71-44208e7c8e74',
		algorithm:['RS256'],
		creds:{
			identityMetadata:'https://login.microsoftonline.com/70064479-4fe3-4c43-8f71-44208e7c8e74/.well-known/openid-configuration',
			clientID:'ef1e541e-365c-477d-9a93-ff8fda666d4b'
		},
		botAvatar : "avatar/macy.jpg",
		MICROSOFT_APP_ID : "f6f17219-119a-472b-93a4-c63af610f65a",
		MICROSOFT_APP_PASSWORD : "dshQVKK3961*_cpcxFJP5;:",
		clienAccessToken: "4e401a88dded41d99bf4891e40b2ba09",
		teams:{
			aud:'f6f17219-119a-472b-93a4-c63af610f65a',
			iss:'https://api.botframework.com'
		}
}

