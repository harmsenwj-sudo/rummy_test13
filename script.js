// Complete game script with 30-second penalty per wrong answer
let timeLeft = 30 * 60;
let timerInterval = null;
let current = 0;
const puzzles = [
 {id:'p1',type:'code',title:'🧗 Klimroute',prompt:'Rummy009 klautert langs een steile rotswand. Hij stijgt eerst 1,7 meter, glijdt daarna 0,4 meter terug, vindt opnieuw grip en klimt 2,3 meter omhoog — om tenslotte nog eens 0,6 meter te verliezen. Hoeveel decimeters heeft hij per saldo afgelegd?',answer:'30'},
 {id:'p2',type:'choice',title:'🥩 T-bone',prompt:'Waar bevindt zich de T-bone?',options:['In de borst','In de schouder','In de lende (short loin)','In de nek'],correct:2},
 {id:'p3',type:'order',title:'🎣 De Vangst',prompt:'Zet in volgorde: vul het juiste getal in (1–5)',items:['Binnenhalen','Wachten','Aanslaan','Uitgooien','Dobber verdwijnt'],correct:['Uitgooien','Wachten','Dobber verdwijnt','Aanslaan','Binnenhalen']},
 {id:'p4',type:'text',title:'Raadsel',prompt:'Ik begin als zaad op het land, word gemalen tot meel en eindig vaak als brood of pasta. Ik voed mensen al duizenden jaren. Wat ben ik?',answer:'graan'},
 {id:'p5',type:'choice',title:'💖 Eva-vraag',prompt:'Wat viel Rummy009 als eerste op aan Eva?',options:['Haar intelligentie','Haar 🍑','Haar spirituele energie','Haar oog voor detail'],correct:1},
 {id:'p6',type:'choice',title:'🌴 Californication',prompt:'Welke thematische betekenis wordt vaak gekoppeld aan “Californication”?',options:['Kritiek op Hollywood en droomvervorming','Autobiografisch verhaal','Metafoor voor natuurbranden','Religieuze beweging'],correct:0},
 {id:'p7',type:'code',title:'🚆 Treinreis',prompt:'Brady reist met de trein naar een onbekende bestemming. Eerst rijdt de trein 30 minuten met een snelheid van 60 km per uur naar station A. Daarna reist hij 30 minuten met 100 km per uur naar station B. Omdat Brady in de verkeerde trein zit, rijdt hij 30 minuten terug met 60 km per uur. Tot slot reist hij nog 30 minuten met 80 km per uur naar zijn eindbestemming. Hoeveel kilometer heeft Brady in totaal met de trein gereisd?',answer:'150'},
 {
    id: 'p9',
    type: 'code',
    title: '⚡ Elektriciteit in het dagelijks leven',
    prompt: 'Rummy009 sluit een klein elektrisch apparaat aan op een stopcontact.

Op het typeplaatje van het apparaat staat dat het 20 watt aan elektrisch vermogen gebruikt. Het apparaat werkt op een spanning van 10 volt.

Rummy009 weet dat bij elektriciteit geldt: Vermogen (P) = spanning (U) × stroomsterkte (I).

Hij wil graag weten hoeveel stroom er door het apparaat loopt om te controleren of het veilig is aangesloten.

Vraag: Hoe groot is de stroomsterkte in ampère?',
    answer: '2'
 }
];
function startGame(){
 document.getElementById('start-screen').style.display='none';
 document.getElementById('game-container').style.display='block';
 document.getElementById('timer').style.display='block';
 startTimer(); render();
}
function startTimer(){
 updateTimerDisplay();
 timerInterval=setInterval(()=>{
 timeLeft--; updateTimerDisplay();
 if(timeLeft<=0){clearInterval(timerInterval);gameOver();}
 },1000);
}
function updateTimerDisplay(){
 const m=Math.floor(timeLeft/60);
 const s=timeLeft%60;
 document.getElementById('timer').innerText=`${m}:${s.toString().padStart(2,'0')}`;
}
function gameOver(){
 document.getElementById('game-container').innerHTML=`<div class='card'><h2>⏳ Tijd is om!</h2><p>Je hebt het niet gehaald…</p></div>`;
}
function render(){
 const p=puzzles[current];
 document.getElementById('progress-bar').style.width=(current/puzzles.length*100)+'%';
 let h=`<div class='card'><h3>${p.title}</h3><p>${p.prompt}</p>`;
 if(p.type==='code' || p.type==='text') h+=`<input id='ans'><button class='btn btn-primary' onclick='check()'>Controleer</button>`;
 if(p.type==='choice') p.options.forEach((o,i)=>h+=`<div class='option' onclick='check(${i})'>${o}</div>`);
 if(p.type==='order'){
 h+='<div>'; p.items.forEach((it,i)=>{
 h+=`<div class='option'>${it}<input class='order-input' id='ord${i}' type='number' min='1' max='${p.items.length}'></div>`;
 }); h+='</div><button class="btn btn-primary" onclick="check()">Controleer</button>';
 }
 h+='</div>'; document.getElementById('card-container').innerHTML=h;
}
function check(v){
 const p=puzzles[current]; let ok=false;
 if(p.type==='code' || p.type==='text') ok=document.getElementById('ans').value.trim().toLowerCase()===p.answer.toLowerCase();
 if(p.type==='choice') ok=v===p.correct;
 if(p.type==='order'){
 const pos=[],order=[];
 for(let i=0;i<p.items.length;i++){
 const num=parseInt(document.getElementById('ord'+i).value);
 if(isNaN(num) || num<1 || num>p.items.length){alert('Gebruik geldige cijfers');return;}
 pos.push(num); order.push({item:p.items[i],pos:num});
 }
 if(new Set(pos).size!==pos.length){alert('Alle cijfers moeten uniek zijn');return;}
 order.sort((a,b)=>a.pos-b.pos);
 ok=JSON.stringify(order.map(e=>e.item))===JSON.stringify(p.correct);
 }
 if(ok){ current++; current<puzzles.length?render():finale(); }
 else{
 timeLeft-=30; if(timeLeft<0) timeLeft=0; updateTimerDisplay();
 alert('Niet goed! 30 seconden tijd kwijt.');
 if(timeLeft===0){ clearInterval(timerInterval); gameOver(); }
 }
}
function finale(){
 document.getElementById('card-container').innerHTML=`<div class='card'><h3>🎉 Finale</h3><p>Je hebt gewonnen!</p><a href='https://maps.app.goo.gl/nzQGDh6HcCBheRLR6'>Volgende locatie</a></div>`;
}