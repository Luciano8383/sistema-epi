<template>
  <div class="layout-container">
    
    <!-- Cabeçalho da Página -->
    <header class="header-section">
      <div class="header-titles">
        <h1>Cadastro de EPIs</h1>
        <p>Gerencie o catálogo de Equipamentos de Proteção Individual e o controle de Certificados de Aprovação (C.A.).</p>
      </div>
    </header>

    <main class="content">
      <!-- Formulário de Cadastro (Card) -->
      <section class="card-form">
        <div class="card-header">
          <h3>{{ editandoId ? 'Editar Equipamento' : 'Novo Equipamento' }}</h3>
        </div>
        
        <form @submit.prevent="salvar" class="main-form">
          <!-- Linha 1 do Formulário -->
          <div class="form-row">
            <div class="form-group">
              <label for="nome_epi">Nome do EPI</label>
              <input v-model="form.nome" type="text" id="nome_epi" placeholder="Ex: Capacete de Segurança" required>
            </div>
            <div class="form-group">
              <label for="numero_ca">Número do C.A.</label>
              <input v-model="form.numero_ca" type="text" id="numero_ca" placeholder="Ex: 12345" required>
            </div>
          </div>

          <!-- Linha 2 do Formulário -->
          <div class="form-row">
            <div class="form-group">
              <label for="quantidade">Quantidade em Estoque</label>
              <input v-model="form.quantidade" type="number" id="quantidade" placeholder="Ex: 10" min="0">
            </div>
            <div class="form-group">
              <label for="validade">Data de Validade (C.A.)</label>
              <input v-model="form.dt_validade" type="date" id="validade" required>
            </div>
          </div>
          
          <!-- Barra de Botões -->
          <div class="action-bar">
            <button type="submit" class="btn btn-primary">
              {{ editandoId ? 'Salvar Alterações' : 'Cadastrar EPI' }}
            </button>
            <button v-if="editandoId" type="button" @click="cancelarEdicao" class="btn btn-outline">
              Cancelar
            </button>
          </div>
        </form>
      </section>

      <!-- Lista de Equipamentos (Card Tabela) -->
      <section class="card-table">
        <div class="table-responsive">
          <table class="styled-table">
            <thead>
              <tr>
                <th>Equipamento</th>
                <th class="text-center">C.A.</th>
                <th class="text-center">Quantidade</th>
                <th>Validade</th>
                <th class="text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="e in cadastro_epi" :key="e.id_epi">
                <td>
                  <span class="text-bold">{{ e.nome }}</span>
                </td>
                <td class="text-center">
                  <span class="badge-ca">{{ e.numero_ca }}</span>
                </td>
                <td class="text-center text-medium">{{ e.quantidade }} un.</td>
                <td class="text-muted">{{ e.dt_validade }}</td>
                <td class="text-center">
                  <div class="actions-wrapper">
                    <button @click="prepararEdicao(e)" class="btn-action edit" title="Editar EPI">Editar</button>
                    <button @click="excluir(e.id_epi)" class="btn-action delete" title="Excluir EPI">Excluir</button>
                  </div>
                </td>
              </tr>
              <!-- Estado Vazio -->
              <tr v-if="!cadastro_epi || cadastro_epi.length === 0">
                <td colspan="5" class="text-center text-muted empty-state">
                  Nenhum equipamento catalogado no sistema.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
</template>


<script setup>
import { ref, reactive, onMounted } from 'vue';
// No seu Cadastro.vue (Linha 78)
import { useSupabase } from '../composables/useSupabase';

const { supabase } = useSupabase();

const cadastro_epi = ref([]);
const editandoId = ref(null);
const form = reactive({ nome: '', numero_ca: '', quantidade: '', dt_validade: '' });

// Busca os EPIs no banco
const carregar = async () => {
  const { data } = await supabase.from('cadastro_epi').select('*').order('nome');
  cadastro_epi.value = data || [];
};

// Salva ou Atualiza
const salvar = async () => {
  if (editandoId.value) {
    await supabase.from('cadastro_epi').update(form).eq('id_epi', editandoId.value);
  } else {
    await supabase.from('cadastro_epi').insert([form]);
  }
  cancelarEdicao();
  carregar();
};

const prepararEdicao = (e) => {
  editandoId.value = e.id_epi;
  Object.assign(form, { nome: e.nome, numero_ca: e.numero_ca, quantidade: e.quantidade, dt_validade: e.dt_validade });
};

const excluir = async (id) => {
  if (confirm('Deseja excluir este equipamento?')) {
    await supabase.from('cadastro_epi').delete().eq('id_epi', id);
    carregar();
  }
};

const cancelarEdicao = () => {
  editandoId.value = null;
  Object.assign(form, { nome: '', numero_ca: '', quantidade: '', dt_validade: '' });
};

onMounted(carregar);
</script>


<style scoped>
/* ==========================================
   1. ESTRUTURA BASE E CONTAINERS (MOBILE)
   ========================================== */
