import Fw from './fetch-wrapper.js'

let API = new Fw('/');
let form = document.querySelector('#login-form');
let userName =  document.querySelector('#user-name');
let password =  document.querySelector('#password');

form.addEventListener('submit', event => {
    event.preventDefault();
    API.post('login', {userName: userName.value, password: password.value} )
    .then( data => console.log(data) )
    .catch( error => console.error(error) )
});