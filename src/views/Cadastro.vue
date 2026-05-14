<template>
  <div class="layout-container">
    
    <header class="header-section">
      <h1>Cadastro de EPIs</h1>
      <p>Gerencie o catálogo de Equipamentos de Proteção Individual e C.A.</p>
    </header>

    <main class="content">
      <section class="card-form">
        <div class="card-header">
          <h3>{{ editandoId ? 'Editar Equipamento' : 'Novo Equipamento' }}</h3>
        </div>
        
        <form @submit.prevent="salvar" class="main-form">_
          <div class="form-row">
            <div class="form-group">
              <label>Nome do EPI</label>
              <input v-model="form.nome" type="text" placeholder="Ex: Capacete de Segurança" required>
            </div>
            <div class="form-group">
              <label>Número do C.A.</label>
              <input v-model="form.numero_ca" type="text" placeholder="Ex: 12345" required>
            </div>
            <div class="form-group" style="margin-bottom: 20px;">
            <label>Quantidade</label>
            <input v-model="form.quantidade" type="number" placeholder="Ex: 10">
          </div>
          <div class="form-group" style="margin-bottom: 20px;">
            <label>Validade</label>
            <input v-model="form.dt_validade" type="date" required>
          </div>
          </div>
          
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

      <section class="card-table">
        <table class="styled-table">
  <thead>
    <tr>
      <th>Equipamento</th>
      <th class="text-center">C.A.</th> <!-- Centralizado -->
      <th class="text-center">Quantidade</th> <!-- Centralizado -->
      <th>Validade</th>
      <th class="text-center">Ações</th> <!-- Centralizado -->
    </tr>
  </thead>
  <tbody>
    <tr v-for="e in cadastro_epi" :key="e.id_epi">
      <td><span class="text-bold">{{ e.nome }}</span></td>
      <td class="text-center">
        <span class="badge-ca">{{ e.numero_ca }}</span>
      </td>
      <td class="text-center">{{ e.quantidade }}</td>
      <td>{{ e.dt_validade }}</td>
      <td class="text-center">
        <button @click="prepararEdicao(e)" class="btn-action edit">Editar</button>
        <button @click="excluir(e.id_epi)" class="btn-action delete">Excluir</button>
      </td>
    </tr>
  </tbody>
</table>
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
/* Aproveitando o estilo anterior para manter o padrão */
.layout-container { max-width: 1000px; margin: 0 auto; padding: 30px; background-color: #f8fafc; min-height: 100vh; font-family: sans-serif; }
.header-section { margin-bottom: 25px; }
.card-form, .card-table { background: #fff; border-radius: 10px; border: 1px solid #e2e8f0; margin-bottom: 25px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); overflow: hidden; }
.card-header { background: #f1f5f9; padding: 12px 20px; border-bottom: 1px solid #e2e8f0; font-weight: bold; }
.main-form { padding: 20px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
.form-group { display: flex; flex-direction: column; gap: 5px; }
label { font-size: 0.8rem; font-weight: 700; color: #475569; }
input { padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; }
.btn { padding: 10px 20px; border-radius: 6px; cursor: pointer; border: none; font-weight: bold; }
.btn-primary { background: #2563eb; color: white; }
.btn-outline { background: white; color: #64748b; border: 1px solid #cbd5e1; }
.styled-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: auto; /* Permite que as colunas se ajustem ao conteúdo */
}

.styled-table th {
  background: #f8fafc;
  padding: 12px 20px;
  text-align: left; /* Padrão à esquerda */
  font-size: 0.75rem;
  color: #64748b;
  text-transform: uppercase;
  border-bottom: 2px solid #e2e8f0;
}

.styled-table td {
  padding: 12px 20px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.9rem;
  vertical-align: middle; /* Alinha o conteúdo verticalmente ao centro */
}

/* Alinhamento Centralizado para colunas específicas */
.text-center {
  text-align: center !important;
}

/* Badge do C.A. - Ajuste para não quebrar linha */
.badge-ca {
  display: inline-block;
  background: #fee2e2;
  color: #991b1b;
  padding: 2px 8px;
  border-radius: 6px;
  font-weight: bold;
  white-space: nowrap;
}

.btn-action {
  background: none;
  border: none;
  font-weight: bold;
  cursor: pointer;
  padding: 5px 10px;
}

.edit { color: #2563eb; margin-right: 10px; }
.delete { color: #be123c; }
</style>


<script>
export default {name: 'Cadastro',}
</script>