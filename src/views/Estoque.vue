<template>
  <div class="layout-container">
    <header class="header-section flex-between">
      <div>
        <h1>Controle de Estoque</h1>
        <p>Gerencie o saldo e a disponibilidade de cada EPI.</p>
      </div>
      
      <!-- Botão Atualizar Profissionalizado -->
      <button class="btn btn-refresh" @click="carregar" :disabled="loading">
        <svg 
          :class="{ 'spinning': loading }"
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round"
        >
          <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
          <path d="M3 3v5h5"/>
          <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
          <path d="M16 16h5v5"/>
        </svg>
        <span>Atualizar</span>
      </button>
    </header>

    <!-- Formulário de Ajuste -->
    <div class="card-form card">
      <div class="card-header">
        <h2>Ajustar Quantidade</h2>
      </div>
      <div class="main-form">
        <div class="form-row">
          <div class="form-group">
            <label>EPI</label>
            <select v-model="form.id_epi" class="custom-select">
              <option value="">Selecione um EPI...</option>
              <option v-for="item in cadastro_epi" :key="item.id_epi" :value="item.id_epi">
                {{ item.nome }} (Atual: {{ item.quantidade }})
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Nova Quantidade em Estoque</label>
            <input type="number" v-model.number="form.quantidade" min="0" />
          </div>
        </div>
        <div class="action-bar">
          <button class="btn btn-primary" @click="atualizar" :disabled="!form.id_epi || loading">
            Salvar Alteração
          </button>
        </div>
        <p class="error-msg" v-if="erro">⚠️ {{ erro }}</p>
        <p class="success-msg" v-if="ok">✓ Estoque atualizado!</p>
      </div>
    </div>

    <!-- Tabela de Saldo -->
    <div class="card-table card">
      <div class="table-container">
        <table class="styled-table">
          <thead>
            <tr>
              <th>EPI / CA</th>
              <th>Data Validade</th>
              <th>Quantidade</th>
              <th style="text-align: center !important;">Status Vencimento</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in cadastro_epi" :key="item.id_epi">
              <td>
                <div class="text-bold">{{ item.nome }}</div>
                <div class="cargo-text">CA: {{ item.numero_ca }}</div>
              </td>
              <td class="cargo-text">{{ formatarData(item.dt_validade) }}</td>
              <td class="text-bold">{{ item.quantidade }}</td>
              <td class="text-center">
                <!-- Lógica do Alarme -->
                <span v-if="verificarVencimento(item.dt_validade) === 'vencido'" class="badge badge-danger blink">
                  ⚠️ VENCIDO
                </span>
                <span v-else-if="verificarVencimento(item.dt_validade) === 'alerta'" class="badge badge-warn">
                  ⏳ Vence em breve
                </span>
                <span v-else-if="verificarVencimento(item.dt_validade) === 'em-dia'" class="badge badge-ok">
                  ✅ Regular
                </span>
                <span v-else class="cargo-text">N/A</span>
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
import { useSupabase } from '../composables/useSupabase';

const { supabase } = useSupabase();
const cadastro_epi = ref([])
const loading = ref(true)
const erro = ref('')
const ok = ref(false)
const form = ref({ id_epi: '', quantidade: 0 })

const hoje = new Date()

// Função para carregar os dados
async function carregar() {
  loading.value = true
  erro.value = ''
  
  const { data, error } = await supabase
    .from('cadastro_epi')
    .select('id_epi, nome, quantidade, dt_validade, numero_ca')
    .order('nome', { ascending: true })

  if (error) {
    erro.value = 'Erro ao carregar: ' + error.message
  } else {
    cadastro_epi.value = data || []
  }
  loading.value = false
}

// Função para atualizar o estoque
async function atualizar() {
  if (!form.value.id_epi) return;
  erro.value = ''; ok.value = false
  
  const { error } = await supabase
    .from('cadastro_epi')
    .update({ quantidade: form.value.quantidade })
    .eq('id_epi', form.value.id_epi)

  if (error) {
    erro.value = 'Erro: ' + error.message
    return
  }
  
  ok.value = true
  form.value = { id_epi: '', quantidade: 0 }
  await carregar()
  setTimeout(() => ok.value = false, 3000)
}

// Lógica do Alarme de Vencimento
function verificarVencimento(dataValidade) {
  if (!dataValidade) return 'nenhum';
  
  const validade = new Date(dataValidade);
  const trintaDias = new Date();
  trintaDias.setDate(hoje.getDate() + 30);

  if (validade < hoje) return 'vencido';
  if (validade < trintaDias) return 'alerta';
  return 'em-dia';
}

function formatarData(d) {
  if (!d) return '—'
  const [y, m, dia] = d.split('-')
  return `${dia}/${m}/${y}`
}

onMounted(carregar)
</script>

<style scoped>
.layout-container { 
  max-width: 1200px; 
  margin: 0 auto; 
  padding: 10px 20px;
  background: #ffffff; 
  min-height: 100vh; 
  font-family: sans-serif;
}

/* FLEX UTILITIES (Geralmente usados no cabeçalho) */
.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card { 
  background: white; 
  border: 1px solid #f1f5f9; 
  border-radius: 12px; 
  padding: 20px; 
  margin-bottom: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.header-section h1 { margin: 0; font-size: 1.8rem; }
.header-section p { color: #64748b; margin-top: -5px; }

.form-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
.form-group { display: flex; flex-direction: column; gap: 5px; font-weight: bold; font-size: 0.85rem; }

input, select { padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; }

/* BOTÕES GERAIS E SECUNDÁRIOS */
.btn-primary { 
  background: #2563eb; 
  color: white; 
  border: none; 
  padding: 10px 20px; 
  border-radius: 6px; 
  cursor: pointer; 
}

/* NOVO ESTILO DO BOTÃO ATUALIZAR */
.btn-refresh {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: #ffffff;
  color: #334155;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 8px 14px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.btn-refresh:hover:not(:disabled) {
  background-color: #f8fafc;
  color: #1e40af;
  border-color: #bfdbfe;
}

.btn-refresh:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.btn-refresh:disabled {
  background-color: #f1f5f9;
  color: #94a3b8;
  border-color: #e2e8f0;
  cursor: not-allowed;
}

/* Animação do ícone girando (quando loading for true) */
.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* TABELAS */
.styled-table { width: 100%; border-collapse: collapse; }
.styled-table th { background: #f8fafc; padding: 12px; text-align: left; color: #64748b; font-size: 0.75rem; text-transform: uppercase; }
.styled-table td { padding: 12px; border-top: 1px solid #f1f5f9; }

/* BADGES E ALARMES */
.badge { padding: 5px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: bold; display: inline-block; }
.badge-ok { background: #dcfce7; color: #15803d; }
.badge-warn { background: #fef9c3; color: #854d0e; }
.badge-danger { background: #fee2e2; color: #b91c1c; }

.text-bold { font-weight: bold; }
.text-center { text-align: center; }
.cargo-text { font-size: 0.8rem; color: #94a3b8; }

/* ANIMAÇÃO PISCANTE PARA VENCIDOS */
.blink { animation: blinker 1.5s linear infinite; }
@keyframes blinker { 50% { opacity: 0.4; } }

.success-msg { color: #16a34a; font-size: 0.9rem; margin-top: 10px; }
.error-msg { color: #dc2626; font-size: 0.9rem; margin-top: 10px; }
</style>