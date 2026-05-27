<template>
    <header class="header">
        <div class="empresa-info">
            <div class="empresa-logo">
                <img src="../assets/Header/logo.png" alt="Logo da Empresa" class="logo-header">
            </div>
            <div class="empresa-nome">Sistema de EPIS</div>
        </div>

        <div class="menu-login-container">
            <nav>
                <ul>
                    <li><a href="https://www.sc.senai.br/" target="_blank">Institucional</a></li>
                    <!-- Elemento modificado para controlar o menu flutuante -->
                    <li class="menu-fornecedores" 
                        @mouseenter="mostrarTabela = true" 
                        @mouseleave="mostrarTabela = false">
                        <a href="#">Fornecedores</a>
                        
                        <!-- Tabela flutuante controlada pelo Vue -->
                        <div v-if="mostrarTabela" class="fornecedores-dropdown">
                            <table class="tabela-fornecedores">
                               <thead>
                                   <tr>
                                       <th>Nome</th>
                                       <th>CNPJ</th>
                                   </tr>
                               </thead>
                               <tbody>
                                   <tr v-for="(fornecedor, index) in listaFornecedores" :key="index">
                                       <td>{{ fornecedor.nome }}</td>
                                       <td>{{ fornecedor.cnpj }}</td>
                                   </tr>
                               </tbody>
                            </table>
                        </div>
                    </li>
                </ul>
            </nav>

            <div class="login-area">
                <router-link to="/login" class="login-link">Login</router-link>
                <router-link to="/login" class="login-icon-container">
                    <img src="../assets/Header/login.png" alt="Ícone de Login" class="login-icon">
                </router-link>
            </div>
        </div>
    </header>

    <main class="main-content">
        <section class="epi-hero">
            <h1>Bem-vindo ao Sistema de EPI</h1>
            <p>Gerencie eficientemente seus equipamentos de proteção individual com segurança e agilidade.</p>
        </section>

        <section class="gallery-section">
            <img src="../assets/Principal/senai.png" alt="Imagem de Fundo" class="senai-image">
            
            <div class="img-grid">
                <img src="../assets/Principal/imagem1.png" alt="img1" class="thumb-image">
                <img src="../assets/Principal/imagem2.png" alt="img2" class="thumb-image">
                <img src="../assets/Principal/imagem3.png" alt="img3" class="thumb-image">
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="footer-container">
            <div class="footer-info">
                <div class="contact-item">
                    <img src="../assets/Footer/telefone.png" alt="Telefone" class="footer-icon">
                    <span>0800-048-1212</span>
                </div>
                <div class="contact-item">
                    <img src="../assets/Footer/whats.png" alt="WhatsApp" class="footer-icon">
                    <span>(48) 3231-4000</span>
                </div>
                <div class="contact-item">
                    <img src="../assets/Footer/email.png" alt="Email" class="footer-icon">
                    <span>faleconosco@fiesc.com.br</span>
                </div>
                <div class="contact-item local">
                    <img src="../assets/Footer/local.png" alt="Localização" class="footer-icon">
                    <span>Rod. Ademar Gonzaga, 2765 - Centro, Florianópolis - SC</span>
                </div>
            </div>

            <div class="redes-sociais">
                <a href="https://www.linkedin.com/school/senai-sc/?originalSubdomain=br" target="_blank" rel="noopener noreferrer">
                    <img src="../assets/Footer/linkedin.png" alt="Linkedin" class="footer-icon social-icon">
                </a>
                <a href="https://www.facebook.com/senaisc/" target="_blank" rel="noopener noreferrer">
                    <img src="../assets/Footer/face.png" alt="Facebook" class="footer-icon social-icon">
                </a>
                <a href="https://www.youtube.com/@senaiconhecimento/videos" target="_blank" rel="noopener noreferrer">
                    <img src="../assets/Footer/youtube.png" alt="YouTube" class="footer-icon social-icon">
                </a>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2026 Sistema de EPI. Todos os direitos reservados.</p>
        </div>
    </footer>
</template>

<script setup>
import { ref } from 'vue';

