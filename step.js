<script>
/* ======================================================================
   CONFIGURAÇÕES BÁSICAS
====================================================================== */
const apiKey            = 'AIzaSyBrh6IH7du62CW96ODFNqHDOv0zgFTpv7Q';

/* ---------- Config da tabela Airtable ----------- */
const AIRTABLE_BASE     = 'appQ3o0zL8k1P2mAf';   // ID do base
const AIRTABLE_TABLE    = 'busca';               // Nome da tabela
const AIRTABLE_TOKEN    = 'pat13PZ9vr7WdIIPX.da21431a4a8a37bb9b5976b945f9da6b2e76bd6b757610e5b50dc6533ea14b54';

/* ======================================================================
   ÍCONES SVG
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
    </svg>`,
  check: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
         style="width:1em;height:1em;fill:#007bff;margin-left:6px;vertical-align:middle">
      <path d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
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
increaseSubscribersBtn.innerHTML = `Aumentar Inscritos ${ICONS.subscribers}`;
increaseViewsBtn.innerHTML       = `Aumentar Visualizações ${ICONS.views}`;

/* ======================================================================
   VARIÁVEIS DE ESTADO
====================================================================== */
let currentSelectedChannel   = null;
let currentChannelId         = null;
let nextPageToken            = null;
let maxResultsPerPage        = 10;

let currentSelectedVideoLi   = null;
let channelCountdownInterval = null;
let videoCountdownInterval   = null;

/* ---- Controle local para evitar registros duplicados ---- */
const savedLinks = new Set();

/* ======================================================================
   FUNÇÕES UTILITÁRIAS
====================================================================== */
const shortenTitleForList     = t => (t.length > 35 ? t.slice(0, 33) + "..." : t);
const shortenTitleForSelected = t => (t.length > 35 ? t.slice(0, 35) + "..." : t);
const formatLargeNumber       = n => (+n || 0).toLocaleString('pt-BR');
const isYouTubeLink           = s => /youtube\.com|youtu\.be/.test(s);

function goToAnchor(anchorId){
  const el=document.getElementById(anchorId);
  if(el) el.scrollIntoView({behavior:'smooth'});
  history.replaceState(null,null,'#'+anchorId);
}

/* ---------- Formata data/hora p/ 26/04/2025 (03:37) ---------- */
function getDateHourString(){
  const now = new Date();
  const tz  = 'America/Recife';
  const date = now.toLocaleDateString('pt-BR',{timeZone:tz});
  const hour = now.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit',timeZone:tz});
  return `${date} (${hour})`;
}

