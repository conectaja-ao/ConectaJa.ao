// ADICIONE ESTE SCRIPT NO SEU ARQUIVO prestadores.html SUBSTITUINDO A FUNÇÃO openProfileModal

// Dados de exemplo expandidos com todas as informações
const MOCK_PROVIDERS_EXPANDED = [
    {
        id: 1,
        name: "Joana Armando",
        type: "provider",
        featured: true,
        verified: true,
        online: true,
        rating: 5.0,
        category: "beleza",
        bio: "Cabeleireira profissional com mais de 10 anos de experiência. Especializada em cortes modernos, coloração e tratamentos capilares. Trabalho com as melhores marcas do mercado e estou sempre atualizada com as últimas tendências internacionais. Meu objetivo é realçar a beleza natural de cada cliente, criando looks personalizados que combinam com o estilo de vida e personalidade de cada pessoa.",
        tags: ["Cabeleireira", "Manicure", "Pedicure", "Maquilhagem", "Penteados", "Coloração"],
        completedJobs: 350,
        responseTime: "1h",
        totalReviews: 127,
        repeatClients: 85,
        avatar: avatar: "/images/joanaarmando.jpg",
        phone: "+244 928 630 869",
        email: "joana.armando@example.com",
        age: 32,
        location: "Luanda, Talatona",
        languages: "Português, Inglês",
        memberSince: "2020",
        services: [
            { name: "Corte Feminino", price: "Desde 3.000 Kz", icon: "cut" },
            { name: "Coloração", price: "Desde 8.000 Kz", icon: "palette" },
            { name: "Penteados", price: "Desde 5.000 Kz", icon: "spa" },
            { name: "Manicure e Pedicure", price: "Desde 2.500 Kz", icon: "hand-sparkles" }
        ],
        availability: {
            segunda: { available: true, hours: "09:00 - 18:00" },
            terca: { available: true, hours: "09:00 - 18:00" },
            quarta: { available: true, hours: "09:00 - 18:00" },
            quinta: { available: true, hours: "09:00 - 18:00" },
            sexta: { available: true, hours: "09:00 - 20:00" },
            sabado: { available: true, hours: "10:00 - 16:00" },
            domingo: { available: false, hours: "Fechado" }
        },
        reviews: [
            { author: "Maria Silva", rating: 5, text: "Excelente profissional! Adorei o corte e a atenção aos detalhes.", date: "Há 2 semanas" },
            { author: "Ana Costa", rating: 5, text: "Muito talentosa e simpática. Recomendo!", date: "Há 1 mês" },
            { author: "Paula Santos", rating: 5, text: "Sempre impecável! É a minha cabeleireira de confiança.", date: "Há 2 meses" }
        ]
    },
    {
        id: 2,
        name: "Alcides F. Domingos",
        type: "provider",
        featured: true,
        verified: true,
        online: true,
        rating: 4.5,
        category: "educacao",
        bio: "Professor de Inglês certificado com experiência internacional. Formado em Letras e com certificações TEFL e Cambridge. Minha metodologia é dinâmica e adaptada a cada aluno, focando em conversação prática e gramática aplicada. Tenho experiência com preparação para exames internacionais (TOEFL, IELTS) e inglês para negócios.",
        tags: ["Inglês", "Online", "Domicílio", "Conversação", "Business English", "Preparação para Exames"],
        completedJobs: 50,
        responseTime: "30min",
        totalReviews: 45,
        repeatClients: 90,
        avatar: "images/alcidesfdomingos.jpg",
        phone: "+244 924 549 117",
        email: "alcides.domingos@example.com",
        age: 28,
        location: "Luanda, Centro",
        languages: "Português, Inglês, Francês",
        memberSince: "2022",
        services: [
            { name: "Aula Individual", price: "5.000 Kz/hora", icon: "user" },
            { name: "Aula em Grupo (2-4)", price: "3.000 Kz/hora", icon: "users" },
            { name: "Aula Online", price: "4.000 Kz/hora", icon: "laptop" },
            { name: "Preparação TOEFL/IELTS", price: "7.000 Kz/hora", icon: "graduation-cap" }
        ],
        availability: {
            segunda: { available: true, hours: "14:00 - 20:00" },
            terca: { available: true, hours: "14:00 - 20:00" },
            quarta: { available: true, hours: "14:00 - 20:00" },
            quinta: { available: true, hours: "14:00 - 20:00" },
            sexta: { available: true, hours: "14:00 - 19:00" },
            sabado: { available: true, hours: "09:00 - 13:00" },
            domingo: { available: false, hours: "Fechado" }
        },
        reviews: [
            { author: "Pedro Mendes", rating: 5, text: "Excelente professor! Passei no TOEFL graças às aulas dele.", date: "Há 1 semana" },
            { author: "Carlos João", rating: 4, text: "Muito bom, didática excelente e paciente.", date: "Há 3 semanas" },
            { author: "Sofia Lima", rating: 5, text: "Melhor professor que já tive! Super recomendo.", date: "Há 1 mês" }
        ]
    },
    {
        id: 3,
        name: "Jacline Domingos",
        type: "provider",
        featured: true,
        verified: true,
        online: false,
        rating: 5.0,
        category: "beleza",
        bio: "Vendedora especializada em produtos de beleza premium. Trabalho com as melhores marcas de perucas naturais e sintéticas, cosméticos importados e produtos para cuidados capilares. Ofereço consultoria personalizada para ajudar cada cliente a encontrar os produtos perfeitos para suas necessidades. Faço entregas em toda Luanda.",
        tags: ["Perucas", "Cosméticos", "Maquilhagem", "Cuidados Capilares", "Produtos Premium"],
        completedJobs: 200,
        responseTime: "2h",
        totalReviews: 89,
        repeatClients: 78,
        avatar: "images/jaclinedomingos.jpg",
        phone: "+244 924 068 151",
        email: "djeyonecosmeticos@gmail.com",
        age: 35,
        location: "Luanda, Viana",
        languages: "Português",
        memberSince: "2019",
        services: [
            { name: "Perucas Naturais", price: "Desde 15.000 Kz", icon: "star" },
            { name: "Perucas Sintéticas", price: "Desde 8.000 Kz", icon: "star" },
            { name: "Cosméticos Importados", price: "Variável", icon: "shopping-bag" },
            { name: "Consultoria de Beleza", price: "Gratuito", icon: "comments" }
        ],
        availability: {
            segunda: { available: true, hours: "08:00 - 18:00" },
            terca: { available: true, hours: "08:00 - 18:00" },
            quarta: { available: true, hours: "08:00 - 18:00" },
            quinta: { available: true, hours: "08:00 - 18:00" },
            sexta: { available: true, hours: "08:00 - 18:00" },
            sabado: { available: true, hours: "08:00 - 14:00" },
            domingo: { available: false, hours: "Fechado" }
        },
        reviews: [
            { author: "Beatriz Sousa", rating: 5, text: "Produtos de qualidade e ótimo atendimento!", date: "Há 5 dias" },
            { author: "Lurdes Manuel", rating: 5, text: "Adorei a peruca que comprei. Muito natural!", date: "Há 2 semanas" },
            { author: "Teresa Neto", rating: 5, text: "Sempre tem os melhores produtos. Super indico!", date: "Há 1 mês" }
        ]
    }
];

