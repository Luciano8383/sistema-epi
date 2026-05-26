import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import Cadastrar_funcionario from '../views/Cadastrar_funcionario.vue'

import Login from '../views/Login.vue'
import Inicio from '../views/Inicio.vue'
import Cadastro from '../views/Cadastro.vue'
import Estoque from '../views/Estoque.vue'
import Entrega_epi from '../views/Entrega_epi.vue'

import { useSupabase } from '../composables/useSupabase'


const routes = [
{ path: '/', component: Home},

{path: '/Login', component: Login},

{path: '/Inicio', component: Inicio,
  

children: [
{ path: '/cadastrar_funcionario', component: Cadastrar_funcionario},

{path: '/Cadastro', component: Cadastro},
{path: '/Estoque', component: Estoque},
{path: '/Entrega_epi', component: Entrega_epi},

] 
}
]


const router = createRouter({
  history: createWebHistory(),
  routes
})
export default router