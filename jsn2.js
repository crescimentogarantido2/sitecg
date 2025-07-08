/* ======================================================================
   CONFIGURAÇÕES BÁSICAS + CONTROLE DE REQUISIÇÕES
   ----------------------------------------------------------------------
   • req           → contador de buscas (zera 00 h América/Recife)
   • apiKey        → chave ativa; troca a cada 35 req (14 chaves em loop)
====================================================================== */
const API_KEYS = [
  /* 1  */ 'AIzaSyBsUFJTTPKvI21d6jZ26Cz6AAETHEmaGWk',
  /* 2  */ 'AIzaSyD1rqQhHwCRkTl_N2F25PDr2IGIL4-WwuQ',
  /* 3  */ 'AIzaSyBrh6IH7du62CW96ODFNqHDOv0zgFTpv7Q',
  /* 4  */ 'AIzaSyBsUFJTTPKvI21d6jZ26Cz6AAETHEmaGWk',
  /* 5  */ 'AIzaSyBFY67fVlVc6qqwhJzR_MaY9IqCCmV7JEA',
  /* 6  */ 'AIzaSyCYwfk1ng4uVNv8tHRt-002sPm_hsdxJiA',
  /* 7  */ 'AIzaSyCalpmgZLYhkCrgrkPLH65-E5d9mPTu-5s',
  /* 8  */ 'AIzaSyDnz9xf_ncoWFsOdyD5mVxmM2N7yDxN6Ag',
  /* 9  */ 'AIzaSyDv7eMaLzdrBnAoOepIQNsMrHqnmqTdNdE',
  /* 10 */ 'AIzaSyAmAAg4IBZTsVamHNKVLeHW69ry5AOPSWU',
  /* 11 */ 'AIzaSyAQFccOMmpkn-8mA-GE5jrGta0-KYrCv14',
  /* 12 */ 'AIzaSyB4M0FK9LOsCKSeMQzKS6m3oTbNWzeR3lI',
  /* 13 */ 'AIzaSyD2YdAwWW-8_d2wLpXgQBeEaKXJ4MG1zGY',
  /* 14 */ 'AIzaSyD1shX4Z0V7DFwihhw-u0_XjdolUfhEXpw'
];

let req               = 0;                  // nº de buscas do dia
let apiKey            = API_KEYS[0];        // chave ativa
let lastResetDateStr  = null;               // data última zerada (string)

/* ---------- Incrementa contador e gira chave ---------- */
function incReq() {
  const hoje = new Date().toLocaleDateString(
    'pt-BR',
    { timeZone: 'America/Recife' }
  );

  /* reset às 00 h */
  if (hoje !== lastResetDateStr) {
    req = 0;
    apiKey = API_KEYS[0];
    lastResetDateStr = hoje;
  }

  req++;
  apiKey = API_KEYS[Math.floor(req / 35) % API_KEYS.length];
}
/* ---- Controle local p/ evitar registros duplicados ---- */
const savedLinks = new Set();

/* ---- Helpers p/ detectar dispositivo e sistema operacional ---- */
function getDevice() {
  const ua = navigator.userAgent.toLowerCase();
  if (/mobile|android|iphone|ipad/.test(ua)) return 'Mobile';
  if (/mac|win|linux/.test(ua))              return 'Desktop';
  return 'Unknown';
}
function getOS() {
  const ua = navigator.userAgent;
  if (/Windows NT/i.test(ua)) return 'Windows';
  if (/Mac OS X/i.test(ua))   return 'macOS';
  if (/Android/i.test(ua))    return 'Android';
  if (/iPhone|iPad/i.test(ua))return 'iOS';
  if (/Linux/i.test(ua))      return 'Linux';
  return 'Unknown';
}

/* ---------- Google Sheets ----------- */
const SHEETS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbwRFbVMzzVORE6uqPqpcff1i4ZlzlKayz8oj8GVK3fLXUFSNHBidDdUEf2x3P0FItVOFw/exec';

