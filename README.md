# artaccount
API of caldearte user account manager.

## client use

1.- create a token with the user and password:

```javascript
// get user token
$.ajax({
	 url: "http://artaccount.herokuapp.com/token",
	 headers: {
		 'username': options.username,
		 'password': options.password
	 },
	 type: "GET",
	 success: function(data) {
		 console.log(data);
	 }
});
```

2.- Get user info with encrypted token
```javascript
  $.get('http://artaccount.herokuapp.com/secret', { access_token: token},
      function(data){
           console.log("user: ", data);
  });
```

3.- register a new user
```javascript
  $.get('http://artaccount.herokuapp.com/register', {
		username: 'daniel',
		password: 'pass',
		plan: 'premium' // premium, free
	}, function(data){
           console.log("new_user: ", data);
  });
```
