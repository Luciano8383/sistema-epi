<template>
  <div class="layout-container">
    <!-- Cabeçalho -->
    <header class="header-section flex-between">
      <div>
        <h1>Entregas de EPI</h1>
        <p>Registro de saída de equipamentos para colaboradores.</p>
      </div>
      <button class="btn btn-outline flex-center" @click="carregar" :disabled="loading">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right: 8px;">
          <path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
        </svg>
        Atualizar Dados
      </button>
    </header>

    <!-- Formulário de Registro -->
    <div class="card-form">
      <div class="card-header">
        <h2>Nova Entrega</h2>
      </div>

      <div class="main-form">
        <div class="form-row">
          <!-- Seleção de Funcionário -->
          <div class="form-group">
            <label>Funcionário</label>
            <select v-model="form.id_funcionario" class="custom-select" :disabled="loading">
              <option value="">Selecione o colaborador...</option>
              <option v-for="f in funcionario" :key="f.id_funcionario" :value="f.id_funcionario">
                {{ f.nome }} ({{ f.cargo || 'Sem cargo' }})
              </option>
            </select>
          </div>

          <!-- Seleção de EPI -->
          <div class="form-group">
            <label>EPI</label>
            <select v-model="form.id_cadastro_epi" class="custom-select" :disabled="loading">
              <option value="">Selecione o equipamento...</option>
              <option v-for="e in cadastro_epi" :key="e.id_epi" :value="e.id_epi">
                {{ e.nome }} — Saldo: {{ e.quantidade }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-row cols-3">
          <div class="form-group">
            <label>Quantidade Entregue</label>
            <input type="number" v-model.number="form.quantidade_entregue" min="1" />
          </div>
          <div class="form-group">
            <label>Data da Entrega</label>
            <input type="date" v-model="form.dt_entrega" />
          </div>
          <div class="form-group">
            <label>Assinatura / Observação</label>
            <input type="text" v-model="form.assinatura" placeholder="Ex: Assinado via Tablet" />
          </div>
        </div>

        <div class="action-bar">
          <button 
            class="btn btn-primary" 
            @click="registrar" 
            :disabled="!form.id_funcionario || !form.id_cadastro_epi || loading"
          >
            <span v-if="loading">Processando...</span>
            <span v-else>Confirmar Entrega</span>
          </button>
        </div>

        <p class="error-msg" v-if="erro">⚠ {{ erro }}</p>
        <p class="success-msg" v-if="ok">✓ Registro salvo e estoque atualizado!</p>
      </div>
    </div>

    <!-- Tabela de Histórico -->
    <div class="card-table">
      <div class="card-header flex-between">
        <h2>Últimas Movimentações</h2>
        <span class="badge badge-blue" v-if="entrega.length">{{ entrega.length }} registros encontrados</span>
      </div>

      <div v-if="loading && !entrega.length" class="text-center" style="padding: 40px;">
        <div class="spinner"></div> Carregando histórico...
      </div>

      <div v-else class="table-container">
        <table class="styled-table">
          <thead>
            <tr>
              <th>Funcionário</th>
              <th>Equipamento (EPI)</th>
              <th class="text-center">Qtd</th>
              <th>Data</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="e in entrega" :key="e.id_entrega">
              <td>
                <div class="text-bold">{{ e.funcionario?.nome || 'N/A' }}</div>
                <div class="cargo-text">{{ e.funcionario?.cargo }}</div>
              </td>
              <td>
                <div class="text-bold">{{ e.cadastro_epi?.nome || 'EPI não encontrado' }}</div>
                <div class="cargo-text">CA: {{ e.cadastro_epi?.numero_ca || '—' }}</div>
              </td>
              <td class="text-center">
                <span class="text-bold">{{ e.quantidade_entregue }}</span>
              </td>
              <td class="cargo-text">{{ formatarData(e.dt_entrega) }}</td>
              <td>
                <span class="badge badge-ok">Concluída</span>
              </td>
            </tr>
            <tr v-if="entrega.length === 0 && !loading">
              <td colspan="5" class="text-center cargo-text" style="padding: 40px;">
                Nenhuma entrega registrada até o momento.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
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
.layout-container { width: 100%; padding: 20px 30px; background-color: #ffffff; min-height: 100vh; box-sizing: border-box; }
.header-section { margin-bottom: 25px; }
.header-section h1 { color: #0f172a; font-size: 1.5rem; font-weight: 700; margin: 0; }
.card-form, .card-table { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 24px; width: 100%; overflow: hidden; }
.card-header { background-color: #f8fafc; padding: 12px 20px; border-bottom: 1px solid #e2e8f0; }
.flex-between { display: flex; justify-content: space-between; align-items: center; }
.main-form { padding: 20px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
.cols-3 { grid-template-columns: 1fr 1fr 1.2fr; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
label { font-size: 0.8rem; font-weight: 600; color: #334155; }
input, .custom-select { padding: 9px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.875rem; }
.btn-primary { background: #0f172a; color: white; padding: 10px 20px; border-radius: 6px; border: none; cursor: pointer; font-weight: 600; }
.table-container { width: 100%; overflow-x: auto; }
.styled-table { width: 100%; border-collapse: collapse; }
.styled-table th { background: #f8fafc; padding: 14px 20px; text-align: left; font-size: 0.75rem; color: #475569; border-bottom: 2px solid #f1f5f9; }
.styled-table td { padding: 14px 20px; border-top: 1px solid #f1f5f9; font-size: 0.875rem; }
.badge { padding: 3px 10px; border-radius: 6px; font-size: 0.7rem; font-weight: 700; }
.badge-blue { background: #e0f2fe; color: #0369a1; }
.badge-ok { background: #dcfce7; color: #166534; }
.badge-warn { background: #fef9c3; color: #854d0e; }
.text-bold { font-weight: 600; }
.cargo-text { color: #64748b; font-size: 0.8rem; }
.text-center-loading { padding: 40px; text-align: center; }
</style>

<script>
export default { name: 'Entrega_epi', }
</script>