async function sendToSheets(linkStr){
  if(savedLinks.has(linkStr)) return;          // evita duplicados

  // --- Geo-IP opcional
  let ip = '', cidade = '';
  try{
    const r = await fetch('https://ipapi.co/json');
    const j = await r.json();
    ip      = j.ip   || '';
    cidade  = j.city || '';
  }catch(e){/* ignora */ }

  // --- Monta as 10 colunas
  const payload = {
    dataHora   : getDateHourString(),                // A
    linkCanal  : linkStr,                            // B
    busca      : req,                                // C
    mensagem   : '',                                 // D
    aparelho   : getDevice(),                        // E
    operacional: getOS(),                            // F
    cidade,                                          // G
    ip,                                             // H
    origem     : document.referrer || location.href, // I
    chaveapi   : apiKey                              // J
  };

  fetch(SHEETS_SCRIPT_URL,{
    method :'POST',
    mode   :'no-cors',
    headers:{'Content-Type':'application/json'},
    body   : JSON.stringify(payload)
  })
  .then(()=>{
    savedLinks.add(linkStr);
    console.log('Sheets OK:', linkStr, 'req', req);
  })
  .catch(err => console.error('Falha Sheets:', err));
}

/* ======================================================================
   ÍCONES SVG (mantidos do código original)
====================================================================== */
const ICONS = {
  subscribers: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"
         style="width:1em;height:1em;fill:#fff;margin-left:6px;vertical-align:middle">
      <path d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192l42.7 0c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0L21.3 320C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7l42.7 0C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3l-213.3 0zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352l117.3 0C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7l-330.7 0c-14.7 0-26.7-11.9-26.7-26.7z"/>
    </svg>`,
  views: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"
         style="width:1em;height:1em;fill:#fff;margin-left:6px;vertical-align:middle">
      <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/>
    </svg>`,
  copy: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
         style="width:1em;height:1em;fill:#fff;margin-left:6px;vertical-align:middle">
      <path d="M208 0L332.1 0c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9L448 336c0 26.5-21.5 48-48 48l-192 0c-26.5 0-48-21.5-48-48l0-288c0-26.5 21.5-48 48-48zM48 128l80 0 0 64-64 0 0 256 192 0 0-32 64 0 0 48c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 176c0-26.5 21.5-48 48-48z"/>
    </svg>`
};

/* ======================================================================
   ELEMENTOS DO DOM
====================================================================== */
const searchInput               = document.getElementById('searchInput');
const searchButton              = document.getElementById('searchButton');
const resultsList               = document.getElementById('results');
const loading                   = document.getElementById('loading');

const selectedChannelContainer  = document.getElementById('selectedChannelContainer');
const selectedChannelTitle      = document.getElementById('selectedChannelTitle');
const selectedChannelElement    = document.getElementById('selectedChannel');

const increaseSubscribersBtn    = document.getElementById('increaseSubscribersBtn');
const increaseViewsBtn          = document.getElementById('increaseViewsBtn');

const videoListContainer        = document.getElementById('videoListContainer');
const videoResults              = document.getElementById('videoResults');
const loadMoreVideosBtn         = document.getElementById('loadMoreVideosBtn');

const selectedVideoContainer    = document.getElementById('selectedVideoContainer');
const selectedVideoTitle        = document.getElementById('selectedVideoTitle');
const selectedVideoElement      = document.getElementById('selectedVideo');

/* Coloca ícones nos botões principais */
increaseSubscribersBtn.innerHTML = `IMPULSIONAR INSCRITOS ${ICONS.subscribers}`;
increaseViewsBtn.innerHTML       = `IMPULSIONAR VISUALIZAÇÕES ${ICONS.views}`;

/* ======================================================================
   HELPERS GERAIS (mantidos do original)
====================================================================== */
const shortenTitleForList     = (t)=> (t.length>35 ? t.slice(0,33)+'...' : t);
const shortenTitleForSelected = (t)=> (t.length>35 ? t.slice(0,35)+'...' : t);
const formatLargeNumber       = (n)=> (+n||0).toLocaleString('pt-BR');
const isYouTubeLink           = (s)=> /youtube\.com|youtu\.be/.test(s);

/* ======================================================================
   PLACEHOLDER PISCANTE
====================================================================== */
let basePlaceholder = 'Busque seu canal';
let blinkInt        = null;
let blinkStarted    = false;

function startBlink() {
  if (blinkStarted) return;
  blinkStarted = true;
  let on = true;
  blinkInt = setInterval(() => {
    searchInput.setAttribute('placeholder', (on ? '| ' : '  ') + basePlaceholder);
    on = !on;
  }, 500);
}
function triggerBlink() {
  if (!searchInput.value.trim()) startBlink();
}
document.addEventListener('mousemove', triggerBlink);
document.addEventListener('click', triggerBlink);
searchInput.addEventListener('focus', triggerBlink);

searchInput.addEventListener('input', () => {
  const hasTxt = !!searchInput.value.trim();
  searchButton.disabled = !hasTxt;
  searchButton.classList.toggle('inactive-button', !hasTxt);
  searchInput.classList.toggle('typing', hasTxt);

  if (hasTxt) {
    clearInterval(blinkInt);
    blinkInt = null;
    searchInput.setAttribute('placeholder', basePlaceholder);
  } else if (blinkStarted && !blinkInt) {
    startBlink();
  }
});

/* ======================================================================
   REINICIAR ESTADO EM NOVA BUSCA
====================================================================== */
searchButton.addEventListener('click', () => {
  incReq();                              // ----- incrementa contador
  currentSelectedChannel = null;
  currentChannelId       = null;
  currentSelectedVideoLi?.classList.remove('selected-video-item');
  currentSelectedVideoLi = null;
  clearInterval(channelCountdownInterval);
  clearInterval(videoCountdownInterval);
  channelCountdownInterval = videoCountdownInterval = null;
});

/* ======================================================================
   BUSCA PRINCIPAL
====================================================================== */
searchButton.addEventListener('click', () => {
  const q = searchInput.value.trim();
  if (!q) return;
  loading.textContent = 'Buscando canal...';
  loading.classList.remove('hidden');
  hideChannelSelection();
  hideVideoList();
  hideVideoSelection();
  resultsList.innerHTML = '';
  handleSearch(q);
});

function handleSearch(q) {
  if (isYouTubeLink(q)) {
    const type = getLinkType(q);
    if (type === 'channel') {
      getFromChannelLink(q, true);
    } else if (type === 'video' || type === 'shorts') {
      const id = extractVideoId(q);
      if (id) getFromVideo(id, true);
      else    showError('Link de vídeo inválido.');
    } else {
      showError('Link do YouTube inválido.');
    }
    return;
  }
  searchChannels(q);
}

function showError(msg) {
  resultsList.innerHTML = `<li>${msg}</li>`;
  loading.classList.add('hidden');
}

/* ======================================================================
   HELPERS – LINK
====================================================================== */
function getLinkType(link) {
  if (/\/channel\/|\/@/.test(link))               return 'channel';
  if (/\/shorts\//.test(link))                    return 'shorts';
  if (/\/watch|youtu\.be|\/embed\//.test(link))   return 'video';
  return 'unknown';
}
function extractVideoId(link) {
  try {
    const { pathname, searchParams } = new URL(link);

    if (pathname === '/watch')            return searchParams.get('v');
    if (link.includes('youtu.be'))        return pathname.split('/')[1].split('?')[0];
    if (pathname.startsWith('/embed/'))   return pathname.split('/')[2].split('?')[0];
    if (pathname.startsWith('/shorts/'))  return pathname.split('/')[2].split('?')[0];

  } catch (e) {}

  return null;
}

/* ======================================================================
   FLUXO CANAL  (todas as chamadas usam apiKey dinâmica)
====================================================================== */
function getFromChannelLink(link, auto = false) {
  try {
    const { pathname } = new URL(link);

    if (pathname.startsWith('/channel/')) return fetchChannelById(pathname.split('/')[2], auto, true);
    if (pathname.startsWith('/@'))        return fetchByHandle(pathname.slice(2), auto);

  } catch {}

  showError('Link de canal inválido.');
}

function fetchByHandle(handle, auto = false) {
  fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=@${handle}&type=channel&maxResults=1&key=${apiKey}`)
    .then((r) => r.json())
    .then((d) => {
      loading.classList.add('hidden');
      if (d.items?.length) fetchChannelDetails(d.items[0].id.channelId, auto);
      else                 showNotFoundBtn();
    })
    .catch(() => showError('Erro ao buscar canal.'));
}

