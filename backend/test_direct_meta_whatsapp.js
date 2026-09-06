import dotenv from 'dotenv';
dotenv.config();
import { sendWhatsAppAlert } from './src/services/aiTools/externalNotifier.js';

async function testDirectMetaWhatsApp() {
  console.log('--- Testing 24/7 Direct Meta WhatsApp Cloud API ---');
  console.log('Phone ID:', process.env.META_PHONE_NUMBER_ID);
  console.log('Recipient: +923269754249');

  const testMessage = `🤖 *The TaxMan's Capital &bull; AI Digital Employee*

✅ *24/7 Live Cloud WhatsApp Dispatch Activated!*
Aapka AI Manager ab direct Meta Cloud API se live notifications dispatch karega.

Ab laptop band hone ya n8n close hone par bhi WhatsApp alerts directly aayenge!

🔗 *Review Dashboard*: https://the-taxmans-capital.vercel.app/admin`;

  const result = await sendWhatsAppAlert({
    to: '+923269754249',
    message: testMessage
  });

  console.log('\nDispatch Result:', result);
  process.exit(result.success ? 0 : 1);
}

testDirectMetaWhatsApp();
