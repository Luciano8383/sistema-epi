<template>
  <div class="layout-container">
    <!-- Cabeçalho -->
    <header class="header-section flex-between">
      <div class="header-titles">
        <h1>Entregas de EPI</h1>
        <p>Registro e controle de saída de equipamentos de proteção para colaboradores.</p>
      </div>
      <button class="btn btn-outline flex-center" @click="carregar" :disabled="loading">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="icon-refresh">
          <path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
        </svg>
        Atualizar Dados
      </button>
    </header>

    <main class="content">
      <!-- Formulário de Registro -->
      <div class="card-form">
        <div class="card-header">
          <h2>Nova Entrega</h2>
        </div>

        <div class="main-form">
          <div class="form-row">
            <!-- Seleção de Funcionário -->
            <div class="form-group">
              <label for="funcionario-select">Funcionário</label>
              <select id="funcionario-select" v-model="form.id_funcionario" class="custom-select" :disabled="loading">
                <option value="">Selecione o colaborador...</option>
                <option v-for="f in funcionario" :key="f.id_funcionario" :value="f.id_funcionario">
                  {{ f.nome }} ({{ f.cargo || 'Sem cargo' }})
                </option>
              </select>
            </div>

            <!-- Seleção de EPI -->
            <div class="form-group">
              <label for="epi-select">Equipamento (EPI)</label>
              <select id="epi-select" v-model="form.id_cadastro_epi" class="custom-select" :disabled="loading">
                <option value="">Selecione o equipamento...</option>
                <option v-for="e in cadastro_epi" :key="e.id_epi" :value="e.id_epi">
                  {{ e.nome }} — Saldo Atual: {{ e.quantidade }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-row cols-3">
            <div class="form-group">
              <label for="qtd-input">Quantidade Entregue</label>
              <input type="number" id="qtd-input" v-model.number="form.quantidade_entregue" min="1" placeholder="Ex: 1" />
            </div>
            <div class="form-group">
              <label for="data-input">Data da Entrega</label>
              <input type="date" id="data-input" v-model="form.dt_entrega" />
            </div>
            <div class="form-group">
              <label for="obs-input">Assinatura / Observação</label>
              <input type="text" id="obs-input" v-model="form.assinatura" placeholder="Ex: Assinado digitalmente" />
            </div>
          </div>

          <!-- Feedbacks de Alerta Customizados -->
          <div class="msg-container">
            <p class="error-msg" v-if="erro">⚠ {{ erro }}</p>
            <p class="success-msg" v-if="ok">✓ Registro salvo e estoque atualizado com sucesso!</p>
          </div>

          <div class="action-bar">
            <button 
              class="btn btn-primary" 
              @click="registrar" 
              :disabled="!form.id_funcionario || !form.id_cadastro_epi || loading"
            >
              <span v-if="loading" class="flex-center">
                <div class="spinner mini"></div> Processando...
              </span>
              <span v-else>Confirmar Entrega</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Tabela de Histórico -->
      <div class="card-table">
        <div class="card-header flex-between">
          <h2>Últimas Movimentações</h2>
          <span class="badge badge-blue" v-if="entrega.length">{{ entrega.length }} registros</span>
        </div>

        <!-- Estado de Carregamento interno -->
        <div v-if="loading && !entrega.length" class="loading-state">
          <div class="spinner"></div>
          <p>Carregando histórico de entregas...</p>
        </div>

        <div v-else class="table-container">
          <table class="styled-table">
            <thead>
              <tr>
                <th>Funcionário</th>
                <th>Equipamento (EPI)</th>
                <th class="text-center">Qtd</th>
                <th>Data de Saída</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="e in entrega" :key="e.id_entrega">
                <td>
                  <div class="text-bold text-dark">{{ e.funcionario?.nome || 'N/A' }}</div>
                  <div class="cargo-text">{{ e.funcionario?.cargo }}</div>
                </td>
                <td>
                  <div class="text-bold text-dark">{{ e.cadastro_epi?.nome || 'EPI não encontrado' }}</div>
                  <div class="cargo-text">CA: {{ e.cadastro_epi?.numero_ca || '—' }}</div>
                </td>
                <td class="text-center">
                  <span class="text-bold text-dark">{{ e.quantidade_entregue }} un.</span>
                </td>
                <td class="cargo-text text-medium">{{ formatarData(e.dt_entrega) }}</td>
                <td>
                  <span class="badge badge-ok">Concluída</span>
                </td>
              </tr>
              <tr v-if="entrega.length === 0 && !loading">
                <td colspan="5" class="text-center cargo-text empty-state">
                  Nenhuma entrega registrada até o momento.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSupabase } from '@/composables/useSupabase'

const { supabase } = useSupabase()

const funcionario = ref([])
const cadastro_epi = ref([])
const entrega = ref([])
const loading = ref(true)
const erro = ref('')
const ok = ref(false)

const hoje = new Date().toISOString().slice(0, 10)

// AJUSTE: Nomes das colunas conforme seu banco de dados
const form = ref({ 
  id_funcionario: '',     // UUID do funcionário
  id_cadastro_epi: '',    // UUID do EPI
  quantidade_entregue: 1, 
  dt_entrega: hoje,       // Nome da coluna no seu banco: dt_entrega
  assinatura: ''          // Nome da coluna no seu banco: assinatura
})

