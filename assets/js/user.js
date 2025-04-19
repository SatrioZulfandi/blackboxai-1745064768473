// User management script

document.addEventListener('DOMContentLoaded', () => {
  const userForm = document.getElementById('userForm');
  const userIdInput = document.getElementById('userId');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const roleInput = document.getElementById('role');
  const userTableBody = document.getElementById('userTableBody');
  const cancelEditBtn = document.getElementById('cancelEdit');

  let users = JSON.parse(localStorage.getItem('users')) || [];

  function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
  }

  function renderUserList() {
    userTableBody.innerHTML = '';
    if (users.length === 0) {
      userTableBody.innerHTML = '<tr><td colspan="3" class="p-4 text-center text-gray-600">Belum ada user.</td></tr>';
      return;
    }
    users.forEach((user) => {
      const tr = document.createElement('tr');

      const usernameTd = document.createElement('td');
      usernameTd.className = 'p-2';
      usernameTd.textContent = user.username;

      const roleTd = document.createElement('td');
      roleTd.className = 'p-2';
      roleTd.textContent = user.role;

      const actionTd = document.createElement('td');
      actionTd.className = 'p-2';

      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.className = 'bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded mr-2';
      editBtn.addEventListener('click', () => {
        userIdInput.value = user.id;
        usernameInput.value = user.username;
        passwordInput.value = user.password;
        roleInput.value = user.role;
        cancelEditBtn.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Hapus';
      deleteBtn.className = 'bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded';
      deleteBtn.addEventListener('click', () => {
        if (confirm(`Hapus user "${user.username}"?`)) {
          users = users.filter((u) => u.id !== user.id);
          saveUsers();
          renderUserList();
        }
      });

      actionTd.appendChild(editBtn);
      actionTd.appendChild(deleteBtn);

      tr.appendChild(usernameTd);
      tr.appendChild(roleTd);
      tr.appendChild(actionTd);

      userTableBody.appendChild(tr);
    });
  }

  userForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = userIdInput.value;
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const role = roleInput.value;

    if (!username || !password || !role) {
      alert('Semua field harus diisi.');
      return;
    }

    if (id) {
      // Edit existing user
      const index = users.findIndex((u) => u.id === id);
      if (index !== -1) {
        users[index] = { id, username, password, role };
      }
    } else {
      // Add new user
      const newUser = {
        id: Date.now().toString(),
        username,
        password,
        role,
      };
      users.push(newUser);
    }

    saveUsers();
    renderUserList();
    userForm.reset();
    userIdInput.value = '';
    cancelEditBtn.classList.add('hidden');
  });

  cancelEditBtn.addEventListener('click', () => {
    userForm.reset();
    userIdInput.value = '';
    cancelEditBtn.classList.add('hidden');
  });

  renderUserList();
});