// Estado para controlar a visibilidade da tabela
const mostrarTabela = ref(false);

// Seus dados mockados de fornecedores (pode vir de uma API depois)
const listaFornecedores = ref([
    { nome: '3M do Brasil', cnpj: '45.985.371/0001-08' },
    { nome: 'Marluvas Calçados', cnpj: '19.458.742/0002-40' },
    { nome: 'Danny EPI', cnpj: '02.147.852/0001-99' }
]);
</script>

<style scoped>
/* Configurações Gerais de Reset Interno (Scoped) */
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

/* --- HEADER (Padrão Mobile) --- */
.header {
    width: 100%;
    background-color: #1a252f;
    color: white;
    padding: 1rem;
    display: flex;
    flex-direction: column; /* Empilhado no celular */
    align-items: center;
    gap: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.empresa-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.logo-header {
    width: 44px;
    height: 44px;
    background-color: #fff;
    border-radius: 50%;
    object-fit: contain;
    border: 2px solid #3498db;
}

.empresa-nome {
    font-size: 1.25rem;
    font-weight: 700;
    letter-spacing: 0.5px;
}

.menu-login-container {
    display: flex;
    flex-direction: column; /* Alinhamento vertical no mobile */
    align-items: center;
    gap: 1.25rem;
    width: 100%;
}

nav {
    width: 100%;
}

nav ul {
    list-style: none;
    display: flex;
    flex-direction: column; /* Links empilhados no mobile */
    align-items: center;
    gap: 1rem;
    width: 100%;
}

nav a, .login-link {
    color: #b4c2d3;
    text-decoration: none;
    font-weight: 600;
    font-size: 1.05rem;
    transition: color 0.3s ease, transform 0.2s ease;
    padding: 4px 0;
    display: inline-block;
}

nav a:hover, .login-link:hover {
    color: #3498db;
}

/* Área de Login */
.login-area {
    display: flex;
    align-items: center;
    gap: 12px;
}

.login-icon-container {
    width: 40px;
    height: 40px;
    background-color: #2c3e50;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-color 0.3s, transform 0.2s;
}

.login-icon-container:hover {
    background-color: #3498db;
    transform: scale(1.05);
}

.login-icon {
    width: 20px;
    height: 20px;
    object-fit: contain;
}

/* --- DROPDOWN DE FORNECEDORES (Adaptado para Mobile) --- */
.menu-fornecedores {
    position: relative;
    display: block;
    text-align: center;
    width: 100%;
}

/* Em telas pequenas ele age como um bloco expansível interno */
.fornecedores-dropdown {
    position: relative;
    top: auto;
    left: auto;
    transform: none;
    background-color: #ffffff;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    padding: 10px;
    z-index: 100;
    margin: 10px auto 0 auto;
    width: 100%;
    max-width: 340px;
    overflow-x: auto; /* Permite rolar a tabelinha se a tela for muito pequena */
    -webkit-overflow-scrolling: touch;
}

/* Oculta a seta apontadora no mobile para poupar espaço e bug visual */
.fornecedores-dropdown::before {
    display: none;
}

.tabela-fornecedores {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85rem;
    color: #334155;
    text-align: left;
}

.tabela-fornecedores th {
    background-color: #f1f5f9;
    color: #1e293b;
    font-weight: 700;
    padding: 8px 10px;
    border-bottom: 2px solid #e2e8f0;
}

.tabela-fornecedores td {
    padding: 8px 10px;
    border-bottom: 1px solid #f1f5f9;
    white-space: nowrap;
}

.tabela-fornecedores tbody tr:nth-child(even) {
    background-color: #f8fafc;
}

/* --- MAIN CONTENT (Mobile) --- */
.main-content {
    padding: 2rem 1rem;
    background-color: #f8fafc;
    min-height: 60vh;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.epi-hero {
    width: 100%;
    text-align: center;
    margin-bottom: 2rem;
}

.epi-hero h1 {
    font-size: 1.8rem; /* Menor no celular para não quebrar feio */
    color: #1a252f;
    margin-bottom: 0.75rem;
    font-weight: 700;
    line-height: 1.2;
}

.epi-hero p {
    font-size: 1rem;
    color: #64748b;
    line-height: 1.5;
}

.gallery-section {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
}

.senai-image {
    width: 100%;
    height: auto;
    border-radius: 12px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
}

.img-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); /* Grid auto-ajustável */
    gap: 15px;
    width: 100%;
}