function getFromVideo(id, auto = false) {
  fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${apiKey}`)
    .then((r) => r.json())
    .then((d) => {
      loading.classList.add('hidden');
      if (d.items?.length) fetchChannelDetails(d.items[0].snippet.channelId, auto);
      else                 showError('Vídeo não encontrado.');
    })
    .catch(() => showError('Erro ao buscar vídeo.'));
}

function fetchChannelById(id, auto = false, isLink = false) {
  fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${id}&key=${apiKey}`)
    .then((r) => r.json())
    .then((d) => {
      loading.classList.add('hidden');
      if (d.items?.length) fetchChannelDetails(id, auto);
      else if (isLink)     showNotFoundBtn();
      else                 showError('Canal não encontrado.');
    })
    .catch(() => showError('Erro ao buscar canal.'));
}

function fetchChannelDetails(id, auto = false) {
  fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${id}&key=${apiKey}`)
    .then((r) => r.json())
    .then((d) => {
      loading.classList.add('hidden');
      if (d.items?.length) displayChannelResults(d.items, !auto, auto);
      else                 showError('Canal não encontrado.');
    })
    .catch(() => showError('Erro ao buscar detalhes do canal.'));
}

function searchChannels(q) {
  fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(q)}&maxResults=7&key=${apiKey}`)
    .then((r) => r.json())
    .then((d) => {
      loading.classList.add('hidden');
      if (d.items?.length) fetchStatsForSearch(d.items);
      else                 showNotFoundBtn();
    })
    .catch(() => showError('Erro ao buscar canais. Tente novamente mais tarde.'));
}