.layout-container {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 1rem; /* Padding menor em telas pequenas */
  background-color: #f8fafc;
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  box-sizing: border-box;
}

/* Cabeçalho superior */
.header-section {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.header-section h1 {
  color: #1a252f;
  font-size: 1.5rem; /* Fonte ligeiramente menor no celular */
  font-weight: 700;
  margin: 0 0 0.35rem 0;
}

.header-section p {
  color: #64748b;
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.4;
}

/* Estrutura de Cards */
.card-form, .card-table {
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.card-header {
  background-color: #f8fafc;
  padding: 1rem; /* Mais compacto no mobile */
  border-bottom: 1px solid #e2e8f0;
}

.card-header h3 {
  margin: 0;
  font-size: 1.05rem;
  color: #1a252f;
  font-weight: 600;
}

.main-form {
  padding: 1rem; /* Reduzido para não espremer inputs */
}

/* ==========================================
   2. FORMULÁRIO E INPUTS (PADRÃO UMA COLUNA)
   ========================================== */
.form-row {
  display: grid;
  grid-template-columns: 1fr; /* Força uma coluna no mobile */
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
}

input {
  padding: 0.65rem 0.85rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.95rem;
  color: #334155;
  background-color: #ffffff;
  transition: all 0.2s ease;
  width: 100%;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.15);
}

input::placeholder {
  color: #94a3b8;
  font-size: 0.9rem;
}

/* Botões do Formulário (Empilhados no mobile) */
.action-bar {
  display: flex;
  flex-direction: column; /* Um botão abaixo do outro no mobile */
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.btn {
  width: 100%; /* Botão largo para facilitar o clique touch */
  padding: 0.75rem 1.5rem; 
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.btn-primary {
  background: #3498db;
  color: white;
  border: none;
}

.btn-primary:hover {
  background: #2980b9;
}

.btn-outline {
  background: white;
  color: #64748b;
  border: 1px solid #cbd5e1;
}

.btn-outline:hover {
  background: #f8fafc;
  color: #334155;
  border-color: #94a3b8;
}

/* ==========================================
   3. TABELA PROFISSIONAL COM SCROLL SEGURO
   ========================================== */
.table-responsive {
  width: 100%;
  overflow-x: auto; /* Cria rolagem lateral apenas na tabela se faltar espaço */
  -webkit-overflow-scrolling: touch; /* Rolagem lisa no iOS */
}

.styled-table {
  width: 100%;
  min-width: 800px; /* Impede os dados de se esmagarem em telas pequenas */
  border-collapse: collapse;
  text-align: left;
}

.styled-table th {
  background-color: #f8fafc;
  padding: 0.85rem 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #e2e8f0;
}

.styled-table td {
  padding: 0.85rem 1rem;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.9rem;
  color: #334155;
  vertical-align: middle;
}

.styled-table tbody tr:hover {
  background-color: #f8fafc;
}

/* Classes Utilitárias de Texto */
.text-bold {
  font-weight: 600;
  color: #1a252f;
}

.text-medium {
  font-weight: 500;
  color: #334155;
}

.text-muted {
  color: #64748b;
}

/* Badge Neutro e Elegante para o C.A. */
.badge-ca {
  display: inline-block;
  background: #e0f2fe;
  color: #0369a1;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
}

/* Botões de Ação Dinâmicos */
.actions-wrapper {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.btn-action {
  padding: 6px 12px;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.btn-action.edit {
  background-color: rgba(52, 152, 219, 0.1);
  color: #2980b9;
}

.btn-action.edit:hover {
  background-color: #3498db;
  color: #ffffff;
}

.btn-action.delete {
  background-color: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.btn-action.delete:hover {
  background-color: #ef4444;
  color: #ffffff;
}

.empty-state {
  padding: 2.5rem !important;
  font-style: italic;
}

.text-center {
  text-align: center !important;
}

/* ==========================================
   4. MEDIA QUERIES (ADAPTAÇÃO PARA TELAS MAIORES)
   ========================================== */

/* Tablets e Desktops (Telas a partir de 768px) */
@media (min-width: 768px) {
  .layout-container {
    padding: 1.5rem 2rem;
  }

  .header-section {
    margin-bottom: 2rem;
  }

  .header-section h1 {
    font-size: 1.75rem;
  }

  .card-header {
    padding: 1rem 1.5rem;
  }

  .main-form {
    padding: 1.5rem;
  }

  /* O Grid volta a se dividir em duas colunas */
  .form-row {
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-bottom: 1.25rem;
  }

  /* Os botões voltam a alinhar lado a lado com tamanho natural */
  .action-bar {
    flex-direction: row;
    justify-content: flex-start;
  }

  .btn {
    width: auto;
    padding: 0.65rem 1.5rem;
    font-size: 0.9rem;
  }

  /* Restaura os espaçamentos ideais da tabela em telas grandes */
  .styled-table th, 
  .styled-table td {
    padding: 1rem 1.5rem;
  }
}
</style>


<script>
export default {name: 'Cadastro',}
</script>