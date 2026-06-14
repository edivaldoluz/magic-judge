import { Controller, Get, Header } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller()
export class PanelController {
  constructor(private readonly stats: StatsService) {}

  @Get('stats')
  getStats() {
    return this.stats.compute();
  }

  @Get('painel')
  @Header('Content-Type', 'text/html; charset=utf-8')
  getPanel(): string {
    return PANEL_HTML;
  }
}

const PANEL_HTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex">
<title>Magic Judge — Painel de uso</title>
<style>
  :root{
    --bg:#0B0712;--surface:#181024;--surface2:#221735;--border:#3A2C50;
    --text:#EAE4D8;--muted:#A398B3;--gold:#C9A227;--gold2:#E8C75A;--arcane:#B14FC4;
  }
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:var(--bg);color:var(--text);font-family:Inter,-apple-system,Segoe UI,Roboto,sans-serif;padding:24px;line-height:1.5}
  .wrap{max-width:1000px;margin:0 auto}
  h1{font-family:Georgia,serif;font-size:1.6rem;letter-spacing:.02em;margin-bottom:2px}
  .sub{color:var(--muted);font-size:.85rem;margin-bottom:22px}
  .kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:14px;margin-bottom:26px}
  .kpi{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:18px}
  .kpi .v{font-size:2rem;font-weight:700;color:var(--gold2)}
  .kpi .l{font-size:.78rem;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin-top:4px}
  .card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:18px 20px;margin-bottom:22px}
  .card h2{font-size:1rem;margin-bottom:16px;color:var(--gold2);font-family:Georgia,serif}
  #chart{display:flex;align-items:flex-end;gap:6px;height:160px;overflow-x:auto;padding-top:8px}
  .bar{flex:1;min-width:22px;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%}
  .bar .fill{width:70%;background:linear-gradient(180deg,var(--arcane),#6a2f8a);border-radius:4px 4px 0 0;min-height:2px;transition:height .3s}
  .bar span{font-size:.62rem;color:var(--muted);margin-top:6px;white-space:nowrap}
  .trow{display:flex;align-items:center;gap:12px;margin-bottom:10px}
  .tname{width:200px;font-size:.85rem;font-family:ui-monospace,monospace}
  .tbar{flex:1;background:var(--surface2);border-radius:6px;height:14px;overflow:hidden}
  .tfill{height:100%;background:linear-gradient(90deg,var(--gold),#a07f1a)}
  .tcount{width:46px;text-align:right;font-size:.85rem;color:var(--gold2)}
  table{width:100%;border-collapse:collapse;font-size:.82rem}
  th,td{text-align:left;padding:7px 10px;border-bottom:1px solid var(--border)}
  th{color:var(--muted);font-weight:600;text-transform:uppercase;font-size:.7rem;letter-spacing:.05em}
  td{font-family:ui-monospace,monospace}
  .muted{color:var(--muted)}
  .foot{color:var(--muted);font-size:.75rem;margin-top:18px;text-align:center}
</style>
</head>
<body>
<div class="wrap">
  <h1>⚖️ Magic Judge — Painel de uso</h1>
  <p class="sub">Leitura direta do log de uso (sem banco). Horário de São Paulo. Atualiza a cada 30s.</p>

  <div class="kpis">
    <div class="kpi"><div class="v" id="k-calls">—</div><div class="l">Chamadas (total)</div></div>
    <div class="kpi"><div class="v" id="k-people">—</div><div class="l">Pessoas (estim.)</div></div>
    <div class="kpi"><div class="v" id="k-tcalls">—</div><div class="l">Chamadas hoje</div></div>
    <div class="kpi"><div class="v" id="k-tpeople">—</div><div class="l">Pessoas hoje</div></div>
  </div>

  <div class="card">
    <h2>Chamadas por dia (últimos 21)</h2>
    <div id="chart"></div>
  </div>

  <div class="card">
    <h2>Ferramentas mais usadas</h2>
    <div id="tools"></div>
  </div>

  <div class="card">
    <h2>Atividade recente</h2>
    <table><thead><tr><th>Quando (SP)</th><th>Ferramenta</th><th>Visitante</th></tr></thead>
    <tbody id="recent"></tbody></table>
  </div>

  <p class="foot">Atualizado em <span id="gen">—</span> · "Visitante" é um hash anônimo do IP (não identifica ninguém).</p>
</div>
<script>
function set(id,v){var el=document.getElementById(id);if(el)el.textContent=v;}
function esc(s){return String(s).replace(/[&<>]/g,function(c){return c==='&'?'&amp;':c==='<'?'&lt;':'&gt;';});}
async function load(){
  try{
    var r=await fetch(location.origin+'/stats',{headers:{'Accept':'application/json'}});
    if(!r.ok){document.body.innerHTML='<p style="color:#E8C75A">Erro ao carregar ('+r.status+')</p>';return;}
    var s=await r.json();
    set('k-calls',s.totalCalls);set('k-people',s.totalPeople);
    set('k-tcalls',s.todayCalls);set('k-tpeople',s.todayPeople);set('gen',s.generatedAt);
    var days=s.days.slice(-21);
    var max=1;for(var i=0;i<days.length;i++){if(days[i].calls>max)max=days[i].calls;}
    var ch='';
    for(var i=0;i<days.length;i++){var d=days[i];var h=Math.round(d.calls/max*100);
      ch+='<div class="bar" title="'+d.day+': '+d.calls+' chamadas, '+d.people+' pessoas"><div class="fill" style="height:'+h+'%"></div><span>'+d.day.slice(8,10)+'/'+d.day.slice(5,7)+'</span></div>';}
    document.getElementById('chart').innerHTML=ch||'<p class="muted">Sem dados ainda.</p>';
    var tmax=1;for(var j=0;j<s.tools.length;j++){if(s.tools[j].calls>tmax)tmax=s.tools[j].calls;}
    var th='';
    for(var j=0;j<s.tools.length;j++){var t=s.tools[j];
      th+='<div class="trow"><span class="tname">'+esc(t.tool)+'</span><div class="tbar"><div class="tfill" style="width:'+Math.round(t.calls/tmax*100)+'%"></div></div><span class="tcount">'+t.calls+'</span></div>';}
    document.getElementById('tools').innerHTML=th||'<p class="muted">—</p>';
    var rh='';
    for(var k=0;k<s.recent.length;k++){var e=s.recent[k];
      rh+='<tr><td>'+esc(e.t)+'</td><td>'+esc(e.tool)+'</td><td class="muted">'+esc(e.cid||'')+'</td></tr>';}
    document.getElementById('recent').innerHTML=rh||'<tr><td colspan="3" class="muted">Sem atividade ainda.</td></tr>';
  }catch(err){document.body.innerHTML='<p style="color:#E8C75A">Falha: '+esc(err)+'</p>';}
}
load();setInterval(load,30000);
</script>
</body>
</html>`;
