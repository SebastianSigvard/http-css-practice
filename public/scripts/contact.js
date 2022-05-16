import Fw from './fetch-wrapper.js'

let API = new Fw('/');
let form    = document.querySelector('#contact-form');
let name    = document.querySelector('#contact-name');
let email   = document.querySelector('#contact-email');
let message = document.querySelector('#contact-message');

form.addEventListener('submit', event => {
    event.preventDefault();
    API.post('send_contactme', {name: name.value, email: email.value, message: message.value} )
    .then( data => {
        if(data.status === 'ok') {
            alert(data.data);
        } else {
            alert(data.error);
        }
    })
    .catch( error => console.error(error) )
});