/* ---------- Envia registro ao Airtable ---------- */
function sendToAirtable(linkStr){
  if(savedLinks.has(linkStr)) return;          // evita duplicados locais
  fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${encodeURIComponent(AIRTABLE_TABLE)}`,{
    method: 'POST',
    headers:{
      'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
      'Content-Type' : 'application/json'
    },
    body: JSON.stringify({
      records:[{
        fields:{
          'data e hora'  : getDateHourString(),
          'link do canal': linkStr
        }
      }]
    })
  })
  .then(r=>r.json())
  .then(()=>savedLinks.add(linkStr))
  .catch(err=>console.error('Erro Airtable:',err));
}

/* ======================================================================
   PLACEHOLDER PISCANTE
====================================================================== */
let basePlaceholder="Busque seu canal";
let blinkInt=null;
let blinkStarted=false;

function startBlink(){
  if(blinkStarted) return;
  blinkStarted=true;
  let on=true;
  blinkInt=setInterval(()=>{
    searchInput.setAttribute("placeholder",(on?"| ":"  ")+basePlaceholder);
    on=!on;
  },500);
}
function triggerBlink(){ if(!searchInput.value.trim()) startBlink(); }
document.addEventListener('mousemove',triggerBlink);
document.addEventListener('click',triggerBlink);
searchInput.addEventListener('focus',triggerBlink);

searchInput.addEventListener('input',()=>{
  const hasTxt=!!searchInput.value.trim();
  searchButton.disabled=!hasTxt;
  searchButton.classList.toggle('inactive-button',!hasTxt);
  searchInput.classList.toggle('typing',hasTxt);
  if(hasTxt){
    clearInterval(blinkInt); blinkInt=null;
    searchInput.setAttribute("placeholder",basePlaceholder);
  }else if(blinkStarted&&!blinkInt) startBlink();
});

/* ======================================================================
   REINICIAR ESTADO EM NOVA BUSCA
====================================================================== */
searchButton.addEventListener('click',()=>{
  currentSelectedChannel=null;
  currentChannelId=null;
  currentSelectedVideoLi?.classList.remove('selected-video-item');
  currentSelectedVideoLi=null;
  clearInterval(channelCountdownInterval);
  clearInterval(videoCountdownInterval);
  channelCountdownInterval=videoCountdownInterval=null;
});

/* ======================================================================
   BUSCA PRINCIPAL
====================================================================== */
searchButton.addEventListener('click',()=>{
  const q=searchInput.value.trim();
  if(!q) return;
  loading.textContent="Buscando canal...";
  loading.classList.remove('hidden');
  hideChannelSelection(); hideVideoList(); hideVideoSelection();
  resultsList.innerHTML='';
  handleSearch(q);
});

function handleSearch(q){
  if(isYouTubeLink(q)){
    const type=getLinkType(q);
    if(type==='channel')            getFromChannelLink(q,true);
    else if(type==='video'||type==='shorts'){
      const id=extractVideoId(q);
      id?getFromVideo(id,true):showError('Link de vídeo inválido.');
    }else showError('Link do YouTube inválido.');
    return;
  }
  searchChannels(q);
}

function showError(msg){
  resultsList.innerHTML=`<li>${msg}</li>`;
  loading.classList.add('hidden');
}

/* ======================================================================
   HELPERS – LINK
====================================================================== */
function getLinkType(link){
  if(/\/channel\/|\/@/.test(link)) return 'channel';
  if(/\/shorts\//.test(link))      return 'shorts';
  if(/\/watch|youtu\.be|\/embed\//.test(link)) return 'video';
  return 'unknown';
}
function extractVideoId(link){
  try{
    const {pathname,searchParams}=new URL(link);
    if(pathname==='/watch')           return searchParams.get('v');
    if(link.includes('youtu.be'))     return pathname.split('/')[1].split('?')[0];
    if(pathname.startsWith('/embed/'))return pathname.split('/')[2].split('?')[0];
    if(pathname.startsWith('/shorts/'))return pathname.split('/')[2].split('?')[0];
  }catch{}
  return null;
}

/* ======================================================================
   FLUXO CANAL
====================================================================== */
function getFromChannelLink(link,auto=false){
  try{
    const {pathname}=new URL(link);
    if(pathname.startsWith('/channel/'))return fetchChannelById(pathname.split('/')[2],auto,true);
    if(pathname.startsWith('/@'))       return fetchByHandle(pathname.slice(2),auto);
  }catch{}
  showError('Link de canal inválido.');
}
function fetchByHandle(handle,auto=false){
  fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=@${handle}&type=channel&maxResults=1&key=${apiKey}`)
    .then(r=>r.json())
    .then(d=>{
      loading.classList.add('hidden');
      d.items?.length?fetchChannelDetails(d.items[0].id.channelId,auto):showNotFoundBtn();
    }).catch(()=>showError('Erro ao buscar canal.'));
}
function getFromVideo(id,auto=false){
  fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${apiKey}`)
    .then(r=>r.json())
    .then(d=>{
      loading.classList.add('hidden');
      d.items?.length?fetchChannelDetails(d.items[0].snippet.channelId,auto):showError('Vídeo não encontrado.');
    }).catch(()=>showError('Erro ao buscar vídeo.'));
}
function fetchChannelById(id,auto=false,isLink=false){
  fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${id}&key=${apiKey}`)
    .then(r=>r.json())
    .then(d=>{
      loading.classList.add('hidden');
      d.items?.length?fetchChannelDetails(id,auto)
                     :(isLink?showNotFoundBtn():showError('Canal não encontrado.'));
    }).catch(()=>showError('Erro ao buscar canal.'));
}
function fetchChannelDetails(id,auto=false){
  fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${id}&key=${apiKey}`)
    .then(r=>r.json())
    .then(d=>{
      loading.classList.add('hidden');
      d.items?.length?displayChannelResults(d.items,!auto,auto):showError('Canal não encontrado.');
    }).catch(()=>showError('Erro ao buscar detalhes do canal.'));
}
function searchChannels(q){
  fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(q)}&maxResults=7&key=${apiKey}`)
    .then(r=>r.json())
    .then(d=>{
      loading.classList.add('hidden');
      d.items?.length?fetchStatsForSearch(d.items):showNotFoundBtn();
    }).catch(()=>showError('Erro ao buscar canais. Tente novamente mais tarde.'));
}

