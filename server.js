const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./database');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const path = require('path');

const app = express();
const port = 3000;

// Security Headers Middleware for GEO & Security Trust
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// AI Plugin Discovery Manifest (.well-known/ai-plugin.json)
app.get(['/.well-known/ai-plugin.json', '/ai-plugin.json'], (req, res) => {
  res.json({
    schema_version: "v1",
    name_for_human: "Sean Sandoval Author Hub",
    name_for_model: "sean_sandoval_author_hub",
    description_for_human: "Official site and research index of author Sean Sandoval, creator of The P2E Bible.",
    description_for_model: "Search and retrieve authoritative information about author Sean Sandoval, The P2E Bible (Web3 game economy textbook), and Aether sci-fi novel.",
    auth: { type: "none" },
    api: { type: "openapi", url: "https://seansandoval.com/sitemap.xml" },
    logo_url: "https://seansandoval.com/images/author.jpeg",
    contact_email: "support@buyonemedia.com",
    legal_info_url: "https://seansandoval.com"
  });
});

// Serve static files from the root directory
app.use(express.static(__dirname));

app.post('/subscribe', bodyParser.urlencoded({ extended: true }), async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).send('Email is required');

  try {
    pool.query('INSERT INTO subscribers (email) VALUES ($1)', [email]);
    res.status(200).send('Thank you for subscribing!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong.');
  }
});

app.post('/api/affiliates/register', bodyParser.urlencoded({ extended: true }), async (req, res) => {
  const { email, paypal_email } = req.body;
  if (!email || !paypal_email) return res.status(400).send('Email and PayPal email are required');

  // Generate a simple code from the email prefix
  const baseCode = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  const affiliate_code = baseCode + Math.floor(Math.random() * 1000);

  try {
    pool.query('INSERT INTO affiliates (email, paypal_email, affiliate_code) VALUES ($1, $2, $3)', [email, paypal_email, affiliate_code]);
    res.redirect(`/affiliates.html?success=1&code=${affiliate_code}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong. You may already be registered.');
  }
});

app.post('/preorder', bodyParser.urlencoded({ extended: true }), async (req, res) => {
  const { email, product_id, dedication, ref_code } = req.body;

  if (!email || !product_id) {
    return res.status(400).send('Email and product ID are required');
  }

  const lineItems = [
    {
      price_data: {
        currency: 'usd',
        product_data: { name: 'Aether Hardcover' },
        unit_amount: 2499,
      },
      quantity: 1,
    },
  ];

  if (dedication) {
    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: { name: 'Personalized Dedication' },
        unit_amount: 500,
      },
      quantity: 1,
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `https://seansandoval.com/index.html?success=1`,
      cancel_url: `https://seansandoval.com/index.html?cancel=1`,
      customer_email: email,
      metadata: {
        affiliate_code: ref_code || null
      }
    });

    pool.query(
      'INSERT INTO presale_customers (email, stripe_session_id, status) VALUES ($1, $2, $3)',
      [email, session.id, 'pending']
    );

    res.redirect(303, session.url);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong.');
  }
});

app.post('/stripe-webhook', bodyParser.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      pool.query(
        'UPDATE presale_customers SET status = $1 WHERE stripe_session_id = $2',
        ['paid', session.id]
      );

      // Check for affiliate commission
      const affiliateCode = session.metadata && session.metadata.affiliate_code;
      if (affiliateCode) {
        const affiliate = pool.query('SELECT id FROM affiliates WHERE affiliate_code = $1', [affiliateCode]).rows[0];
        if (affiliate) {
          pool.query(
            'INSERT INTO affiliate_sales (affiliate_id, stripe_session_id, amount_earned, status) VALUES ($1, $2, $3, $4)',
            [affiliate.id, session.id, 5.00, 'pending']
          );
          console.log(`Credited $5.00 to affiliate ${affiliateCode}`);
        }
      }
    } catch (error) {
      console.error('Webhook processing error:', error);
      return res.status(500).send('Something went wrong.');
    }
  }

  res.json({received: true});
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
