import { checkAuth } from './modules/auth.js';
import { Toast } from './modules/toast.js';

document.addEventListener("DOMContentLoaded", () => {

  // if (localStorage.getItem("logged") === "true") {
  //   window.location.href = "./page0.html";
  //   return;
  // }
  const userEl = document.getElementById('user');
  const passwordEl = document.getElementById('password');
  //const rememberEl = document.getElementById('rememberPass');
  const form = document.querySelector('.container-login');
  const btnRegister = document.getElementById('register-btn');

  
  btnRegister.addEventListener("click", (e) => {
    e.preventDefault();

    window.location.href = "./register.html";
  });

  //saved user
  // const savedUser = localStorage.getItem("saved_user");
  // const savedPass = localStorage.getItem("saved_password");

  // if (savedUser && userEl) userEl.value = savedUser;
  // if (savedPass && passwordEl) passwordEl.value = savedPass;

  // if (savedUser && savedPass && rememberEl) rememberEl.checked = true;

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    console.log("FORM ENVIADO");

    const username = userEl.value.trim();
    const password = passwordEl.value;

    console.log("Usuário:", username);

    if (!username || !password) {
      Toast.error("Por favor, preencha todos os campos.");
      return;
    }

    try {
      console.log("📡 Enviando para /api/login...");

      const response = await fetch('/api/login', {

        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          username,
          password
        })
      });

      console.log("Resposta recebida:", response.status);

      const data = await response.json();

      console.log("Dados recebidos:", data);

      if(!response.ok) {
        Toast.error(data.message || "Usuário ou senha incorretos.");
        return;
      }

      console.log("Login autorizado!");
      const sessionData = {
        id: data.user.id,
        username: data.user.username,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        loginTime: new Date().toISOString()
      };

      localStorage.setItem(
        "loggedSession",
        JSON.stringify(sessionData)
      );

      localStorage.setItem("logged", "true");

      Toast.success("Login realizado com sucesso! Redirecionando...");

      setTimeout(() => {
        window.location.href = "./page0.html";
      }, 1000);


    } catch (error) {
      console.error("ERRO:", error);
      Toast.error("Não foi possível conectar ao servidor. Por favor, tente novamente mais tarde.");
    }
  });
  // form?.addEventListener('submit', async (e) => {
  //   e.preventDefault();


  //   const username = userEl.value.trim();
  //   const password = passwordEl.value.trim();

  //   if (!username || !password) {
  //     Toast.error("Por favor, preencha todos os campos.");
  //     return;
  //   }

  //   try {
  //     const response = await fetch('/api/login', {
  //       method: 'POST',

  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({ username, password })
  //     });

  //     const data = await response.json();

  //     if (!response.ok) {
  //       Toast.error(data.message || "Usuário ou senha incorretos.");
  //       return;
  //     }

  //     if (rememberEl?.checked) {
  //       localStorage.setItem("saved_user", username);
  //       localStorage.setItem("saved_password", password);
  //     } else {
  //       localStorage.removeItem("saved_user");
  //       localStorage.removeItem("saved_password");
  //     }

  //     //local session

  //     const sessionData = {
  //       id: data.user.id,
  //       username: data.user.username,
  //       name: data.user.nome,
  //       email: data.user.email,
  //       role: data.user.role,
  //       loginTime: new Date().toISOString()
  //     };

  //     localStorage.setItem("loggedSession", JSON.stringify(sessionData));

  //     localStorage.setItem("logged", "true");

  //     Toast.success("Login realizado com sucesso! Redirecionando...");

  //     setTimeout(() => {
  //       window.location.href = "./page0.html";
  //     }, 1000);

  //   } catch (error) {
  //     console.error("Erro ao fazer login:", error);
  //     Toast.error("Não foi possível conectar ao servidor. Por favor, tente novamente mais tarde.");
  //   }
  // });


  userEl?.addEventListener('input', () => {
    userEl.style.borderColor = userEl.value.trim() ? '#0f7d3a' : '#ccc';
  });

  passwordEl?.addEventListener('input', () => {
    passwordEl.style.borderColor = passwordEl.value.trim() ? '#0f7d3a' : '#ccc';
  });

});