function showNotFoundBtn(){
  const li=document.createElement('li');
  li.style="cursor:default;text-align:center;border:none;margin-bottom:0;";
  const btn=document.createElement('button');
  btn.className='load-more-btn';
  btn.textContent="Canal não encontrado. Cole o link de um vídeo de seu canal e refaça a busca.";
  btn.onclick=()=>searchInput.focus();
  li.appendChild(btn);
  resultsList.innerHTML='';
  resultsList.appendChild(li);
}
function fetchStatsForSearch(arr){
  const ids=arr.map(c=>c.id.channelId).join(',');
  fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${ids}&key=${apiKey}`)
    .then(r=>r.json())
    .then(d=>{
      d.items?.length?displayChannelResults(d.items,true):showError('Não foi possível obter estatísticas dos canais.');
    }).catch(()=>showError('Erro ao buscar estatísticas dos canais.'));
}

/* ======================================================================
   EXIBIR LISTA DE CANAIS
====================================================================== */
function displayChannelResults(chs,showExtra=true,auto=false){
  resultsList.innerHTML='';
  hideChannelSelection(); hideVideoList(); hideVideoSelection();

  chs.slice(0,7).forEach(ch=>{
    const li=document.createElement('li');

    const img=document.createElement('img');
    img.className='channel-image';
    img.src=ch.snippet.thumbnails.default.url;
    img.alt=ch.snippet.title;

    const text=document.createElement('div');
    text.style="display:flex;flex-direction:column;justify-content:center;align-items:flex-start;";

    const name=document.createElement('span');
    name.style.fontWeight='bold';
    name.textContent=shortenTitleForList(ch.snippet.title);

    const subs=document.createElement('span');
    subs.innerHTML=`<strong>${formatLargeNumber(ch.statistics?.subscriberCount)}</strong> inscritos`;

    text.append(name,subs);
    li.append(img,text);

    auto?showSelectedChannel(ch):li.onclick=()=>showSelectedChannel(ch);
    resultsList.appendChild(li);
  });

  if(showExtra){
    const li=document.createElement('li');
    li.style="cursor:default;text-align:center;border:none;margin-bottom:0;";
    const btn=document.createElement('button');
    btn.className='load-more-btn';
    btn.textContent="Não é nenhum desses canais? Cole o link de vídeo e refaça a busca";
    btn.onclick=e=>{e.preventDefault();searchInput.focus();};
    li.appendChild(btn);
    resultsList.appendChild(li);
  }
}

/* ======================================================================
   SELECIONAR CANAL
====================================================================== */
function showSelectedChannel(ch){
  resultsList.innerHTML='';
  selectedChannelContainer.classList.remove('hidden');
  selectedChannelTitle.style.display='block';
  selectedChannelElement.innerHTML='';

  currentSelectedChannel=ch;
  currentChannelId=ch.id;

  const box=document.createElement('div');
  box.style="display:flex;flex-direction:column;align-items:center;";

  const img=document.createElement('img');
  img.src=ch.snippet.thumbnails.default.url;
  img.alt=ch.snippet.title;
  img.style="width:80px;height:80px;border-radius:50%;margin-bottom:8px;";

  const name=document.createElement('span');
  name.style="font-weight:bold;margin-bottom:4px;text-align:center;";
  name.textContent=shortenTitleForSelected(ch.snippet.title);

  const subs=document.createElement('span');
  subs.style="text-align:center;";
  subs.innerHTML=`<strong>${formatLargeNumber(ch.statistics?.subscriberCount)}</strong> inscritos`;

  box.append(img,name,subs);
  selectedChannelElement.appendChild(box);

  /* ----- registra busca no airtable ----- */
  const channelLink=`https://www.youtube.com/channel/${currentChannelId}`;
  sendToAirtable(channelLink);
}

function hideChannelSelection(){
  selectedChannelContainer.classList.add('hidden');
  selectedChannelElement.innerHTML='';
}

