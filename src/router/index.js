import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import Cadastrar_funcionario from '../views/Cadastrar_funcionario.vue'

import Login from '../views/login.vue'
import Inicio from '../views/inicio.vue'
import Cadastro from '../views/Cadastro.vue'
import Estoque from '../views/estoque.vue'
import Entrega_epi from '../views/entrega_epi.vue'

import { useSupabase } from '../composables/useSupabase'


const routes = [
{ path: '/', component: Home},

{path: '/Login', component: Login},

{path: '/inicio', component: Inicio,
  

children: [
{ path: '/cadastrar_funcionario', component: Cadastrar_funcionario},

{path: '/Cadastro', component: Cadastro},
{path: '/estoque', component: Estoque},
{path: '/entrega_epi', component: Entrega_epi},

] 
}
]


const router = createRouter({
  history: createWebHistory(),
  routes
})
export default router