function fetchStatsForSearch(arr) {
  const ids = arr.map((c) => c.id.channelId).join(',');
  fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${ids}&key=${apiKey}`)
    .then((r) => r.json())
    .then((d) => {
      if (d.items?.length) displayChannelResults(d.items, true);
      else                 showError('Não foi possível obter estatísticas dos canais.');
    })
    .catch(() => showError('Erro ao buscar estatísticas dos canais.'));
}

function showNotFoundBtn() {
  const li  = document.createElement('li');
  li.style  = 'cursor:default;text-align:center;border:none;margin-bottom:0;';

  const btn = document.createElement('button');
  btn.className = 'load-more-btn';
  btn.textContent = 'Canal não encontrado. Cole o link de um vídeo de seu canal e refaça a busca.';
  btn.onclick = () => searchInput.focus();

  li.appendChild(btn);
  resultsList.innerHTML = '';
  resultsList.appendChild(li);
}

/* ======================================================================
   EXIBIR LISTA DE CANAIS
====================================================================== */
function displayChannelResults(chs, showExtra = true, auto = false) {

  resultsList.innerHTML = '';
  hideChannelSelection();
  hideVideoList();
  hideVideoSelection();

  chs.slice(0, 7).forEach((ch) => {
    const li = document.createElement('li');

    const img = document.createElement('img');
    img.className = 'channel-image';
    img.src       = ch.snippet.thumbnails.default.url;
    img.alt       = ch.snippet.title;

    const text = document.createElement('div');
    text.style = 'display:flex;flex-direction:column;justify-content:center;align-items:flex-start;';

    const name = document.createElement('span');
    name.style.fontWeight = 'bold';
    name.textContent      = shortenTitleForList(ch.snippet.title);

    const subs = document.createElement('span');
    subs.innerHTML = `<strong>${formatLargeNumber(ch.statistics?.subscriberCount)}</strong> inscritos`;

    text.append(name, subs);
    li.append(img, text);

    if (auto) showSelectedChannel(ch);
    else      li.onclick = () => showSelectedChannel(ch);

    resultsList.appendChild(li);
  });

  if (showExtra) {
    const li  = document.createElement('li');
    li.style   = 'cursor:default;text-align:center;border:none;margin-bottom:0;';

    const btn = document.createElement('button');
    btn.className = 'load-more-btn';
    btn.textContent = 'Não é nenhum desses canais? Cole o link de vídeo e refaça a busca';
    btn.onclick = (e) => { e.preventDefault(); searchInput.focus(); };

    li.appendChild(btn);
    resultsList.appendChild(li);
  }
}

/* ======================================================================
   SELECIONAR CANAL
====================================================================== */
function showSelectedChannel(ch) {

  resultsList.innerHTML = '';

  selectedChannelContainer.classList.remove('hidden');
  selectedChannelTitle.style.display = 'block';
  selectedChannelElement.innerHTML   = '';

  currentSelectedChannel = ch;
  currentChannelId       = ch.id;

  const box = document.createElement('div');
  box.style = 'display:flex;flex-direction:column;align-items:center;';

  const img = document.createElement('img');
  img.src   = ch.snippet.thumbnails.default.url;
  img.alt   = ch.snippet.title;
  img.style = 'width:80px;height:80px;border-radius:50%;margin-bottom:8px;';

  const name = document.createElement('span');
  name.style.fontWeight    = 'bold';
  name.style.marginBottom  = '4px';
  name.style.textAlign     = 'center';
  name.textContent         = shortenTitleForSelected(ch.snippet.title);

  const subs = document.createElement('span');
  subs.style.textAlign = 'center';
  subs.innerHTML       = `<strong>${formatLargeNumber(ch.statistics?.subscriberCount)}</strong> inscritos`;

  box.append(img, name, subs);
  selectedChannelElement.appendChild(box);

  /* -------- Registra busca no  Google Sheets -------- */
  const channelLink = `https://www.youtube.com/channel/${currentChannelId}`;
  sendToSheets(channelLink);
}

