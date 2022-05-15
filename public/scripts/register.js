import Fw from './fetch-wrapper.js'

let API = new Fw('/');
let form = document.querySelector('#registration-form');
let userName =  document.querySelector('#user-name-reg');
let password =  document.querySelector('#password-reg');

form.addEventListener('submit', event => {
    event.preventDefault();
    API.post('register', {userName: userName.value, password: password.value} )
    .then( data => console.log(data) )
    .catch( error => console.error(error) )
});