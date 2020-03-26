### Queries
```
GET http://localhost:3000/v1/auth
```
Get the login form
```
POST http://localhost:3000/v1/auth/authenticate
```
Send the admin name and pass to sign up or log in and get a pair of acces and refresh tokens
```
GET http://localhost:3000/v1/auth/refresh
```
Check the refresh token, delete the existing one from the data base. Create a new pair of access and refresh tokens.

### For better experience
please, check out requests.rest file. VS Code REST Client extension must be installed