function hideChannelSelection() {
  selectedChannelContainer.classList.add('hidden');
  selectedChannelElement.innerHTML = '';
}

/* ======================================================================
   BOTÃO AUMENTAR INSCRITOS
====================================================================== */
increaseSubscribersBtn.onclick = () => {
  if (!currentSelectedChannel) {
    alert('Selecione um canal primeiro.');
    return;
  }

  const box = selectedChannelElement.querySelector('div');
  if (!box) return;

  /* Remove componentes antigos (caso usuário clique de novo) */
  box.querySelector('.copy-link-btn')?.remove();
  box.querySelector('.copy-link-info')?.remove();
  box.querySelector('.redirect-count')?.remove();

  const btn = document.createElement('button');
  btn.className = 'copy-link-btn';
  btn.innerHTML = `IMPULSIONAR INSCRITOS ${ICONS.copy}`;

  btn.onclick = () => {
    const rawSubs = currentSelectedChannel.statistics?.subscriberCount || 0;
    const link    = `https://www.youtube.com/channel/${currentSelectedChannel.id}`;

    const clipboardText = `Canal(YouTube): ${currentSelectedChannel.snippet.title}
Número Inscritos atuais: ${formatLargeNumber(rawSubs)} Inscritos.
Link do canal: ${link}`;

    navigator.clipboard.writeText(clipboardText)
      .then(() => {
        btn.style.background = 'linear-gradient(135deg,#6eea92,#28a745)';
        btn.style.color      = '#fff';
        btn.innerHTML        = `Ok! Redirecionando para os pacotes${ICONS.check}`;
        startCountdown('inscritos', btn.parentElement);
      })
      .catch((err) => alert('Erro ao copiar: ' + err));
  };

  const info = document.createElement('div');
  info.className = 'copy-link-info';
  info.textContent = 'Canal conectado';

  const red = document.createElement('div');
  red.className = 'redirect-count hidden';

  box.append(btn, info, red);
};

