<template>
  <div class="app-layout">
    <!-- Cabeçalho Superior -->
    <header class="cabecalho">
      <div class="logo-area">
        <span class="empresa-nome">Sistema de EPI</span>
      </div>
      <div class="user-area">
        <h1>Painel Administrativo</h1>
      </div>
    </header>

    <div class="shell">
      <!-- SIDEBAR: Menu Lateral -->
      <aside class="sidebar">
        <nav>
          <RouterLink to="/cadastrar_funcionario" class="nav-link">
            <span>Cadastrar Funcionário</span>
          </RouterLink>
          
          <RouterLink to="/cadastro" class="nav-link">
            <span>Cadastro de EPI</span>
          </RouterLink>
          
          <RouterLink to="/entrega_epi" class="nav-link">
            <span>Entregas de EPI</span>
          </RouterLink>
          
          <RouterLink to="/estoque" class="nav-link">
            <span>Estoque</span>
          </RouterLink> 
          
          <!-- Botão Sair recuado ao final -->
          <RouterLink to="/" class="sair" @click="sair">
            <span>Sair do Sistema</span>
          </RouterLink>
        </nav>
      </aside>

      <!-- CONTEÚDO PRINCIPAL: Onde as telas mudam -->
      <main class="main-content">
        <div class="content-card">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Estrutura principal para evitar rolagens quebradas na tela */
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

/* ── CABEÇALHO SUPERIOR ── */
.cabecalho {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 2rem;
  background-color: #1a252f; /* Cor escura profissional idêntica ao Header principal */
  color: #ffffff;
  border-bottom: 1px solid #2c3e50;
  height: 60px;
}

.empresa-nome {
  font-size: 1.2rem;
  font-weight: 700;
  color: #3498db; /* Destaque em azul claro */
  letter-spacing: 0.5px;
}

.cabecalho h1 {
  font-size: 1rem;
  font-weight: 400;
  color: #94a3b8;
  margin: 0;
}

/* ── CORPO DO DASHBOARD (Sidebar + Conteúdo) ── */
.shell {
  display: flex;
  flex: 1; /* Ocupa todo o resto da altura da tela abaixo do header */
  overflow: hidden;
}

/* Menu Lateral */
.sidebar {
  width: 240px; 
  background-color: #111827; /* Fundo escuro profundo (combina com o footer anterior) */
  padding: 1.5rem 1rem; 
  display: flex;
  flex-direction: column;
}

.sidebar nav {
  display: flex;
  flex-direction: column; 
  gap: 6px; 
  flex: 1; 
}

/* Links da Navegação */
.nav-link {
  color: #9ca3af; 
  text-decoration: none; 
  padding: 0.85rem 1rem; 
  border-radius: 6px; 
  transition: all 0.2s ease; 
  font-size: 0.95rem;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.nav-link:hover {
  background-color: #1f2937; 
  color: #3498db;
  padding-left: 1.25rem; /* Efeito sutil de deslocamento */
}

/* Estilo para quando a rota do VueRouter estiver ativa (opcional, mas altamente recomendado) */
.router-link-active:not(.sair) {
  background-color: #1e293b;
  color: #ffffff;
  border-left: 4px solid #3498db;
  border-radius: 0 6px 6px 0;
}

/* ── BOTÃO DE SAIR NO RODAPÉ DA SIDEBAR ── */
.sidebar .sair {
  margin-top: auto; /* Empurra o botão para o final */
  background-color: rgba(220, 53, 69, 0.1); /* Fundo vermelho translúcido elegante */
  color: #ef4444;
  text-decoration: none;
  padding: 0.85rem 1rem;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.2s ease;
  display: flex;
  justify-content: center;
  border: 1px solid rgba(220, 53, 69, 0.2);
}

.sidebar .sair:hover {
  background-color: #dc3545;
  color: #ffffff;
  border-color: #dc3545;
}

/* ── ÁREA DE CONTEÚDO PRINCIPAL ── */
.main-content {
  flex: 1; 
  padding: 2rem; 
  background-color: #f8fafc; /* Cinza claro moderno de fundo */
  overflow-y: auto; /* Permite rolar apenas o conteúdo se a tabela/formulário for grande */
}

/* Card interno que envelopa as páginas filhas */
.content-card {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03);
  border: 1px solid #e2e8f0;
  min-height: 100%;
}
</style>


<script>

import { RouterLink } from 'vue-router'

export default {name: 'inicio',}
</script>