/* ======================================================================
   BOTÃO AUMENTAR INSCRITOS
====================================================================== */
increaseSubscribersBtn.onclick=()=>{
  if(!currentSelectedChannel) return alert("Selecione um canal primeiro.");
  const box=selectedChannelElement.querySelector('div');
  if(!box) return;

  box.querySelector('.copy-link-btn')?.remove();
  box.querySelector('.copy-link-info')?.remove();
  box.querySelector('.redirect-count')?.remove();

  const btn=document.createElement('button');
  btn.className='copy-link-btn';
  btn.innerHTML=`Copiar Link do canal ${ICONS.copy}`;

  btn.onclick=()=>{
    const rawSubs=currentSelectedChannel.statistics?.subscriberCount||0;
    const link=`https://www.youtube.com/channel/${currentSelectedChannel.id}`;
    const clipboardText=
`Canal(YouTube): ${currentSelectedChannel.snippet.title}
Número Inscritos atuais: ${formatLargeNumber(rawSubs)} Inscritos.
Link do canal: ${link}`;
    navigator.clipboard.writeText(clipboardText)
      .then(()=>{
        btn.style.background="linear-gradient(135deg,#6eea92,#28a745)";
        btn.style.color="#fff";
        btn.innerHTML=`Informações Copiadas ${ICONS.check}`;
        startCountdown('inscritos',btn.parentElement);
      })
      .catch(err=>alert("Erro ao copiar: "+err));
  };

  const info=document.createElement('div');
  info.className='copy-link-info';
  info.textContent="Cole essas informações na página seguinte da finalização da compra (opcional)";

  const red=document.createElement('div');
  red.className='redirect-count hidden';

  box.append(btn,info,red);
};

/* ======================================================================
   BOTÃO AUMENTAR VISUALIZAÇÕES
====================================================================== */
increaseViewsBtn.onclick=()=>{
  if(!currentChannelId) return alert("Selecione um canal primeiro.");
  loading.textContent="Processando vídeos...";
  loading.classList.remove('hidden');
  hideVideoSelection();
  nextPageToken=null;
  videoResults.innerHTML='';
  fetchChannelVideos(currentChannelId,maxResultsPerPage);
};

/* ======================================================================
   CONTAGEM + REDIRECIONAMENTO
====================================================================== */
function startCountdown(anchor,parent){
  const div=parent.querySelector('.redirect-count');
  if(!div) return;

  if(anchor==='inscritos') clearInterval(channelCountdownInterval);
  else clearInterval(videoCountdownInterval);

  let c=3;
  div.classList.remove('hidden');
  div.textContent=`Redirecionando para os pacotes ${c}`;

  const it=setInterval(()=>{
    c--;
    if(c<=0){
      clearInterval(it);
      div.classList.add('hidden'); div.textContent='';
      goToAnchor(anchor);
    }else div.textContent=`Redirecionando para os pacotes ${c}`;
  },1000);

  anchor==='inscritos'?channelCountdownInterval=it:videoCountdownInterval=it;
}

