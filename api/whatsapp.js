/**
 * Karachi Bakery - Serverless Automated WhatsApp Order Dispatch API
 * Sends direct WhatsApp order receipts to customer phone numbers with ZERO clicks required by the customer.
 * 
 * Supports:
 * 1. Meta WhatsApp Business Cloud API (Official)
 * 2. Twilio WhatsApp API
 * 3. UltraMsg Gateway API
 * 4. Automated Direct Dispatch Engine (Simulated instant delivery fallback)
 */

module.exports = async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-whatsapp-token, x-whatsapp-phone-id, x-whatsapp-provider');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Health check & gateway status
  if (req.method === 'GET') {
    const provider = req.headers['x-whatsapp-provider'] || process.env.WHATSAPP_PROVIDER || 'direct_cloud';
    return res.status(200).json({
      success: true,
      service: 'Karachi Bakery Automated WhatsApp Gateway',
      status: 'active',
      zeroClicksMode: true,
      provider: provider,
      supportedProviders: ['meta_cloud_api', 'twilio_whatsapp', 'ultramsg', 'direct_cloud']
    });
  }

  // POST: Send direct automated WhatsApp message
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const action = req.query.action || body.action || 'send_order';

      const rawPhone = (body.phone || body.customerPhone || '').toString().trim();
      const cleanPhone = rawPhone.replace(/[^0-9]/g, '').slice(-10);

      if (!cleanPhone || cleanPhone.length !== 10) {
        return res.status(400).json({
          success: false,
          error: 'Valid 10-digit Indian mobile number is required'
        });
      }

      const formattedTo = `91${cleanPhone}`;
      const customerName = body.customerName || body.name || 'Valued Customer';
      const orderId = body.orderId || `KB-ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const amount = Number(body.amount || 0).toLocaleString('en-IN');
      const paymentId = body.paymentId || 'pay_rzp_verified';
      const paymentMethod = body.paymentMethod || 'Razorpay Online';
      const address = body.address || 'Hyderabad Flagship Zone';
      const deliveryDate = body.deliveryDate || 'Tomorrow, by 1:00 PM';
      const items = Array.isArray(body.items) ? body.items.join(', ') : (body.items || 'Original Hyderabad Fruit Biscuits (400g Tin)');

      // Royal Karachi Bakery Official Order Confirmation Message
      const messageBody = 
`🎉 *Karachi Bakery (Est. 1953) — Order Confirmation* 🎉

Dear *${customerName}*,
Thank you for choosing Karachi Bakery! Your order is confirmed and is being freshly prepared in our central kitchen.

📦 *Order Reference:* ${orderId}
💳 *Payment Reference:* ${paymentId} (${paymentMethod})
💰 *Amount Paid:* ₹${amount}
📍 *Delivery Address:* ${address}
🚚 *Estimated Delivery:* ${deliveryDate}
🍰 *Items Ordered:* ${items}

🔍 *Track Live Baking & Dispatch Status:*
https://karachi-bakery-website-redesign.vercel.app

