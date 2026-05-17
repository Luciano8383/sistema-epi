<template>
  <div class="login-wrapper">
    <div class="card-container">
      <h2>Entrar no Sistema</h2>
      <p class="subtitle">Insira suas credenciais para acessar o painel de EPIs</p>
      
      <form @submit.prevent="fazerLogin" class="login-form">
        <div class="campo">
          <label for="email">E-mail</label>
          <input 
            type="email" 
            id="email"
            v-model="email" 
            placeholder="exemplo@email.com"
            required 
          /> 
        </div>

        <div class="campo">
          <label for="senha">Senha</label>
          <input 
            type="password" 
            id="senha"
            v-model="senha" 
            placeholder="Digite sua senha"
            required 
          /> 
        </div>
        
        <!-- Alerta de Erro Profissional -->
        <div v-if="erro" class="error-message">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
          </svg>
          <span>{{ erro }}</span>
        </div>

        <button type="submit" class="btn-submit">Entrar</button>
      </form> 
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSupabase } from '../composables/useSupabase'
import { useRouter } from 'vue-router'

const { supabase } = useSupabase()
const router = useRouter()

const email = ref('')
const senha = ref('')
const erro = ref('')

async function fazerLogin() {
  const { error } = await supabase.auth.signInWithPassword({ 
    email: email.value, 
    password: senha.value 
  })
  
  
  if (error) {
    erro.value = 'Credenciais inválidas'
    return
  }

  router.push('/inicio')
}
</script>

<style scoped>
/* Embrulho principal para garantir a centralização total na tela */
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8fafc; /* Cinza bem claro, moderno */
  padding: 20px;
  box-sizing: border-box;
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

/* Container do Cartão de Login */
.card-container {
  width: 100%;
  max-width: 420px;
  background-color: #ffffff;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05), 0 5px 10px rgba(0, 0, 0, 0.03);
  border: 1px solid #e2e8f0;
}

/* Título e Subtítulo */
h2 {
  text-align: center;
  color: #1a252f;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.subtitle {
  text-align: center;
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 2rem;
}

/* Estrutura do Formulário */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  color: #475569;
  font-size: 0.9rem;
  font-weight: 600;
}

input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  color: #334155;
  background-color: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  box-sizing: border-box;
  transition: all 0.2s ease;
}

/* Feedback visual ao focar no input */
input:focus {
  outline: none;
  border-color: #3498db;
  background-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.15);
}

/* Espelhamento de placeholders mais discretos */
input::placeholder {
  color: #94a3b8;
}

/* Caixa de Mensagem de Erro */
.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #fef2f2;
  color: #dc2626;
  border: 1px solid #fee2e2;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
}

.error-message svg {
  flex-shrink: 0;
}

/* Botão de Ação Principal */
.btn-submit {
  width: 100%;
  padding: 0.85rem;
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  background-color: #3498db;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
  margin-top: 0.5rem;
}

.btn-submit:hover {
  background-color: #2980b9;
}

.btn-submit:active {
  transform: scale(0.98);
}
</style>

<script>
export default { name: 'login', }
</script>