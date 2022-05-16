import Fw from './fetch-wrapper.js'

let API = new Fw('/');

if( ! localStorage.getItem('token') ) {
    window.location.href = 'login.html';
}

let log_out_button = document.querySelector('#log-out');

log_out_button.addEventListener('click', event => { 
    localStorage.removeItem('token');
    location.reload();
});