Need support? Contact Karachi Bakery Care: care@karachibakery.com | 040-6666-1953`;

      // Check external provider credentials if configured
      const metaToken = req.headers['x-whatsapp-token'] || process.env.WHATSAPP_CLOUD_TOKEN;
      const metaPhoneId = req.headers['x-whatsapp-phone-id'] || process.env.WHATSAPP_PHONE_NUMBER_ID;

      const twilioSid = req.headers['x-twilio-sid'] || process.env.TWILIO_ACCOUNT_SID;
      const twilioToken = req.headers['x-twilio-token'] || process.env.TWILIO_AUTH_TOKEN;
      const twilioFrom = req.headers['x-twilio-from'] || process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';

      const ultramsgInstance = req.headers['x-ultramsg-instance'] || process.env.ULTRAMSG_INSTANCE_ID;
      const ultramsgToken = req.headers['x-ultramsg-token'] || process.env.ULTRAMSG_TOKEN;

      const directWhatsAppUrl = `https://api.whatsapp.com/send?phone=91${cleanPhone}&text=${encodeURIComponent(messageBody)}`;

      // 1. Meta WhatsApp Business Cloud API (Official Meta Graph API)
      if (metaToken && metaPhoneId) {
        try {
          const metaResp = await fetch(`https://graph.facebook.com/v18.0/${metaPhoneId}/messages`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${metaToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              recipient_type: 'individual',
              to: formattedTo,
              type: 'text',
              text: { preview_url: true, body: messageBody }
            })
          });
          const metaData = await metaResp.json();
          if (metaResp.ok) {
            return res.status(200).json({
              success: true,
              provider: 'meta_cloud_api',
              isLiveDelivered: true,
              zeroClicksDelivered: true,
              messageId: metaData.messages?.[0]?.id || `wamid.meta_${Date.now()}`,
              recipient: `+91 ${cleanPhone}`,
              status: 'sent_directly_to_phone',
              directWhatsAppUrl: directWhatsAppUrl
            });
          } else {
            console.warn('Meta API returned non-OK status:', metaData);
          }
        } catch (metaErr) {
          console.warn('Meta API fetch error:', metaErr);
        }
      }

      // 2. Twilio WhatsApp API
      if (twilioSid && twilioToken) {
        try {
          const twilioAuth = Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64');
          const twilioParams = new URLSearchParams();
          twilioParams.append('From', twilioFrom.startsWith('whatsapp:') ? twilioFrom : `whatsapp:${twilioFrom}`);
          twilioParams.append('To', `whatsapp:+91${cleanPhone}`);
          twilioParams.append('Body', messageBody);

          const twilioResp = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${twilioAuth}`,
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: twilioParams.toString()
          });
          const twilioData = await twilioResp.json();
          if (twilioResp.ok) {
            return res.status(200).json({
              success: true,
              provider: 'twilio_whatsapp',
              isLiveDelivered: true,
              zeroClicksDelivered: true,
              messageId: twilioData.sid,
              recipient: `+91 ${cleanPhone}`,
              status: 'sent_directly_to_phone',
              directWhatsAppUrl: directWhatsAppUrl
            });
          }
        } catch (twilioErr) {
          console.warn('Twilio WhatsApp error:', twilioErr);
        }
      }

      // 3. UltraMsg Gateway API
      if (ultramsgInstance && ultramsgToken) {
        try {
          const ultraResp = await fetch(`https://api.ultramsg.com/${ultramsgInstance}/messages/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              token: ultramsgToken,
              to: `+91${cleanPhone}`,
              body: messageBody
            }).toString()
          });
          const ultraData = await ultraResp.json();
          if (ultraData.sent === 'true' || ultraData.sent === true) {
            return res.status(200).json({
              success: true,
              provider: 'ultramsg',
              isLiveDelivered: true,
              zeroClicksDelivered: true,
              messageId: ultraData.id,
              recipient: `+91 ${cleanPhone}`,
              status: 'sent_directly_to_phone',
              directWhatsAppUrl: directWhatsAppUrl
            });
          }
        } catch (ultraErr) {
          console.warn('UltraMsg error:', ultraErr);
        }
      }

      // 4. Staging Gateway (When no third-party WhatsApp gateway keys are configured yet)
      const simulatedMessageId = `wamid.KB_AUTO_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

      return res.status(200).json({
        success: true,
        provider: 'Karachi Bakery Staging Gateway (Gateway Keys Required for Automated Background Delivery)',
        isLiveDelivered: false,
        zeroClicksDelivered: false,
        requiresGatewayCredentials: true,
        recipient: `+91 ${cleanPhone}`,
        customerName: customerName,
        orderId: orderId,
        messageId: simulatedMessageId,
        timestamp: new Date().toISOString(),
        status: 'staged_ready_to_send',
        messagePreview: `Karachi Bakery order ${orderId} receipt generated for +91 ${cleanPhone}`,
        directWhatsAppUrl: directWhatsAppUrl
      });

    } catch (err) {
      console.error('WhatsApp API Server Error:', err);
      return res.status(500).json({
        success: false,
        error: 'Failed to process automated WhatsApp dispatch',
        details: err.message
      });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
};
