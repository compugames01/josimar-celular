document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const usernameInput = document.getElementById('username').value.trim();
        const passwordInput = document.getElementById('password').value.trim();
        const roleInput = document.getElementById('role').value;

        // Obtener usuarios de localStorage
        const users = JSON.parse(localStorage.getItem('luxury_users')) || [
            { name: 'carlos', pass: 'Compugames1@', role: 'Administrador' }
        ];

        // Buscar coincidencia de credenciales Y rol
        const user = users.find(u =>
            u.name === usernameInput &&
            u.pass === passwordInput &&
            u.role === roleInput
        );

        if (user) {
            errorMessage.classList.add('hidden');
            // Guardar sesion y rol
            sessionStorage.setItem('inventario_auth', 'true');
            sessionStorage.setItem('user_role', user.role);
            sessionStorage.setItem('user_name', user.name);
            // Redirigir al dashboard
            window.location.href = 'dashboard.html';
        } else {
            // Mostrar error
            errorMessage.classList.remove('hidden');
        }
    });
});
