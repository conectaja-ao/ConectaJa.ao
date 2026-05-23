/**
 * ============================================
 * MENU MOBILE - CORREÇÃO SIMPLES E GARANTIDA
 * ============================================
 * 
 * Adicione este script ANTES do </body> em TODOS os HTMLs
 * ou no final do seu script.js
 */

(function() {
    'use strict';
    
    console.log('🍔 Iniciando correção do menu mobile...');
    
    // Aguarda o DOM estar pronto
    function initMobileMenu() {
        const mobileToggle = document.getElementById('mobileMenuToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (!mobileToggle || !navMenu) {
            console.warn('⚠️ Elementos do menu não encontrados');
            return;
        }
        
        console.log('✅ Elementos do menu encontrados!');
        
        // Remove listeners anteriores (previne duplicação)
        const newToggle = mobileToggle.cloneNode(true);
        mobileToggle.parentNode.replaceChild(newToggle, mobileToggle);
        
        // Adiciona listener ao novo toggle
        newToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('🍔 Menu toggle clicado!');
            
            // Toggle nas classes
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            
            // Log do estado
            const isActive = navMenu.classList.contains('active');
            console.log(isActive ? '✅ Menu ABERTO' : '❌ Menu FECHADO');
        });
        
        // Fecha o menu ao clicar fora
        document.addEventListener('click', function(e) {
            const isClickInsideMenu = navMenu.contains(e.target);
            const isClickOnToggle = newToggle.contains(e.target);
            
            if (!isClickInsideMenu && !isClickOnToggle && navMenu.classList.contains('active')) {
                console.log('🚪 Fechando menu (clique fora)');
                navMenu.classList.remove('active');
                newToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
        
        // Fecha o menu ao clicar em um link
        const menuLinks = navMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                console.log('🔗 Link clicado, fechando menu');
                setTimeout(() => {
                    navMenu.classList.remove('active');
                    newToggle.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }, 300);
            });
        });
        
        // Fecha o menu ao redimensionar para desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 1024 && navMenu.classList.contains('active')) {
                console.log('📏 Redimensionado para desktop, fechando menu');
                navMenu.classList.remove('active');
                newToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
        
        console.log('✅ Menu mobile inicializado com sucesso!');
    }
    
    // Executa quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileMenu);
    } else {
        initMobileMenu();
    }
    
})();