async function carregar() {
  loading.value = true
  erro.value = ''
  try {
    // 1. Busca Funcionários
    const { data: funcs } = await supabase.from('funcionario').select('*').order('nome')
    funcionario.value = funcs || []

    // 2. Busca EPIs
    const { data: episData } = await supabase.from('cadastro_epi').select('*')
    cadastro_epi.value = episData || []

    // 3. Busca Histórico - AJUSTADO
    const { data: entData, error: entError } = await supabase
      .from('entrega')
      .select(`
        id_entrega,
        dt_entrega,
        assinatura,
        quantidade_entregue,
        funcionario!entrega_id_funcionario_fkey ( nome, cargo ),
        cadastro_epi!entrega_id_cadastro_epi_fkey ( nome, numero_ca )
      `) // Adicionamos o nome da constraint para não haver erro de ambiguidade
      .order('dt_entrega', { ascending: false })
    
    if (entError) throw entError
    entrega.value = entData || []

  } catch (e) {
    console.error("Erro detalhado:", e)
    erro.value = "Erro ao carregar dados: " + e.message
  } finally {
    loading.value = false
  }
}

async function registrar() {
  erro.value = ''; ok.value = false
  loading.value = true

  // AJUSTE AQUI: Use id_epi que é o nome correto na sua tabela cadastro_epi
  const epiSelecionado = cadastro_epi.value.find(e => e.id_epi === form.value.id_cadastro_epi)
  
  if (!epiSelecionado) {
    erro.value = "EPI não encontrado.";
    loading.value = false;
    return;
  }

  if (form.value.quantidade_entregue > epiSelecionado.quantidade) {
    erro.value = `Estoque insuficiente (${epiSelecionado.quantidade} disponíveis)`; 
    loading.value = false
    return
  }

  // 1. Insere na tabela 'entrega'
  const { error: insertError } = await supabase.from('entrega').insert([{
    id_funcionario: form.value.id_funcionario,
    id_cadastro_epi: form.value.id_cadastro_epi,
    quantidade_entregue: form.value.quantidade_entregue,
    dt_entrega: form.value.dt_entrega,
    assinatura: !!form.value.assinatura // Sua tabela 'entrega' define assinatura como BOOLEAN no SQL original
  }])
 
  if (insertError) { 
    erro.value = insertError.message; 
    loading.value = false
    return 
  }

  // 2. Atualiza o saldo
  const novaQuantidade = epiSelecionado.quantidade - form.value.quantidade_entregue
  await supabase.from('cadastro_epi')
    .update({ quantidade: novaQuantidade })
    .eq('id_epi', form.value.id_cadastro_epi) // Use id_epi aqui também

  ok.value = true
  form.value = { id_funcionario: '', id_cadastro_epi: '', quantidade_entregue: 1, dt_entrega: hoje, assinatura: '' }
  await carregar()
  setTimeout(() => ok.value = false, 3000)
}

function formatarData(d) {
  if (!d) return '—'
  const [y, m, dia] = d.split('-')
  return `${dia}/${m}/${y}`
}

onMounted(carregar)
</script>

<style scoped>
/* Container Base */
.layout-container {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
  background-color: #f8fafc;
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  min-height: 100vh;
  box-sizing: border-box;
}

/* Cabeçalho superior */
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

/* Estrutura de Cards */
.card-form, .card-table {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 2rem;
  width: 100%;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.card-header {
  background-color: #f8fafc;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.card-header h2 {
  margin: 0;
  font-size: 1.1rem;
  color: #1a252f;
  font-weight: 600;
}

/* Flexbox utilitários */
.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Formulário Interno */
.main-form {
  padding: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.25rem;
}

.cols-3 {
  grid-template-columns: 1fr 1fr 1.2fr;
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

input, .custom-select {
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

input:focus, .custom-select:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.15);
}

/* Botões */
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

.btn-primary:hover:not(:disabled) {
  background: #2980b9;
}

.btn-primary:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
  color: #94a3b8;
}

.btn-outline {
  background: white;
  color: #64748b;
  border: 1px solid #cbd5e1;
}

.btn-outline:hover:not(:disabled) {
  background: #f8fafc;
  color: #334155;
  border-color: #94a3b8;
}

.icon-refresh {
  margin-right: 8px;
  flex-shrink: 0;
}

.action-bar {
  margin-top: 1.5rem;
}

/* Caixas de Alerta */
.msg-container {
  margin-bottom: 0.5rem;
}

.error-msg {
  background-color: #fef2f2;
  color: #dc2626;
  border: 1px solid #fee2e2;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  margin: 0.5rem 0;
}

.success-msg {
  background-color: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  margin: 0.5rem 0;
}

/* Tabela Customizada */
.table-container {
  width: 100%;
  overflow-x: auto;
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
  vertical-align: middle;
}

.styled-table tbody tr:hover {
  background-color: #f8fafc;
}

/* Badges e Textos */
.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.badge-blue {
  background: #e0f2fe;
  color: #0369a1;
}

.badge-ok {
  background: #dcfce7;
  color: #166534;
}

.text-bold {
  font-weight: 600;
}

.text-dark {
  color: #1a252f;
}

.text-medium {
  color: #475569;
}

.cargo-text {
  color: #64748b;
  font-size: 0.8rem;
  margin-top: 2px;
}

.empty-state {
  padding: 2.5rem !important;
  font-style: italic;
}

.text-center {
  text-align: center !important;
}

/* Estado de Carregamento e Spinner CSS */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 0.75rem;
  color: #64748b;
  font-size: 0.9rem;
}

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #e2e8f0;
  border-top-color: #3498db;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.spinner.mini {
  width: 14px;
  height: 14px;
  border-width: 2px;
  margin-right: 8px;
  border-top-color: white;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsividade */
@media (max-width: 768px) {
  .form-row, .cols-3 {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>

<script>
export default { name: 'Entrega_epi', }
</script>