<template>
    <header class="cabecalho">
        <h1>Home</h1>
    </header>
<div class="shell">

   <!-- ── SIDEBAR: menu lateral fixo ── -->
   <aside class="sidebar">

      <nav>
        <RouterLink to="/cadastrar_funcionario"> Cadastrar Funcionário</RouterLink>
        <RouterLink to="/cadastro"> Cadastro de EPI</RouterLink>
        <RouterLink to="/entrega_epi"> Entregas de EPI</RouterLink> 
        <RouterLink to="/estoque"> Estoque</RouterLink> 
        
        
          <RouterLink to="/" class="sair" @click="sair">Sair</RouterLink>

      </nav>
    </aside>

   <!-- ── CONTEÚDO: cada rota filho carrega aqui ── -->
   <main> <RouterView /> </main>
</div>
</template>

<style scoped>


.cabecalho {
  display: flex;
  justify-content: space-between; /* Espaça os itens para as extremidades */
  align-items: center; /* Alinha os itens verticalmente */
  padding: 10px; /* Espaçamento interno do cabeçalho */
  background-color: #007BFF; /* Cor de fundo do cabeçalho */
}

.shell {
  display: flex;
  height: 100vh; 
  width: 100vw;  
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.sidebar {
  width: 220px; 
  background-color: #1e1e24; 
  color: white; 
  padding: 25px 15px; 
  
  /* Garante que o conteúdo da sidebar ocupe toda a altura */
  display: flex;
  flex-direction: column;
}

.sidebar nav {
  display: flex;
  flex-direction: column; 
  gap: 8px; 
  
  /* O segredo: o nav vai esticar e ocupar todo o espaço vertical disponível */
  flex: 1; 
}

.sidebar nav a {
  color: #e0e0e0; 
  text-decoration: none; 
  padding: 12px 15px; 
  border-radius: 6px; 
  transition: all 0.2s ease; 
  font-size: 0.95rem;
}

.sidebar nav a:hover {
  background-color: #333; 
  color: #ffffff;
}

/* ── BOTÃO DE SAIR NO RODAPÉ ── */
.sidebar .sair {
  /* Empurra o botão lá para o final da tela */
  margin-top: auto; 
  
  background-color: #dc3545; 
  color: white;
  border: none;
  padding: 12px 15px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
  display:flex;
  justify-content:center;
}

.sidebar .sair:hover {
  background-color: #bd2130;
}

main {
  flex: 1; 
  padding: 30px; 
  background-color: #f8f9fa; 
}

</style>


<script>

import { RouterLink } from 'vue-router'

export default {name: 'inicio',}
</script>