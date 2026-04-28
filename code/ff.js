const pwd = document.getElementById('pwd'),
      bar = document.getElementById('bar'),
      strengthText = document.getElementById('strength'),
      entropyText = document.getElementById('entropy'),
      crackText = document.getElementById('crack'),
      unlock = document.getElementById('unlock'),
      consoleEl = document.getElementById('console'),
      finalMessageEl = document.getElementById('finalMessage'),
      progressEl = document.getElementById('progress');

function charsetSize(s){let size=0;if(/[a-z]/.test(s))size+=26;if(/[A-Z]/.test(s))size+=26;if(/[0-9]/.test(s))size+=10;if(/[^a-zA-Z0-9]/.test(s))size+=32;return size||1;}
function calcEntropy(s){return s.length*Math.log2(charsetSize(s));}
function scoreFromEntropy(e){if(e<28)return{label:'Very weak',pct:14};if(e<36)return{label:'Weak',pct:32};if(e<60)return{label:'Moderate',pct:60};if(e<128)return{label:'Strong',pct:84};return{label:'Very strong',pct:100};}

function updateUI(){
  const s=pwd.value||'', e=calcEntropy(s), sc=scoreFromEntropy(e);
  entropyText.textContent=isFinite(e)?e.toFixed(1):'—';
  strengthText.textContent=sc.label;
  bar.style.width=sc.pct+'%';
  unlock.style.opacity=(sc.label==='Very weak'||sc.label==='Weak')?1:0;
}
pwd.addEventListener('input',updateUI);
document.getElementById('toggle').addEventListener('click',()=>{pwd.type==='password'?pwd.type='text':pwd.type='password';});
document.getElementById('clear').addEventListener('click',()=>{pwd.value='';updateUI();pwd.focus();});
document.getElementById('generate').addEventListener('click',()=>{
  const w=['blue','river','moon','tech','hacker','mh2','guard','delta','open'];
  function pick(){return w[Math.floor(Math.random()*w.length)];}
  pwd.value=pick()+pick()+Math.floor(Math.random()*90+10)+String.fromCharCode(33+Math.floor(Math.random()*15));
  updateUI();
});

// Brute-force animation with random characters
document.getElementById('okBtn').addEventListener('click', ()=>{
    const passwordStrength = scoreFromEntropy(calcEntropy(pwd.value||'')).label;
    let attempts=0,maxAttempts=60;
    consoleEl.innerHTML='';
    finalMessageEl.textContent='';
    progressEl.style.width='0%';

    function getRandomChar(){const chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+<>?";return chars.charAt(Math.floor(Math.random()*chars.length));}
    function generateLine(len){let line="";for(let i=0;i<len;i++) line+=getRandomChar(); return line;}

    function step(){
        const lineEl=document.createElement('div');
        lineEl.className='line';
        consoleEl.appendChild(lineEl);
        consoleEl.scrollTop=consoleEl.scrollHeight;

        let subAttempts=0, subMax=10; // flicker frames
        function animateLine(){
            lineEl.textContent=`Attempt ${attempts+1}: ` + generateLine(6);
            subAttempts++;
            if(subAttempts<subMax) setTimeout(animateLine,30);
            else{
                progressEl.style.width=((attempts+1)/maxAttempts*100)+'%';
                attempts++;
                if(attempts<maxAttempts) step();
                else{
                    finalMessageEl.textContent=(passwordStrength==='Very weak'||passwordStrength==='Weak')?'Password cracked! UNLOCKED.':'Brute-force failed! Strong password.';
                }
            }
        }
        animateLine();
    }
    step();
});

updateUI();
