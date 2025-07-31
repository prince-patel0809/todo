function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

const user = getCookie('user');

if (user) {
    document.querySelectorAll('.authHidde')?.forEach(el => el.style.display = 'none');
    document.querySelectorAll('.authVisible')?.forEach(el => el.style.display = 'inline-block');
} else {
    document.querySelectorAll('.authHidde')?.forEach(el => el.style.display = 'inline-block');
    document.querySelectorAll('.authVisible')?.forEach(el => el.style.display = 'none');
}