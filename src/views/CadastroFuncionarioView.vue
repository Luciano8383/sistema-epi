<template>
<main class="pagina">
<section class="card">
<h1>Cadastro de Funcionário</h1>
<form @submit.prevent="cadastrarFuncionario">
<label for="nome">Nome do funcionário</label>
<!--v-model liga o input à variável nome-->
<input
id="nome"
v-model="nome"
type="text"
placeholder="Digite o nome"
/>
<!--Só aparece se existir mensagem de erro-->
<p v-if="erro" class="erro">{{ erro }}</p>
<button type="submit">Cadastrar</button>
</form>
</section>
</main>
</template>

<script setup>
// ref cria variáveis reativas no Vue 3
import { ref } from 'vue'
// Guarda o nome digitado no formulário
const nome = ref('')
// Guarda a mensagem de erro
const erro = ref('')
function cadastrarFuncionario() {
erro.value= '' // Limpa erros anteriores
if (nome.value.trim() === '') {
erro.value = 'O nome do funcionário é obrigatório.'
return
}
}
</script>

<style scoped>
/* ==========================================
   1. ESTRUTURA BASE DA PÁGINA (MOBILE-FIRST)
   ========================================== */
.pagina {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8fafc;
  padding: 1rem; /* Margem de segurança para telas pequenas */
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  box-sizing: border-box;
}

/* Estilização do Card de Cadastro */
.card {
  background-color: #ffffff;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  padding: 1.5rem;
  width: 100%;
  max-width: 450px; /* Impede o card de ficar gigante no computador */
  box-sizing: border-box;
}

.card h1 {
  color: #1a252f;
  font-size: 1.35rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  text-align: center;
}

/* ==========================================
   2. FORMULÁRIO E COMPONENTES
   ========================================== */
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
}

input {
  width: 100%;
  padding: 0.75rem 0.85rem; /* Área de clique maior para telas touch */
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.95rem;
  color: #334155;
  background-color: #ffffff;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.15);
}

input::placeholder {
  color: #94a3b8;
}

/* Mensagem de Erro */
.erro {
  color: #dc2626;
  font-size: 0.85rem;
  margin: -0.5rem 0 0.5rem 0;
  font-weight: 500;
}

/* Botão de Envio */
button {
  width: 100%;
  padding: 0.75rem;
  background-color: #3498db;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: #2980b9;
}

button:active {
  background-color: #216894;
}

/* ==========================================
   3. ADAPTAÇÕES PARA TELAS MAIORES (MEDIA QUERY)
   ========================================== */
@media (min-width: 480px) {
  .card {
    padding: 2rem; /* Mais espaçamento interno em tablets e PCs */
  }

  .card h1 {
    font-size: 1.5rem;
  }
}
</style>