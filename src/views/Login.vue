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
/* ==========================================
   1. CONTAINER E RESET (MOBILE-FIRST)
   ========================================== */
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #0f172a; /* Azul escuro profundo (Slate 900) */
  padding: 1rem; /* Reduzido no mobile para dar mais área útil */
  box-sizing: border-box;
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

/* Container do Cartão de Login - Adaptável */
.card-container {
  width: 100%;
  max-width: 420px;
  background-color: #ffffff;
  padding: 1.5rem; /* Mais compacto no mobile para não esmagar os campos */
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
  border: 1px solid #334155;
  box-sizing: border-box;
}

/* ==========================================
   2. ELEMENTOS DE TEXTO E FORMULÁRIO
   ========================================== */
h2 {
  text-align: center;
  color: #1e293b;
  font-size: 1.6rem; /* Ligeiramente menor no mobile */
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.subtitle {
  text-align: center;
  color: #64748b;
  font-size: 0.85rem;
  margin-bottom: 1.5rem; /* Menor espaço para evitar rolagens desnecessárias */
}

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
  color: #1e293b;
  font-size: 0.85rem;
  font-weight: 600;
}

/* Inputs fluídos e confortáveis para o toque */
input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  color: #0f172a;
  background-color: #f8fafc;
  border: 2px solid #cbd5e1;
  border-radius: 6px;
  box-sizing: border-box;
  transition: all 0.2s ease;
}

input:focus {
  outline: none;
  border-color: #3498db;
  background-color: #ffffff;
  box-shadow: 0 0 0 4px rgba(52, 152, 219, 0.25);
}

input::placeholder {
  color: #94a3b8;
}

/* Caixa de Mensagem de Erro */
.error-message {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #ef4444;
  color: #ffffff;
  padding: 0.85rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: 0 4px 6px rgba(239, 68, 68, 0.2);
  line-height: 1.4;
}

.error-message svg {
  flex-shrink: 0;
}

/* Botão de Envio */
.btn-submit {
  width: 100%;
  padding: 0.9rem;
  font-size: 1rem;
  font-weight: 700;
  color: #ffffff;
  background-color: #3498db;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
  transition: all 0.2s ease;
  margin-top: 0.25rem;
  text-align: center;
  box-sizing: border-box;
}

.btn-submit:hover {
  background-color: #2980b9;
  box-shadow: 0 6px 16px rgba(41, 128, 185, 0.4);
  transform: translateY(-1px);
}

.btn-submit:active {
  transform: translateY(1px);
  box-shadow: 0 2px 4px rgba(41, 128, 185, 0.2);
}


/* ==========================================
   3. MEDIA QUERIES (TELAS INTERMEDIÁRIAS E MAIORES)
   ========================================== */

/* A partir de telas pequenas/médias (Ex: Tablets ou Celulares deitados) */
@media (min-width: 480px) {
  .login-wrapper {
    padding: 20px; /* Restaura o respiro original */
  }

  .card-container {
    padding: 2.5rem; /* Devolve o espaçamento interno elegante */
  }

  h2 {
    font-size: 1.8rem; /* Restaura o tamanho original do título */
  }

  .subtitle {
    font-size: 0.9rem;
    margin-bottom: 2rem;
  }
}
</style>

<script>
export default { name: 'login', }
</script>