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
/* ==========================================
   1. CONFIGURAÇÕES GERAIS E RESET INTERNO
   ========================================== */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

/* Base Mobile-First: Permite rolagem natural no celular */
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background-color: #f8fafc;
}

/* ── CABEÇALHO SUPERIOR (Mobile) ── */
.cabecalho {
  display: flex;
  flex-direction: column; /* Empilha informações em telas muito pequenas */
  justify-content: center;
  align-items: center;
  gap: 4px;
  padding: 0.75rem 1rem;
  background-color: #1a252f;
  color: #ffffff;
  border-bottom: 1px solid #2c3e50;
  text-align: center;
}

.empresa-nome {
  font-size: 1.1rem;
  font-weight: 700;
  color: #3498db;
  letter-spacing: 0.5px;
}

.cabecalho h1 {
  font-size: 0.85rem;
  font-weight: 400;
  color: #94a3b8;
  margin: 0;
}

/* ── CORPO DO DASHBOARD (Mobile) ── */
.shell {
  display: flex;
  flex-direction: column; /* No celular, a sidebar fica em cima do conteúdo */
  flex: 1;
}

/* Menu Lateral adaptado para barra horizontal ou bloco no Mobile */
.sidebar {
  width: 100%; 
  background-color: #111827;
  padding: 1rem; 
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar nav {
  display: flex;
  flex-direction: row; /* Links lado a lado no celular */
  flex-wrap: wrap; /* Se não couber, quebra linha suavemente */
  justify-content: center;
  gap: 8px; 
}

/* Links da Navegação */
.nav-link {
  color: #9ca3af; 
  text-decoration: none; 
  padding: 0.6rem 0.8rem; 
  border-radius: 6px; 
  transition: all 0.2s ease; 
  font-size: 0.85rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  background-color: #1f2937; /* Leve destaque nos botões no mobile */
}

.nav-link:hover {
  background-color: #2d3748; 
  color: #3498db;
}

/* Rota Ativa do VueRouter */
.router-link-active:not(.sair) {
  background-color: #1e293b;
  color: #ffffff;
  border-bottom: 3px solid #3498db; /* Linha inferior no mobile */
  border-radius: 6px 6px 0 0;
}

/* Botão Sair adaptado para o fluxo do Mobile */
.sidebar .sair {
  background-color: rgba(220, 53, 69, 0.1);
  color: #ef4444;
  text-decoration: none;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid rgba(220, 53, 69, 0.2);
  width: 100%;
  max-width: 200px; /* Não deixa o botão de sair gigante */
  margin: 0 auto; /* Centraliza horizontalmente */
}

.sidebar .sair:hover {
  background-color: #dc3545;
  color: #ffffff;
  border-color: #dc3545;
}

/* ── ÁREA DE CONTEÚDO PRINCIPAL (Mobile) ── */
.main-content {
  flex: 1; 
  padding: 1rem; /* Padding reduzido para telas menores */
  background-color: #f8fafc;
}

/* Card interno */
.content-card {
  background-color: #ffffff;
  padding: 1.25rem; /* Menor espaço interno no celular */
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  min-height: 100%;
}


/* ==========================================
   2. MEDIA QUERIES (DESKTOP / PRO DESGN FIXO)
   ========================================== */

/* Ativa o comportamento clássico de sistema a partir de telas Desktop (992px) */
@media (min-width: 992px) {
  .app-layout {
    flex-direction: column;
    height: 100vh; /* Força altura fixa da janela */
    width: 100vw; /* Força largura fixa da janela */
    overflow: hidden; /* Remove rolagem da página inteira */
  }

  /* Cabeçalho Superior Alinhado */
  .cabecalho {
    flex-direction: row;
    justify-content: space-between;
    padding: 0.75rem 2rem;
    height: 60px;
  }

  .empresa-nome {
    font-size: 1.2rem;
  }

  .cabecalho h1 {
    font-size: 1rem;
  }

  /* Restaura a estrutura de colunas do Dashboard */
  .shell {
    flex-direction: row;
    flex: 1;
    overflow: hidden;
  }

  /* Menu Lateral Clássico */
  .sidebar {
    width: 240px; 
    padding: 1.5rem 1rem; 
    gap: 0;
  }

  .sidebar nav {
    flex-direction: column; /* Links empilhados na vertical */
    justify-content: flex-start;
    gap: 6px; 
    flex: 1; 
  }

  .nav-link {
    font-size: 0.95rem;
    padding: 0.85rem 1rem; 
    background-color: transparent; /* Remove o fundo do bloco mobile */
    width: 100%;
  }

  .nav-link:hover {
    background-color: #1f2937; 
    padding-left: 1.25rem; /* Efeito de empurrãozinho */
  }

  /* Rota Ativa com borda na esquerda */
  .router-link-active:not(.sair) {
    background-color: #1e293b;
    border-bottom: none;
    border-left: 4px solid #3498db;
    border-radius: 0 6px 6px 0;
  }

  /* Botão Sair empurrado para o rodapé da Sidebar */
  .sidebar .sair {
    margin-top: auto; /* Empurra de volta para o fim do bloco */
    font-size: 0.95rem;
    padding: 0.85rem 1rem;
    max-width: none;
    width: 100%;
  }

  /* Área de Conteúdo Isolada com scroll independente */
  .main-content {
    padding: 2rem; 
    overflow-y: auto; /* Apenas esta área ganha scroll se o conteúdo crescer */
  }

  .content-card {
    padding: 2rem;
  }
}
</style>


<script>

import { RouterLink } from 'vue-router'

export default {name: 'inicio',}
</script>