/* ======================================================================
   VÍDEOS & PAGINAÇÃO
====================================================================== */
function fetchChannelVideos(id,max){
  let url=`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${id}&order=date&type=video&maxResults=${max}&key=${apiKey}`;
  if(nextPageToken) url+=`&pageToken=${nextPageToken}`;
  fetch(url)
    .then(r=>r.json())
    .then(d=>{
      loading.classList.add('hidden');
      if(!d.items?.length){ videoResults.innerHTML='<li>Nenhum vídeo encontrado.</li>'; return; }
      nextPageToken=d.nextPageToken||null;
      const ids=d.items.map(i=>i.id.videoId).join(',');
      fetchVideoStats(ids,d.items);
    }).catch(()=>{loading.classList.add('hidden');videoResults.innerHTML='<li>Erro ao buscar vídeos.</li>';});
}
function fetchVideoStats(ids,items){
  fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${ids}&key=${apiKey}`)
    .then(r=>r.json())
    .then(d=>{
      const map={}; d.items.forEach(v=>map[v.id]=v.statistics);
      showVideoList(items,map);
      videoListContainer.classList.remove('hidden');
      checkScroll();
    }).catch(()=>videoResults.innerHTML='<li>Erro ao buscar estatísticas.</li>');
}
function showVideoList(items,map){
  items.forEach(it=>{
    const li=document.createElement('li');

    const thumb=document.createElement('img');
    thumb.className='video-thumbnail';
    thumb.src=it.snippet.thumbnails.medium?.url||it.snippet.thumbnails.default.url;
    thumb.alt=it.snippet.title;

    const text=document.createElement('div');
    text.style="display:flex;flex-direction:column;align-items:flex-start;";

    const title=document.createElement('span');
    title.style.fontWeight='bold';
    title.textContent=shortenTitleForList(it.snippet.title);

    const views=document.createElement('span');
    views.innerHTML=`<strong>${formatLargeNumber(map[it.id.videoId]?.viewCount||0)}</strong> visualizações`;

    text.append(title,views);
    li.append(thumb,text);

    li.onclick=()=>{
      currentSelectedVideoLi?.classList.remove('selected-video-item');
      li.classList.add('selected-video-item');
      currentSelectedVideoLi=li;
      showSelectedVideo(it,map[it.id.videoId]||{});
    };

    videoResults.appendChild(li);
  });
}

/* ======================================================================
   VIDEO LIST SCROLL
====================================================================== */
function checkScroll(){
  const bottom=videoResults.scrollTop+videoResults.clientHeight>=videoResults.scrollHeight-5;
  loadMoreVideosBtn.classList.toggle('hidden',!(bottom&&nextPageToken));
}
videoResults.addEventListener('scroll',checkScroll);
loadMoreVideosBtn.onclick=()=>{
  if(currentChannelId&&nextPageToken){
    loading.textContent="Processando vídeos...";
    loading.classList.remove('hidden');
    fetchChannelVideos(currentChannelId,maxResultsPerPage);
  }
};

/* ======================================================================
   SELECIONAR VÍDEO
====================================================================== */
function showSelectedVideo(it,stats){
  selectedVideoContainer.classList.remove('hidden');
  selectedVideoTitle.style.display='block';
  selectedVideoElement.innerHTML='';

  const box=document.createElement('div');
  box.style="display:flex;flex-direction:column;align-items:center;";

  const img=document.createElement('img');
  img.src=it.snippet.thumbnails.medium?.url||it.snippet.thumbnails.default.url;
  img.alt=it.snippet.title;
  img.style="width:auto;height:120px;object-fit:contain;border-radius:4px;margin-bottom:8px;";

  const title=document.createElement('span');
  title.style="font-weight:bold;margin-bottom:4px;text-align:center;";
  title.textContent=shortenTitleForSelected(it.snippet.title);

  const views=document.createElement('span');
  views.style="text-align:center;";
  views.innerHTML=`<strong>${formatLargeNumber(stats.viewCount||0)}</strong> visualizações`;

  box.append(img,title,views);

  const btn=document.createElement('button');
  btn.className='copy-link-btn';
  btn.innerHTML=`Copiar Link do vídeo ${ICONS.copy}`;
  btn.style.marginTop='10px';

  btn.onclick=()=>{
    const channelLink = `https://www.youtube.com/channel/${currentChannelId}`;
    const videoLink   = `https://www.youtube.com/watch?v=${it.id.videoId}`;
    const linkConcat  = `${channelLink} / ${videoLink}`;

    const clipboardText=
`Vídeo: ${it.snippet.title}
Quantidade Visualizações atuais: ${formatLargeNumber(stats.viewCount||0)} Visualizações.
Link do canal: ${channelLink}
Link do vídeo: ${videoLink}`;
    navigator.clipboard.writeText(clipboardText)
      .then(()=>{
        btn.style.background="linear-gradient(135deg,#6eea92,#28a745)";
        btn.style.color="#fff";
        btn.innerHTML=`Informações Copiadas ${ICONS.check}`;
        startCountdown('visualizacao',btn.parentElement);
        /* ----- registra busca com canal + video ----- */
        sendToAirtable(linkConcat);
      })
      .catch(err=>alert("Erro ao copiar: "+err));
  };

  const info=document.createElement('div');
  info.className='copy-link-info';
  info.textContent="Cole essas informações na página seguinte da finalização da compra (opcional)";

  const red=document.createElement('div');
  red.className='redirect-count hidden';

  box.append(btn,info,red);
  selectedVideoElement.appendChild(box);
  selectedVideoContainer.scrollIntoView({behavior:'smooth'});
}

/* ======================================================================
   ESCONDER / REINICIAR SEÇÕES
====================================================================== */
function hideVideoSelection(){
  selectedVideoContainer.classList.add('hidden');
  selectedVideoElement.innerHTML='';
  currentSelectedVideoLi?.classList.remove('selected-video-item');
  currentSelectedVideoLi=null;
}
function hideVideoList(){
  videoListContainer.classList.add('hidden');
  videoResults.innerHTML='';
  loadMoreVideosBtn.classList.add('hidden');
  currentSelectedVideoLi?.classList.remove('selected-video-item');
  currentSelectedVideoLi=null;
}
</script>
