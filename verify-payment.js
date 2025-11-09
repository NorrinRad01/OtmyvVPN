// /api/verify-payment  (callback/webhook макет)
export default async function handler(req, res){
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if(req.method === 'OPTIONS'){ return res.status(200).end(); }
  // В реальной интеграции: проверить подпись/статус платежа от FreedomPay.
  // Макет: всегда успех.
  return res.status(200).json({ ok:true });
}