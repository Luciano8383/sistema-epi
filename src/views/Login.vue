<template>
<div class="container">
  <h2>Login</h2>
    
     <form @submit.prevent="fazerLogin">

       <div class="campo">
          <label>E-mail</label>
            <input type="email" v-model="email" required /> 
       </div>

        <div class="campo">
              <label>Senha</label>
                <input type="password" v-model="senha" required /> 
        </div>
                    <!-- v-if: só aparece quando houver mensagem de erro -->
                  <p v-if="erro">{{ erro }}</p>

                     <button type="submit">Entrar</button>
      </form> 
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

<style>
body {
  justify-content: center;
   min-height: 100vh;       /* Faz o body ter no mínimo a altura da tela toda */
  background-color: #f5f5f5; /* Uma corzinha de fundo opcional só para dar destaque */
}

.container {
  width: 100%;
  max-width: 400px;
  margin: auto;
  padding: 80px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
h2 {
  text-align: center;
  margin-bottom: 20px;
}
.campo {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
}
input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
button {
  width: 100%;
  padding: 10px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}

</style>

<script>
export default { name: 'login', }
</script>