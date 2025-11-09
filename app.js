// Frontend glue for payments (FreedomPay placeholder via Vercel backend)
const BACKEND_BASE = (window.OTMYV_BACKEND || '').replace(/\/$/,''); // set in success docs or env

function createPayment(plan){
  const btn = document.querySelector(`[data-plan="${plan}"]`);
  btn.disabled = true;
  fetch(`${BACKEND_BASE}/api/create-payment`,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({ plan })
  })
  .then(r=>r.json())
  .then(data=>{
    if(data.redirectUrl){
      window.location.href = data.redirectUrl; // to FreedomPay (or mock checkout)
    }else{
      alert('Не удалось создать оплату. Проверьте backend.');
    }
  })
  .catch(e=>{
    console.error(e);
    alert('Ошибка соединения с backend');
  })
  .finally(()=>{ btn.disabled=false; });
}

function toggleMenu() {
  const menu = document.getElementById("mobileMenu");
  menu.style.display = menu.style.display === "flex" ? "none" : "flex";
}