/* ======================================================================
   BOTÃO AUMENTAR VISUALIZAÇÕES
====================================================================== */
increaseViewsBtn.onclick = () => {
  if (!currentChannelId) {
    alert('Selecione um canal primeiro.');
    return;
  }

  loading.textContent = 'Processando vídeos...';
  loading.classList.remove('hidden');

  hideVideoSelection();
  nextPageToken       = null;
  videoResults.innerHTML = '';

  fetchChannelVideos(currentChannelId, maxResultsPerPage);
};

/* ======================================================================
   CONTAGEM + REDIRECIONAMENTO
====================================================================== */
function startCountdown(anchor, parent) {
  const div = parent.querySelector('.redirect-count');
  if (!div) return;

  if (anchor === 'inscritos') clearInterval(channelCountdownInterval);
  else                         clearInterval(videoCountdownInterval);

  let c = 3;
  div.classList.remove('hidden');
  div.textContent = `Redirecionando para os pacotes ${c}`;

  const it = setInterval(() => {
    c--;
    if (c <= 0) {
      clearInterval(it);
      div.classList.add('hidden');
      div.textContent = '';
      goToAnchor(anchor);
    } else {
      div.textContent = `Redirecionando para os pacotes ${c}`;
    }
  }, 1000);

  if (anchor === 'inscritos') channelCountdownInterval = it;
  else                        videoCountdownInterval   = it;
}

/* ======================================================================
   VÍDEOS & PAGINAÇÃO
====================================================================== */
function fetchChannelVideos(id, max) {
  let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${id}&order=date&type=video&maxResults=${max}&key=${apiKey}`;
  if (nextPageToken) url += `&pageToken=${nextPageToken}`;

  fetch(url)
    .then((r) => r.json())
    .then((d) => {
      loading.classList.add('hidden');

      if (!d.items?.length) {
        videoResults.innerHTML = '<li>Nenhum vídeo encontrado.</li>';
        return;
      }

      nextPageToken = d.nextPageToken || null;
      const ids     = d.items.map((i) => i.id.videoId).join(',');

      fetchVideoStats(ids, d.items);
    })
    .catch(() => {
      loading.classList.add('hidden');
      videoResults.innerHTML = '<li>Erro ao buscar vídeos.</li>';
    });
}

function fetchVideoStats(ids, items) {
  fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${ids}&key=${apiKey}`)
    .then((r) => r.json())
    .then((d) => {
      const map = {};
      d.items.forEach((v) => { map[v.id] = v.statistics; });

      showVideoList(items, map);

      videoListContainer.classList.remove('hidden');
      checkScroll();
    })
    .catch(() => {
      videoResults.innerHTML = '<li>Erro ao buscar estatísticas.</li>';
    });
}

function showVideoList(items, map) {
  items.forEach((it) => {
    const li = document.createElement('li');

    const thumb = document.createElement('img');
    thumb.className = 'video-thumbnail';
    thumb.src = it.snippet.thumbnails.medium?.url || it.snippet.thumbnails.default.url;
    thumb.alt = it.snippet.title;

    const text = document.createElement('div');
    text.style = 'display:flex;flex-direction:column;align-items:flex-start;';

    const title = document.createElement('span');
    title.style.fontWeight = 'bold';
    title.textContent = shortenTitleForList(it.snippet.title);

    const views = document.createElement('span');
    views.innerHTML = `<strong>${formatLargeNumber(map[it.id.videoId]?.viewCount || 0)}</strong> visualizações`;

    text.append(title, views);
    li.append(thumb, text);

    li.onclick = () => {
      currentSelectedVideoLi?.classList.remove('selected-video-item');
      li.classList.add('selected-video-item');
      currentSelectedVideoLi = li;
      showSelectedVideo(it, map[it.id.videoId] || {});
    };

    videoResults.appendChild(li);
  });
}

