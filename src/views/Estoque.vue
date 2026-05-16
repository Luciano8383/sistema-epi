<template>
  <div class="layout-container">
    <header class="header-section flex-between">
      <div>
        <h1>Controle de Estoque</h1>
        <p>Gerencie o saldo e a disponibilidade de cada EPI.</p>
      </div>
      <button class="btn btn-outline flex-center" @click="carregar" :disabled="loading">
        Atualizar
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
              <th class="text-center">Status Vencimento</th>
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
.btn-primary { background: #2563eb; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; }

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