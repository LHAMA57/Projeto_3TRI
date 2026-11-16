const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

const spectrumInfo = {
  "Rádio":"Ondas utilizadas em transmissões de rádio, televisão e comunicação.",
  "Micro-ondas":"Utilizadas em radares, comunicações e aquecimento de alimentos.",
  "Infravermelho":"Associado à radiação térmica emitida pelos corpos.",
  "Visível":"Faixa do espectro que pode ser percebida pelo olho humano.",
  "Ultravioleta":"Radiação com frequência maior que a luz visível.",
  "Raios X":"Radiação de alta energia utilizada em exames de imagem.",
  "Gama":"Radiação de frequência muito elevada e grande energia por fóton."
};
$$("[data-spectrum]").forEach(btn => btn.addEventListener("click", () => {
  $$("[data-spectrum]").forEach(b => {b.classList.remove("active"); b.setAttribute("aria-pressed","false");});
  btn.classList.add("active"); btn.setAttribute("aria-pressed","true");
  $("#spectrumTitle").textContent = btn.dataset.spectrum;
  $("#spectrumText").textContent = spectrumInfo[btn.dataset.spectrum];
}));

const particleScene = $("#particleScene");
const particles = Array.from({length:34}, () => {
  const el=document.createElement("span"); el.className="particle"; particleScene.append(el);
  return {el,x:Math.random()*96,y:Math.random()*86,vx:Math.random()*2-1,vy:Math.random()*2-1};
});
function updateParticles(){
  const temp=Number($("#particleTemp").value);
  $("#particleOutput").textContent=`${temp} °C`;
  const speed=.12+(temp/500)*1.25;
  particles.forEach(p=>{
    p.x+=p.vx*speed;p.y+=p.vy*speed;
    if(p.x<1||p.x>98)p.vx*=-1;if(p.y<1||p.y>96)p.vy*=-1;
    p.el.style.left=p.x+"%";p.el.style.top=p.y+"%";
  });
}
$("#particleTemp").addEventListener("input",updateParticles);updateParticles();
let particleFrame;
function animateParticles(){updateParticles();particleFrame=requestAnimationFrame(animateParticles)}
if(!matchMedia("(prefers-reduced-motion: reduce)").matches) animateParticles();

const sigma=5.670374419e-8;
function calculate(){
  const c=Number($("#calcTemp").value), e=Number($("#emissivity").value), a=Number($("#area").value), k=c+273.15;
  const p=e*sigma*a*Math.pow(k,4);
  $("#calcTempOut").textContent=`${c} °C`;
  $("#emissivityOut").textContent=e.toFixed(2).replace(".",",");
  $("#areaOut").textContent=`${a.toFixed(1).replace(".",",")} m²`;
  $("#kelvinOut").textContent=`Temperatura absoluta: ${k.toFixed(2).replace(".",",")} K`;
  $("#powerOut").textContent=p.toLocaleString("pt-BR",{maximumFractionDigits:2})+" W";
}
["calcTemp","emissivity","area"].forEach(id=>$("#"+id).addEventListener("input",calculate));calculate();

const mechanisms={
 radiacao:["MECANISMO 01","Radiação","A superfície da piscina emite ondas eletromagnéticas, principalmente na faixa do infravermelho. Esse processo não depende da presença de vento."],
 evaporacao:["MECANISMO 02","Evaporação","Moléculas de água passam para o estado gasoso levando energia. A evaporação pode continuar mesmo quando o ar está parado."],
 conveccao:["MECANISMO 03","Convecção","Ocorre troca de calor entre a superfície da água e o ar próximo. Pode existir convecção natural, causada por diferenças de temperatura e densidade."]
};
$$("[data-mechanism]").forEach(btn=>btn.addEventListener("click",()=>{
  $$("[data-mechanism]").forEach(b=>{b.classList.remove("active");b.setAttribute("aria-pressed","false")});
  btn.classList.add("active");btn.setAttribute("aria-pressed","true");
  const data=mechanisms[btn.dataset.mechanism];
  $("#mechanismKicker").textContent=data[0];$("#mechanismTitle").textContent=data[1];$("#mechanismText").textContent=data[2];
}));
$("#coverToggle").addEventListener("click",()=>{
  const active=$("#coverToggle").getAttribute("aria-pressed")!=="true";
  $("#coverToggle").setAttribute("aria-pressed",String(active));
  $("#coverToggle").textContent=active?"Remover cobertura":"Ativar cobertura";
  $("#poolDemo").classList.toggle("covered",active);
  $("#poolDemo").setAttribute("aria-label",active?"Ilustração de piscina com cobertura":"Ilustração de piscina sem cobertura");
  $("#coverStatus").textContent=active?"Cobertura ativada: a barreira ajuda a reduzir principalmente a evaporação e também pode diminuir outras trocas de energia.":"Cobertura desativada: a evaporação ocorre mais livremente.";
});

const dialog=$("#accessDialog");
$("#accessOpen").addEventListener("click",()=>dialog.showModal());
$("#accessClose").addEventListener("click",()=>dialog.close());
$("#fontDown").addEventListener("click",()=>changeFont(-1));
$("#fontUp").addEventListener("click",()=>changeFont(1));
let fontSize=16;
function changeFont(delta){fontSize=Math.min(21,Math.max(14,fontSize+delta));document.documentElement.style.setProperty("--base",fontSize+"px")}
function toggleClass(button,cls){const on=!document.body.classList.contains(cls);document.body.classList.toggle(cls,on);button.setAttribute("aria-pressed",String(on))}
$("#contrastToggle").addEventListener("click",()=>toggleClass($("#contrastToggle"),"high-contrast"));
$("#motionToggle").addEventListener("click",()=>toggleClass($("#motionToggle"),"reduce-motion"));
$("#readingToggle").addEventListener("click",()=>toggleClass($("#readingToggle"),"reading-mode"));
$("#resetAccess").addEventListener("click",()=>{
  fontSize=16;document.documentElement.style.setProperty("--base","16px");
  ["high-contrast","reduce-motion","reading-mode"].forEach(c=>document.body.classList.remove(c));
  ["contrastToggle","motionToggle","readingToggle"].forEach(id=>$("#"+id).setAttribute("aria-pressed","false"));
});


// Alternância entre tema claro e escuro.
// A preferência escolhida fica salva neste navegador.
const themeToggle = $("#themeToggle");
const themeLabel = $("#themeLabel");
const themeIcon = $("#themeIcon");
const savedTheme = localStorage.getItem("site-theme");
const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
function applyTheme(theme){
  const dark = theme === "dark";
  document.body.classList.toggle("dark-theme", dark);
  themeToggle.setAttribute("aria-pressed", String(dark));
  themeToggle.setAttribute("aria-label", dark ? "Ativar modo claro" : "Ativar modo escuro");
  themeLabel.textContent = dark ? "Modo claro" : "Modo escuro";
  themeIcon.textContent = dark ? "☀" : "☾";
}
applyTheme(savedTheme || (prefersDark ? "dark" : "light"));
themeToggle.addEventListener("click",()=>{
  const next = document.body.classList.contains("dark-theme") ? "light" : "dark";
  localStorage.setItem("site-theme",next);
  applyTheme(next);
});