/* ======================================================================
   VIDEO LIST SCROLL (carregar +)
====================================================================== */
function checkScroll() {
  const bottom = videoResults.scrollTop + videoResults.clientHeight >= videoResults.scrollHeight - 5;
  loadMoreVideosBtn.classList.toggle('hidden', !(bottom && nextPageToken));
}
videoResults.addEventListener('scroll', checkScroll);

loadMoreVideosBtn.onclick = () => {
  if (currentChannelId && nextPageToken) {
    loading.textContent = 'Processando vídeos...';
    loading.classList.remove('hidden');
    fetchChannelVideos(currentChannelId, maxResultsPerPage);
  }
};

/* ======================================================================
   SELECIONAR VÍDEO
====================================================================== */
function showSelectedVideo(it, stats) {
  selectedVideoContainer.classList.remove('hidden');
  selectedVideoTitle.style.display = 'block';
  selectedVideoElement.innerHTML   = '';

  const box = document.createElement('div');
  box.style = 'display:flex;flex-direction:column;align-items:center;';

  const img = document.createElement('img');
  img.src   = it.snippet.thumbnails.medium?.url || it.snippet.thumbnails.default.url;
  img.alt   = it.snippet.title;
  img.style = 'width:auto;height:120px;object-fit:contain;border-radius:4px;margin-bottom:8px;';

  const title = document.createElement('span');
  title.style.fontWeight  = 'bold';
  title.style.marginBottom = '4px';
  title.style.textAlign    = 'center';
  title.textContent        = shortenTitleForSelected(it.snippet.title);

  const views = document.createElement('span');
  views.style.textAlign = 'center';
  views.innerHTML = `<strong>${formatLargeNumber(stats.viewCount || 0)}</strong> visualizações`;

  box.append(img, title, views);

  const btn = document.createElement('button');
  btn.className = 'copy-link-btn';
  btn.innerHTML = `IMPULSIONAR VISUALIZAÇÕES ${ICONS.copy}`;
  btn.style.marginTop = '10px';

  btn.onclick = () => {
    const channelLink = `https://www.youtube.com/channel/${currentChannelId}`;
    const videoLink   = `https://www.youtube.com/watch?v=${it.id.videoId}`;
    const linkConcat  = `${channelLink} / ${videoLink}`;

    const clipboardText = `Vídeo: ${it.snippet.title}
Quantidade Visualizações atuais: ${formatLargeNumber(stats.viewCount || 0)} Visualizações.
Link do canal: ${channelLink}
Link do vídeo: ${videoLink}`;

    navigator.clipboard.writeText(clipboardText)
      .then(() => {
        btn.style.background = 'linear-gradient(135deg,#6eea92,#28a745)';
        btn.style.color      = '#fff';
        btn.innerHTML        = `Ok! Redirecionando para os pacotes${ICONS.check}`;
        startCountdown('visualizacao', btn.parentElement);

        /* ----- registra busca com canal + vídeo ----- */
        sendToSheets(linkConcat);
      })
      .catch((err) => alert('Erro ao copiar: ' + err));
  };

  const info = document.createElement('div');
  info.className = 'copy-link-info';
  info.textContent = 'Canal Conectado';

  const red = document.createElement('div');
  red.className = 'redirect-count hidden';

  box.append(btn, info, red);
  selectedVideoElement.appendChild(box);

  selectedVideoContainer.scrollIntoView({ behavior: 'smooth' });
}

/* ======================================================================
   ESCONDER / REINICIAR SEÇÕES
====================================================================== */
function hideVideoSelection() {
  selectedVideoContainer.classList.add('hidden');
  selectedVideoElement.innerHTML = '';
  currentSelectedVideoLi?.classList.remove('selected-video-item');
  currentSelectedVideoLi = null;
}
function hideVideoList() {
  videoListContainer.classList.add('hidden');
  videoResults.innerHTML         = '';
  loadMoreVideosBtn.classList.add('hidden');
  currentSelectedVideoLi?.classList.remove('selected-video-item');
  currentSelectedVideoLi = null;
}
