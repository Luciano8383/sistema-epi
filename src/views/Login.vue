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
/* Embrulho principal com fundo escuro para alto contraste */
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #0f172a; /* Azul escuro profundo (Slate 900) */
  padding: 20px;
  box-sizing: border-box;
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

/* Container do Cartão de Login - Branco puro destacado do fundo */
.card-container {
  width: 100%;
  max-width: 420px;
  background-color: #ffffff;
  padding: 2.5rem;
  border-radius: 12px;
  /* Sombra muito mais marcante e visível */
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
  border: 1px solid #334155;
}

/* Título e Subtítulo */
h2 {
  text-align: center;
  color: #1e293b;
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
  color: #1e293b; /* Texto mais escuro para melhor leitura */
  font-size: 0.9rem;
  font-weight: 600;
}

/* Inputs com bordas mais escuras para evidência */
input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  color: #0f172a;
  background-color: #f8fafc;
  border: 2px solid #cbd5e1; /* Borda mais grossa e visível */
  border-radius: 6px;
  box-sizing: border-box;
  transition: all 0.2s ease;
}

/* Feedback visual ao focar no input */
input:focus {
  outline: none;
  border-color: #3498db;
  background-color: #ffffff;
  box-shadow: 0 0 0 4px rgba(52, 152, 219, 0.25);
}

/* Placeholders ligeiramente mais visíveis */
input::placeholder {
  color: #94a3b8;
}

/* Caixa de Mensagem de Erro com bloco de cor sólida */
.error-message {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #ef4444; /* Vermelho vivo */
  color: #ffffff; /* Texto branco para contraste total */
  padding: 0.85rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: 0 4px 6px rgba(239, 68, 68, 0.2);
}

.error-message svg {
  flex-shrink: 0;
}

/* Botão de Ação Principal em Evidência */
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
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3); /* Sombra colorida no botão */
  transition: all 0.2s ease;
  margin-top: 0.5rem;
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
</style>

<script>
export default { name: 'login', }
</script>