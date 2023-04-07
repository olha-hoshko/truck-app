const url = 'http://localhost:8080/api/auth/login';
const profileUrl = 'http://localhost:8080/api/users/me';
const forgotPassUrl = 'http://localhost:8080/api/auth/forgot_password';

async function redirection(jwt) {
    sessionStorage.setItem('jwt_token', jwt);
    const res = await fetch(profileUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('jwt_token')}`
        }
    });
    const profileData = await res.json();
    if (profileData.user.role === 'DRIVER') {
        window.location.replace('./pages/appDriver.html');
    } else if (profileData.user.role === 'SHIPPER') {
        window.location.replace('./pages/appShipper.html');
    }
}

async function sendLoginData() {
    const email = document.forms['loginForm']['email'].value;
    const password = document.forms['loginForm']['password'].value;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'email': email,
                'password': password
            })
        });
        const result = await response.json();
        if (result.message) {
            alert(result.message);
        }
        if (result.jwt_token) {
            redirection(result.jwt_token);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function sendEmail(event) {
    event.preventDefault();
    let email = prompt('Enter your email:', '');
    if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        alert('Email is not correct');
    } else {
        fetch(forgotPassUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'email': email
            })
        })
            .then((response) => response.json())
            .then((result) => alert(result.message))
            .catch((err) => alert(err));
    }
}

const forgotPass = document.querySelector('.forgot_password');
forgotPass.addEventListener('click', sendEmail);