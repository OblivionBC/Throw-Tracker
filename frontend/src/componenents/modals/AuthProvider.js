// Function that takes props, and makes a state for access token.
// fetches token from the backend on load, if there is an error or no response set access token to nulll

//Layout effect to intercept requests, and inject the access token
//Called whenevever token changes
//Use layout effect ensures authentication is done before any other request

//In api make file to wrap every request that needs to be authenicatied
//Check if there is a token, try to verify it
//Can use jose library to verify jwt
//If not verified return error 403 forbiden, else call request

//In the interceptor if an error is 403 and message is what we set it to
// check the refrensh token, if we have token, set access token
//if there was token, add token to header of the original request and retry it
