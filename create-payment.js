// /api/create-payment  (Vercel serverless function)
export default async function handler(req, res){
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if(req.method === 'OPTIONS'){ return res.status(200).end(); }
  if(req.method !== 'POST'){ return res.status(405).json({error:'Method not allowed'}); }
  const { plan } = req.body || {};
  if(!plan || !['monthly','quarterly'].includes(plan)){
    return res.status(400).json({error:'Invalid plan'});
  }

  // FreedomPay: здесь нужно создать платёж и получить ссылку на оплату.
  // Ниже МАКЕТ для тестов, без реального обращения к API.
  const orderId = 'test_' + Math.random().toString(36).slice(2, 10);
  const backendBase = process.env.PUBLIC_BACKEND_BASE || '';
  const netlifySuccess = process.env.PUBLIC_SUCCESS_URL || 'https://vpn-private.netlify.app/success.html';

  // Идея: пользователь платит на стороне провайдера, затем редиректит на success.html?orderId=...
  // В тестовом режиме сразу отправим на success:
  const redirectUrl = `${netlifySuccess}?orderId=${orderId}&backend=${encodeURIComponent(backendBase)}`;

  return res.status(200).json({ orderId, redirectUrl });
}