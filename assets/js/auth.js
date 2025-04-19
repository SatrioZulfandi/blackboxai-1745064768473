// Simple role-based login simulation
// Users: admin/admin, kasir/kasir, pelanggan/pelanggan

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const errorMsg = document.getElementById('errorMsg');

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    errorMsg.classList.add('hidden');
    const username = loginForm.username.value.trim();
    const password = loginForm.password.value.trim();

    // Simple hardcoded user validation
    if (
      (username === 'admin' && password === 'admin') ||
      (username === 'kasir' && password === 'kasir') ||
      (username === 'pelanggan' && password === 'pelanggan')
    ) {
      // Save user role in sessionStorage
      sessionStorage.setItem('userRole', username);
      // Redirect based on role
      if (username === 'admin') {
        window.location.href = 'admin.html';
      } else if (username === 'kasir') {
        window.location.href = 'kasir.html';
      } else {
        window.location.href = 'pelanggan.html';
      }
    } else {
      errorMsg.textContent = 'Invalid username or password.';
      errorMsg.classList.remove('hidden');
    }
  });
});
