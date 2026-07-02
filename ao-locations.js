/* ============================================================
   AO-LOCATIONS — Divisão administrativa de Angola
   18 províncias + municípios, com helpers para selects em
   cascata e composição de etiquetas de localização.

   Exposto como window.AOLocations. Pode ser carregado em
   qualquer página antes do script.js; o script.js usa-o se
   estiver presente e degrada graciosamente se não estiver.
   ============================================================ */
(function () {
  'use strict';

  // slug → nome amigável. Os slugs são minúsculos, sem acentos
  // nem espaços (kebab-case), para servirem de valores de <option>
  // e de chaves estáveis no Firestore.
  const PROVINCES = [
    { slug: 'bengo', name: 'Bengo', municipalities: [
      'Ambriz', 'Bula Atumba', 'Dande', 'Dembos', 'Nambuangongo', 'Pango Aluquém',
    ] },
    { slug: 'benguela', name: 'Benguela', municipalities: [
      'Baía Farta', 'Balombo', 'Benguela', 'Bocoio', 'Caimbambo', 'Catumbela',
      'Chongoroi', 'Cubal', 'Ganda', 'Lobito',
    ] },
    { slug: 'bie', name: 'Bié', municipalities: [
      'Andulo', 'Camacupa', 'Catabola', 'Chinguar', 'Chitembo', 'Cuemba',
      'Cunhinga', 'Cuíto', 'Nharea',
    ] },
    { slug: 'cabinda', name: 'Cabinda', municipalities: [
      'Belize', 'Buco-Zau', 'Cabinda', 'Cacongo',
    ] },
    { slug: 'cuando-cubango', name: 'Cuando Cubango', municipalities: [
      'Calai', 'Cuangar', 'Cuchi', 'Cuito Cuanavale', 'Dirico', 'Mavinga',
      'Menongue', 'Nancova', 'Rivungo',
    ] },
    { slug: 'cuanza-norte', name: 'Cuanza Norte', municipalities: [
      'Ambaca', 'Banga', 'Bolongongo', 'Cambambe', 'Cazengo', 'Golungo Alto',
      'Gonguembo', 'Lucala', 'Quiculungo', 'Samba Caju',
    ] },
    { slug: 'cuanza-sul', name: 'Cuanza Sul', municipalities: [
      'Amboim', 'Cassongue', 'Cela', 'Conda', 'Ebo', 'Libolo', 'Mussende',
      'Porto Amboim', 'Quibala', 'Quilenda', 'Seles', 'Sumbe',
    ] },
    { slug: 'cunene', name: 'Cunene', municipalities: [
      'Cahama', 'Cuanhama', 'Curoca', 'Cuvelai', 'Namacunde', 'Ombadja',
    ] },
    { slug: 'huambo', name: 'Huambo', municipalities: [
      'Bailundo', 'Caála', 'Catchiungo', 'Ekunha', 'Huambo', 'Londuimbali',
      'Longonjo', 'Mungo', 'Tchicala-Tcholoanga', 'Tchindjenje', 'Ucuma',
    ] },
    { slug: 'huila', name: 'Huíla', municipalities: [
      'Caconda', 'Cacula', 'Caluquembe', 'Chiange', 'Chibia', 'Chicomba',
      'Chipindo', 'Cuvango', 'Humpata', 'Jamba', 'Lubango', 'Matala',
      'Quilengues', 'Quipungo',
    ] },
    { slug: 'luanda', name: 'Luanda', municipalities: [
      'Belas', 'Cacuaco', 'Cazenga', 'Icolo e Bengo', 'Kilamba Kiaxi', 'Luanda',
      'Quiçama', 'Talatona', 'Viana',
    ] },
    { slug: 'lunda-norte', name: 'Lunda Norte', municipalities: [
      'Cambulo', 'Capenda-Camulemba', 'Caungula', 'Chitato', 'Cuango', 'Cuilo',
      'Lóvua', 'Lubalo', 'Lucapa', 'Xá-Muteba',
    ] },
    { slug: 'lunda-sul', name: 'Lunda Sul', municipalities: [
      'Cacolo', 'Dala', 'Muconda', 'Saurimo',
    ] },
    { slug: 'malanje', name: 'Malanje', municipalities: [
      'Cacuso', 'Calandula', 'Cambundi-Catembo', 'Cangandala', 'Caombo',
      'Cunda-Dia-Baze', 'Luquembo', 'Malanje', 'Marimba', 'Massango',
      'Mucari', 'Quela', 'Quirima',
    ] },
    { slug: 'moxico', name: 'Moxico', municipalities: [
      'Alto Zambeze', 'Bundas', 'Camanongue', 'Cameia', 'Léua', 'Luau',
      'Luchazes', 'Moxico',
    ] },
    { slug: 'namibe', name: 'Namibe', municipalities: [
      'Bibala', 'Camucuio', 'Namibe', 'Tômbwa', 'Virei',
    ] },
    { slug: 'uige', name: 'Uíge', municipalities: [
      'Alto Cauale', 'Ambuíla', 'Bembe', 'Buengas', 'Bungo', 'Damba',
      'Macocola', 'Maquela do Zombo', 'Mucaba', 'Negage', 'Puri', 'Quimbele',
      'Quitexe', 'Sanza Pombo', 'Songo', 'Uíge',
    ] },
    { slug: 'zaire', name: 'Zaire', municipalities: [
      'Cuimba', 'Mbanza Kongo', 'Nóqui', 'Nzeto', 'Soyo', 'Tomboco',
    ] },
  ];

  // Normaliza um texto para slug estável (sem acentos, minúsculo, kebab).
  function norm(s) {
    return String(s || '')
      .normalize('NFD').replace(/[̀-ͯ]/g, '') // remove acentos
      .toLowerCase().trim()
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  // Pré-computa municípios com slug para cada província.
  PROVINCES.forEach(p => {
    p.municipalities = p.municipalities.map(name => ({ slug: norm(name), name }));
  });

  const bySlug = {};
  PROVINCES.forEach(p => { bySlug[p.slug] = p; });

  // ── Coordenadas aproximadas ───────────────────────────────
  // Sede de cada província (capital) — usadas para posicionar no
  // mapa prestadores que ainda não captaram o GPS exato.
  const PROVINCE_COORDS = {
    'bengo':          [-8.58, 13.66],  // Caxito
    'benguela':       [-12.58, 13.41], // Benguela
    'bie':            [-12.38, 16.94], // Cuíto
    'cabinda':        [-5.55, 12.19],  // Cabinda
    'cuando-cubango': [-14.66, 17.69], // Menongue
    'cuanza-norte':   [-9.30, 14.91],  // N'dalatando
    'cuanza-sul':     [-11.21, 13.84], // Sumbe
    'cunene':         [-17.07, 15.73], // Ondjiva
    'huambo':         [-12.78, 15.74], // Huambo
    'huila':          [-14.92, 13.49], // Lubango
    'luanda':         [-8.84, 13.23],  // Luanda
    'lunda-norte':    [-7.38, 20.83],  // Dundo
    'lunda-sul':      [-9.66, 20.39],  // Saurimo
    'malanje':        [-9.54, 16.34],  // Malanje
    'moxico':         [-11.79, 19.90], // Luena
    'namibe':         [-15.19, 12.15], // Moçâmedes
    'uige':           [-7.61, 15.06],  // Uíge
    'zaire':          [-6.27, 14.24],  // Mbanza Kongo
  };

  // Sedes municipais conhecidas (chave: "provincia/municipio").
  // Não precisa de estar completa — o fallback é a sede provincial.
  const MUNICIPALITY_COORDS = {
    'luanda/luanda':         [-8.84, 13.23],
    'luanda/talatona':       [-8.92, 13.18],
    'luanda/viana':          [-8.90, 13.37],
    'luanda/cacuaco':        [-8.78, 13.37],
    'luanda/cazenga':        [-8.85, 13.29],
    'luanda/kilamba-kiaxi':  [-8.88, 13.27],
    'luanda/belas':          [-8.98, 13.16],
    'luanda/icolo-e-bengo':  [-9.06, 13.72],  // Catete
    'luanda/quicama':        [-9.53, 13.94],  // Muxima
    'benguela/benguela':     [-12.58, 13.41],
    'benguela/lobito':       [-12.35, 13.55],
    'benguela/catumbela':    [-12.43, 13.55],
    'huambo/huambo':         [-12.78, 15.74],
    'huila/lubango':         [-14.92, 13.49],
    'bie/cuito':             [-12.38, 16.94],
    'cabinda/cabinda':       [-5.55, 12.19],
    'malanje/malanje':       [-9.54, 16.34],
    'namibe/namibe':         [-15.19, 12.15],
    'uige/uige':             [-7.61, 15.06],
    'zaire/mbanza-kongo':    [-6.27, 14.24],
    'zaire/soyo':            [-6.13, 12.37],
    'moxico/moxico':         [-11.79, 19.90], // Luena
    'lunda-sul/saurimo':     [-9.66, 20.39],
    'lunda-norte/chitato':   [-7.38, 20.83],  // Dundo
    'cunene/cuanhama':       [-17.07, 15.73], // Ondjiva
    'cuando-cubango/menongue': [-14.66, 17.69],
    'cuanza-sul/sumbe':      [-11.21, 13.84],
    'cuanza-sul/porto-amboim': [-10.72, 13.75],
    'cuanza-norte/cazengo':  [-9.30, 14.91],  // N'dalatando
    'bengo/dande':           [-8.58, 13.66],  // Caxito
  };

  // Posição aproximada de um registo sem GPS exato:
  // sede do município → sede da província → null.
  function approxCoords(rec) {
    rec = rec || {};
    const p = getProvince(rec.province);
    if (!p) return null;
    const mun = norm(rec.municipality || '');
    const mc = mun ? MUNICIPALITY_COORDS[p.slug + '/' + mun] : null;
    if (mc) return { lat: mc[0], lng: mc[1], level: 'municipality' };
    const pc = PROVINCE_COORDS[p.slug];
    if (pc) return { lat: pc[0], lng: pc[1], level: 'province' };
    return null;
  }

  function getProvince(provSlug) {
    if (!provSlug) return null;
    return bySlug[provSlug] || bySlug[norm(provSlug)] || null;
  }

  function getMunicipalities(provSlug) {
    const p = getProvince(provSlug);
    return p ? p.municipalities : [];
  }

  function provinceLabel(provSlug) {
    const p = getProvince(provSlug);
    return p ? p.name : (provSlug ? capitalize(provSlug) : '');
  }

  function municipalityLabel(provSlug, munSlug) {
    if (!munSlug) return '';
    const muns = getMunicipalities(provSlug);
    const m = muns.find(x => x.slug === munSlug || x.slug === norm(munSlug));
    return m ? m.name : capitalize(munSlug);
  }

  function capitalize(slug) {
    return String(slug || '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  // Compõe uma etiqueta de localização legível a partir do registo do
  // prestador. Funciona com os campos novos (province/municipality/
  // neighborhood) e cai para o campo antigo `location` quando preciso.
  function composeLabel(rec) {
    rec = rec || {};
    const parts = [];
    if (rec.neighborhood) parts.push(String(rec.neighborhood).trim());
    const mun = rec.municipality ? municipalityLabel(rec.province, rec.municipality) : '';
    if (mun) parts.push(mun);
    const prov = rec.province ? provinceLabel(rec.province) : '';
    if (prov) parts.push(prov);
    if (parts.length) return parts.join(', ');
    // Retrocompatibilidade: registos antigos só têm `location`.
    if (rec.location) return capitalize(rec.location);
    return 'Angola';
  }

  // ── Helpers de UI para <select> ──────────────────────────
  function _opt(value, label) {
    const o = document.createElement('option');
    o.value = value;
    o.textContent = label;
    return o;
  }

  // Preenche um <select> com as províncias.
  // opts: { allOption?: string, placeholder?: string, selected?: string }
  function fillProvinces(sel, opts) {
    if (!sel) return;
    opts = opts || {};
    sel.innerHTML = '';
    if (opts.allOption) sel.appendChild(_opt('all', opts.allOption));
    if (opts.placeholder) {
      const ph = _opt('', opts.placeholder);
      ph.disabled = false;
      sel.appendChild(ph);
    }
    PROVINCES.forEach(p => sel.appendChild(_opt(p.slug, p.name)));
    if (opts.selected != null) sel.value = opts.selected;
  }

  // Preenche um <select> com os municípios de uma província.
  // opts: { allOption?: string, placeholder?: string, selected?: string }
  function fillMunicipalities(sel, provSlug, opts) {
    if (!sel) return;
    opts = opts || {};
    sel.innerHTML = '';
    if (opts.allOption) sel.appendChild(_opt('all', opts.allOption));
    if (opts.placeholder) sel.appendChild(_opt('', opts.placeholder));
    getMunicipalities(provSlug).forEach(m => sel.appendChild(_opt(m.slug, m.name)));
    if (opts.selected != null) sel.value = opts.selected;
    sel.disabled = !provSlug || provSlug === 'all';
  }

  // Liga dois selects em cascata: ao mudar a província, repõe os
  // municípios. opts são passados a fillMunicipalities.
  function bindCascade(provSel, munSel, opts) {
    if (!provSel || !munSel) return;
    provSel.addEventListener('change', () => {
      fillMunicipalities(munSel, provSel.value, opts);
    });
  }

  window.AOLocations = {
    provinces: PROVINCES,
    norm,
    getProvince,
    getMunicipalities,
    provinceLabel,
    municipalityLabel,
    composeLabel,
    approxCoords,
    fillProvinces,
    fillMunicipalities,
    bindCascade,
  };
})();
