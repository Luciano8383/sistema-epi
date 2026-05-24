<template>
  <div class="layout-container">
    
    <!-- Cabeçalho da Página Interna -->
    <header class="header-section">
      <div class="header-titles">
        <h1>Controle de Efetivo</h1>
        <p>Gerencie o cadastro de colaboradores e organize a distribuição por cargos e setores.</p>
      </div>
    </header>

    <main class="content">
      <!-- Seção do Formulário (Card) -->
      <section class="card-form">
        <div class="card-header">
          <h3>{{ editandoId ? 'Alterar Registro' : 'Novo Funcionário' }}</h3>
        </div>
        
        <form @submit.prevent="salvar" class="main-form">
          <div class="form-row">
            <div class="form-group">
              <label for="nome">Nome Completo</label>
              <input v-model="form.nome" type="text" id="nome" placeholder="Digite o nome do colaborador" required>
            </div>
            <div class="form-group">
              <label for="cpf">Nº CPF</label>
              <input v-model="form.cpf" type="text" id="cpf" placeholder="000.000.000-00" required>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="e-mail">E-mail Corporativo</label>
              <input v-model="form.email" type="email" id="e-mail" placeholder="exemplo@empresa.com" required>
            </div>
            <div class="form-group">
              <label for="cargo">Cargo / Função</label>
              <input v-model="form.cargo" type="text" id="cargo" placeholder="Ex: Técnico de Segurança" required>
            </div>
          </div>
          
          <div class="action-bar">
            <button type="submit" class="btn btn-primary">
              {{ editandoId ? 'Atualizar Dados' : 'Finalizar Cadastro' }}
            </button>
            <button v-if="editandoId" type="button" @click="cancelarEdicao" class="btn btn-outline">
              Cancelar
            </button>
          </div>
        </form>
      </section>

      <!-- Seção da Tabela de Dados (Card) -->
      <section class="card-table">
        <div class="table-responsive">
          <table class="styled-table">
            <thead>
              <tr>
                <th>Colaborador</th>
                <th>CPF</th>
                <th>E-mail</th>
                <th>Cargo</th>
                <th class="text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="f in funcionario" :key="f.id_funcionario">
                <td>
                  <span class="text-bold">{{ f.nome }}</span>
                </td>
                <td class="text-muted">{{ f.cpf }}</td>
                <td>
                  <span class="email-text">{{ f.email }}</span>
                </td>
                <td>
                  <span class="badge-cargo">{{ f.cargo }}</span>
                </td>
                <td class="text-center">
                  <div class="actions-wrapper">
                    <button @click="prepararEdicao(f)" class="btn-action edit" title="Editar registro">Editar</button>
                    <button @click="excluir(f.id_funcionario)" class="btn-action delete" title="Excluir registro">Excluir</button>
                  </div>
                </td>
              </tr>
              <!-- Mensagem caso a tabela esteja vazia -->
              <tr v-if="!funcionario || funcionario.length === 0">
                <td colspan="5" class="text-center text-muted empty-state">
                  Nenhum funcionário cadastrado no momento.
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
import { useSupabase } from '../composables/useSupabase';

const { supabase } = useSupabase();

// Variáveis que controlam os dados na tela
const funcionario = ref([]);
const editandoId = ref(null);
const form = reactive({ 
  nome: '', 
  cpf: '', 
  email: '', 
  cargo: '' 
});

// Busca os dados do Supabase
const carregar = async () => {
  const { data, error } = await supabase.from('funcionario').select('*').order('nome');
  if (error) {
    console.error("Erro ao carregar:", error.message);
  } else {
    funcionario.value = data || [];
  }
};

// Salva um novo ou atualiza um existente
const salvar = async () => {
  if (editandoId.value) {
    // Modo de Edição (Update)
    await supabase.from('funcionario').update(form).eq('id_funcionario', editandoId.value);
  } else {
    // Modo de Criação (Insert)
    await supabase.from('funcionario').insert([form]);
  }
  cancelarEdicao();
  carregar();
};

// Prepara o formulário para edição ao clicar no botão
const prepararEdicao = (f) => {
  editandoId.value = f.id_funcionario;
  Object.assign(form, { 
    nome: f.nome, 
    cpf: f.cpf, 
    email: f.email, 
    cargo: f.cargo 
  });
};

// Deleta um registro
const excluir = async (id) => {
  if (confirm('Deseja realmente remover este registro?')) {
    await supabase.from('funcionario').delete().eq('id_funcionario', id);
    carregar();
  }
};

// Limpa o formulário e sai do modo de edição
const cancelarEdicao = () => {
  editandoId.value = null;
  Object.assign(form, { nome: '', cpf: '', email: '', cargo: '' });
};

// Inicia a busca de dados assim que a tela abre
onMounted(carregar);
</script>

<style scoped>
/* Container Principal */
.layout-container {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
  background-color: #f8fafc;
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

/* Cabeçalho da Seção */
.header-section {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.header-section h1 {
  color: #1a252f;
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
}

.header-section p {
  color: #64748b;
  font-size: 0.95rem;
  margin: 0;
}

/* Estilização dos Cards */
.card-form, .card-table {
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
  overflow: hidden;
}

.card-header {
  background-color: #f8fafc;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.card-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #1a252f;
  font-weight: 600;
}

.main-form {
  padding: 1.5rem;
}

/* Grid do Formulário */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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

/* Barra de Ações do Formulário */
.action-bar {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.btn {
  padding: 0.65rem 1.5rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
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

/* Tabela Profissional Customizada */
.table-responsive {
  width: 100%;
  overflow-x: auto; /* Garante que role de lado se a tela for muito pequena */
}

.styled-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.styled-table th {
  background-color: #f8fafc;
  padding: 1rem 1.5rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #e2e8f0;
}

.styled-table td {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.9rem;
  color: #334155;
  vertical-align: middle;
}

/* Efeito Hover nas linhas da Tabela */
.styled-table tbody tr:hover {
  background-color: #f8fafc;
}

/* Estilização de Colunas Específicas */
.text-bold {
  font-weight: 600;
  color: #1a252f;
}

.text-muted {
  color: #64748b;
}

.email-text {
  color: #475569;
}

/* Badge Neutro para Cargos */
.badge-cargo {
  display: inline-block;
  background: #e2e8f0;
  color: #334155;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

/* Wrapper e botões de ação estruturados */
.actions-wrapper {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.btn-action {
  padding: 5px 12px;
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
  padding: 2rem !important;
  font-style: italic;
}

.text-center {
  text-align: center !important;
}

/* Responsividade */
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>

<script>
export default {name: 'Cadastrar_Funcionario',}
</script>