# OtmyvVPN — сайт + backend для FreedomPay

Этот архив содержит:
- `/web` — статический сайт для Netlify (тёмно‑золотой минимализм)
- `/backend` — серверлес backend для Vercel (интеграция платежей и выдача конфига)

## 1) Деплой фронтенда на Netlify
1. Зайдите в Netlify → ваш сайт → **Deploys** → **Upload folder**.
2. Загрузите папку **/web** (содержимое).
3. Откройте страницу `/tariffs.html` и пропишите адрес backend:
   ```html
   <script>window.OTMYV_BACKEND='https://<ваш‑бекенд>.vercel.app';</script>
   ```

## 2) Деплой backend на Vercel
1. Создайте проект на Vercel и загрузите папку **/backend**.
2. В **Settings → Environment Variables** добавьте:
   - `PUBLIC_BACKEND_BASE` = `https://<your-project>.vercel.app`
   - `ALLOWED_ORIGIN` = `https://vpn-private.netlify.app`
   - `PUBLIC_SUCCESS_URL` = `https://vpn-private.netlify.app/success.html`
3. Задеплойте. Проверьте `GET /api/get-config?orderId=test` — должен вернуть JSON с `configText`.

### Маршруты backend
- `POST /api/create-payment` — создаёт платёж (сейчас макет, сразу редиректит на success).
- `GET  /api/verify-payment` — заглушка вебхука (в проде проверяйте подпись/статус).
- `GET  /api/get-config?orderId=...` — отдаёт конфиг WireGuard (пока шаблон).

## 3) Подключение FreedomPay (когда дадут доступ)
В `create-payment` вместо макета вызовите их API:
- создайте заказ (сумма: 99 ₽ или 199 ₽)
- получите `paymentUrl`
- редиректите пользователя на `paymentUrl`
- настройте `success`/`fail` URLs → на ваш Netlify: `/success.html` и `/error.html`

После успешного платежа:
- FreedomPay дергает ваш `verify-payment` (webhook) → вы отмечаете заказ как оплачен
- `success.html` запрашивает `/api/get-config?orderId=...`
- backend генерирует и отдаёт реальный конфиг WireGuard

## 4) Настройка VPN сервера (Hetzner + WireGuard)
На VPS:
```bash
sudo apt update && sudo apt install -y wireguard qrencode
# Сгенерируйте ключи сервера:
wg genkey | tee server_private.key | wg pubkey > server_public.key
# Настройте /etc/wireguard/wg0.conf (порт 51820) и включите:
sudo systemctl enable wg-quick@wg0 && sudo systemctl start wg-quick@wg0
```
В боевом backend:
- при подтверждении оплаты создавайте peer (IP например 10.66.66.2/32)
- кладите public ключ клиента в `wg set ...`
- собирайте конфиг клиента и отдавайте из `/api/get-config`

## 5) Безопасность
- Никогда не храните секреты в коде, только в переменных окружения Vercel.
- Включите HTTPS и ограничьте CORS доменом Netlify.
- Добавьте простую БД (PlanetScale / Supabase) для хранения заказов.

Удачи!