.thumb-image {
    width: 100%;
    height: 110px;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* --- FOOTER (Mobile) --- */
.footer {
    width: 100%;
    background-color: #111827;
    color: #9ca3af;
    padding: 2.5rem 1rem 1.5rem 1rem;
}

.footer-container {
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column; /* Empilhado no celular */
    align-items: center;
    text-align: center;
    gap: 2rem;
    border-bottom: 1px solid #1f2937;
    padding-bottom: 2rem;
}

.footer-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
}

.contact-item {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-size: 0.95rem;
}

.footer-icon {
    width: 18px;
    height: 18px;
    object-fit: contain;
    filter: brightness(0) invert(1);
    opacity: 0.7;
}

.local {
    max-width: 100%;
}

.redes-sociais {
    display: flex;
    gap: 15px;
    justify-content: center;
}

.social-icon {
    width: 32px;
    height: 32px;
    transition: transform 0.2s, filter 0.2s;
}

.footer-bottom {
    text-align: center;
    margin-top: 1.5rem;
    font-size: 0.85rem;
    color: #6b7280;
}


/* ==========================================
   MEDIAS QUERIES (DESKTOPS E TELAS GRANDES)
   ========================================== */

/* Ajuste intermediário para Tablets (A partir de 768px) */
@media (min-width: 768px) {
    .header {
        flex-direction: row;
        justify-content: space-between;
        padding: 1rem 2rem;
    }

    .menu-login-container {
        flex-direction: row;
        gap: 30px;
        width: auto;
    }

    nav ul {
        flex-direction: row;
        gap: 25px;
    }

    .menu-fornecedores {
        width: auto;
    }

    /* Restaura o comportamento Flutuante clássico do Dropdown */
    .fornecedores-dropdown {
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        margin-top: 10px;
        min-width: 320px;
        max-width: none;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }

    .fornecedores-dropdown::before {
        display: block;
        content: '';
        position: absolute;
        top: -6px;
        left: 50%;
        transform: translateX(-50%) rotate(45deg);
        width: 12px;
        height: 12px;
        background-color: #ffffff;
    }

    .epi-hero h1 {
        font-size: 2.2rem;
    }

    .footer-container {
        flex-direction: row;
        justify-content: space-between;
        text-align: left;
        gap: 30px;
    }

    .footer-info {
        align-items: flex-start;
    }

    .contact-item {
        justify-content: flex-start;
    }

    .redes-sociais {
        justify-content: flex-start;
    }
}

/* Ajuste final para Computadores/Desktops Grandes (A partir de 1024px) */
@media (min-width: 1024px) {
    .header {
        padding: 1rem 3rem;
    }

    .empresa-nome {
        font-size: 1.4rem;
    }

    .menu-login-container {
        gap: 40px;
    }

    nav ul {
        gap: 30px;
    }

    nav a, .login-link {
        font-size: 1.1rem;
    }

    nav a:hover {
        transform: translateY(-1px);
    }

    .main-content {
        padding: 3rem 2rem;
    }

    .epi-hero h1 {
        font-size: 2.5rem;
    }

    .epi-hero p {
        font-size: 1.1rem;
    }

    .gallery-section {
        max-width: 1000px;
        gap: 2.5rem;
    }

    .senai-image {
        max-width: 650px;
    }

    .img-grid {
        display: flex;
        justify-content: center;
        gap: 25px;
    }

    .thumb-image {
        max-width: 220px;
        height: 140px;
    }

    .thumb-image:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 15px rgba(0, 0, 0, 0.12);
    }

    .local {
        max-width: 450px;
    }

    .footer {
        padding: 3rem 2rem 1.5rem 2rem;
    }
}
</style>
<script>
export default { name: 'Home', }
</script>