// Função completa para abrir modal de perfil
function openProfileModalComplete(providerId) {
    const categoryNames = {
        'casa-construcao': 'Casa e Construção',
        'tecnologia': 'Tecnologia',
        'educacao': 'Educação',
        'beleza': 'Beleza e Bem-estar',
        'eventos': 'Eventos',
        'limpeza': 'Limpeza',
        'transporte': 'Transporte',
        'saude': 'Saúde'
    };
    
    // Buscar prestador (pode usar MOCK_PROVIDERS_EXPANDED ou getProviders())
    const provider = MOCK_PROVIDERS_EXPANDED.find(p => p.id === providerId);
    
    if (!provider) {
        alert('Prestador não encontrado!');
        return;
    }
    
    window.currentProviderId = providerId;
    
    // Preencher header
    document.getElementById('profileAvatar').src = provider.avatar || '';
    document.getElementById('profileAvatar').alt = provider.name;
    document.getElementById('profileName').textContent = provider.name;
    document.getElementById('profileCategory').textContent = categoryNames[provider.category] || provider.category;
    
    // Status online
    const onlineStatus = document.getElementById('profileOnlineStatus');
    if (provider.online) {
        onlineStatus.style.display = 'block';
        onlineStatus.style.background = '#10b981';
    } else {
        onlineStatus.style.display = 'block';
        onlineStatus.style.background = '#6b7280';
    }
    
    // Badge verificado
    if (provider.verified) {
        document.getElementById('profileVerifiedBadge').innerHTML = `
            <span class="profile-verified-badge-large">
                <i class="fas fa-check-circle"></i>
                Prestador Verificado
            </span>
        `;
    } else {
        document.getElementById('profileVerifiedBadge').innerHTML = '';
    }
    
    // Rating
    document.getElementById('profileStars').innerHTML = generateStars(provider.rating || 0);
    document.getElementById('profileRatingValue').textContent = (provider.rating || 0).toFixed(1);
    document.getElementById('profileReviewCount').textContent = provider.totalReviews || 0;
    
    // Informações rápidas
    document.getElementById('profileAge').textContent = provider.age ? `${provider.age} anos` : 'Não informado';
    document.getElementById('profileLocation').textContent = provider.location || 'Não informado';
    document.getElementById('profileLanguages').textContent = provider.languages || 'Português';
    document.getElementById('profileMemberSince').textContent = provider.memberSince || 'Recente';
    
    // Stats
    document.getElementById('profileCompletedJobs').textContent = `${provider.completedJobs || 0}+`;
    document.getElementById('profileResponseTime').textContent = provider.responseTime || 'N/A';
    document.getElementById('profileRating').textContent = (provider.rating || 0).toFixed(1);
    document.getElementById('profileRepeatClients').textContent = `${provider.repeatClients || 0}%`;
    
    // Bio
    document.getElementById('profileBio').textContent = provider.bio || 'Sem descrição disponível.';
    
    // Tags
    const tagsSection = document.getElementById('profileTagsSection');
    const tagsContainer = document.getElementById('profileTags');
    if (provider.tags && provider.tags.length > 0) {
        tagsSection.style.display = 'block';
        tagsContainer.innerHTML = provider.tags.map(tag => 
            `<span class="profile-tag">${tag}</span>`
        ).join('');
    } else {
        tagsSection.style.display = 'none';
    }
    
    // Serviços
    const servicesSection = document.getElementById('profileServicesSection');
    const servicesContainer = document.getElementById('profileServices');
    if (provider.services && provider.services.length > 0) {
        servicesSection.style.display = 'block';
        servicesContainer.innerHTML = provider.services.map(service => `
            <div class="service-item">
                <div class="service-icon">
                    <i class="fas fa-${service.icon}"></i>
                </div>
                <div class="service-content">
                    <div class="service-name">${service.name}</div>
                    <div class="service-price">${service.price}</div>
                </div>
            </div>
        `).join('');
    } else {
        servicesSection.style.display = 'none';
    }
    
    // Disponibilidade
    const availabilitySection = document.getElementById('profileAvailabilitySection');
    const availabilityContainer = document.getElementById('profileAvailability');
    if (provider.availability) {
        availabilitySection.style.display = 'block';
        const days = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];
        const dayNames = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
        
        availabilityContainer.innerHTML = days.map((day, index) => {
            const dayData = provider.availability[day];
            return `
                <div class="availability-day ${dayData.available ? 'available' : 'unavailable'}">
                    <div class="availability-day-name">${dayNames[index]}</div>
                    <div class="availability-day-hours">${dayData.hours}</div>
                </div>
            `;
        }).join('');
    } else {
        availabilitySection.style.display = 'none';
    }
    
    // Reviews
    const reviewsSection = document.getElementById('profileReviewsSection');
    const reviewsContainer = document.getElementById('profileReviews');
    if (provider.reviews && provider.reviews.length > 0) {
        reviewsSection.style.display = 'block';
        reviewsContainer.innerHTML = provider.reviews.map(review => {
            const initials = review.author.split(' ').map(n => n[0]).join('');
            return `
                <div class="review-card">
                    <div class="review-header">
                        <div class="review-author">
                            <div class="review-avatar">${initials}</div>
                            <span class="review-author-name">${review.author}</span>
                        </div>
                        <div class="review-rating">
                            ${generateStars(review.rating)}
                        </div>
                    </div>
                    <p class="review-text">${review.text}</p>
                    <p class="review-date">${review.date}</p>
                </div>
            `;
        }).join('');
    } else {
        reviewsSection.style.display = 'none';
    }
    
    // Mostrar modal
    document.getElementById('profileModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Função auxiliar para gerar estrelas (certifique-se de que existe no seu código)
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    let html = '';
    for (let i = 0; i < fullStars; i++) {
        html += '<i class="fas fa-star"></i>';
    }
    if (halfStar) {
        html += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        html += '<i class="far fa-star"></i>';
    }
    
    return html;
}