const url = 'http://localhost:8080/api/auth/register';

async function sendRegisterData() {
    const email = document.forms['registerForm']['email'].value;
    const password = document.forms['registerForm']['password'].value;
    const select = document.forms['registerForm']['roles'];
    const role = select.options[select.selectedIndex].value;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'email': email,
                'password': password,
                'role': role
            })
        });
        const result = await response.json();
        alert(result.message);
        if(result.message.includes('successfully')) {
            window.location.replace('../index.html');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}