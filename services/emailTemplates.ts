/**
 * Email Templates - Cosmic Galaxy Theme
 * Templates d'emails réutilisables avec thème galaxie/étoiles
 * Amélioré avec meilleure accessibilité, sécurité et responsive design
 */

export interface EmailTemplateProps {
  title?: string;
  preheader?: string;
  content: string;
  cta?: {
    text: string;
    url: string;
  };
  footer?: string;
  unsubscribeUrl?: string;
}

export interface OrderItem {
  productName: string;
  quantity: number;
  priceAtPurchase: number;
}

export interface OrderData {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address: string;
  delivery_zone: string;
  delivery_fee: number;
  subtotal: number;
  total_amount: number;
  created_at: string;
  notes?: string;
}

/**
 * Base email template with galaxy/cosmic theme
 * Improved with better accessibility, security, and responsive design
 */
export const baseEmailTemplate = (props: EmailTemplateProps): string => {
  const {
    title = 'Grandson Clothes',
    preheader = '',
    content,
    cta,
    footer = '© 2024 Grandson Clothes. Tous droits réservés.',
    unsubscribeUrl = '#',
  } = props;

  return `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          @keyframes twinkle {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          
          @keyframes glow {
            0%, 100% { text-shadow: 0 0 10px rgba(139, 92, 246, 0.5); }
            50% { text-shadow: 0 0 20px rgba(139, 92, 246, 0.8), 0 0 30px rgba(139, 92, 246, 0.6); }
          }
          
          body {
            font-family: 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
            color: #e0e0e0;
            background: radial-gradient(ellipse at center, #0a0e27 0%, #000000 100%);
            line-height: 1.6;
            position: relative;
          }
          
          body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: 
              radial-gradient(2px 2px at 20px 30px, #eee, rgba(0,0,0,0)),
              radial-gradient(2px 2px at 60px 70px, #fff, rgba(0,0,0,0)),
              radial-gradient(1px 1px at 50px 50px, #fff, rgba(0,0,0,0)),
              radial-gradient(1px 1px at 130px 80px, #fff, rgba(0,0,0,0)),
              radial-gradient(2px 2px at 90px 10px, #fff, rgba(0,0,0,0));
            background-repeat: repeat;
            background-size: 200px 200px;
            animation: twinkle 5s infinite;
            pointer-events: none;
            z-index: -1;
          }
          
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: linear-gradient(135deg, rgba(10, 14, 39, 0.95) 0%, rgba(20, 25, 50, 0.95) 50%, rgba(10, 14, 39, 0.95) 100%);
            border: 1px solid rgba(139, 92, 246, 0.3);
            box-shadow: 
              0 0 30px rgba(139, 92, 246, 0.2),
              inset 0 0 30px rgba(139, 92, 246, 0.05);
            border-radius: 12px;
            overflow: hidden;
            position: relative;
          }
          
          .email-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.5), transparent);
          }
          
          .email-header {
            background: linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(30, 20, 60, 0.6) 50%, rgba(0, 0, 0, 0.8) 100%);
            color: #ffffff;
            padding: 50px 30px;
            text-align: center;
            border-bottom: 2px solid rgba(139, 92, 246, 0.4);
            position: relative;
            overflow: hidden;
          }
          
          .email-header::before {
            content: '✦ ✧ ✦';
            position: absolute;
            top: 10px;
            left: 0;
            right: 0;
            font-size: 12px;
            color: rgba(139, 92, 246, 0.3);
            letter-spacing: 20px;
          }
          
          .email-header::after {
            content: '✦ ✧ ✦';
            position: absolute;
            bottom: 10px;
            left: 0;
            right: 0;
            font-size: 12px;
            color: rgba(139, 92, 246, 0.3);
            letter-spacing: 20px;
          }
          
          .email-header h1 {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: 2px;
            animation: glow 3s ease-in-out infinite;
            color: #8b5cf6;
            text-transform: uppercase;
          }
          
          .email-header p {
            font-size: 13px;
            opacity: 0.8;
            font-weight: 500;
            letter-spacing: 1px;
            color: #a78bfa;
          }
          
          .email-content {
            padding: 40px 30px;
            background: rgba(10, 14, 39, 0.5);
            position: relative;
          }
          
          .email-content p {
            margin-bottom: 16px;
            font-size: 15px;
            color: #d0d0d0;
            line-height: 1.8;
          }
          
          .email-content h2 {
            font-size: 22px;
            font-weight: 600;
            color: #8b5cf6;
            margin: 24px 0 16px 0;
            letter-spacing: 1px;
          }
          
          .email-content h3 {
            font-size: 16px;
            font-weight: 600;
            color: #a78bfa;
            margin: 16px 0 12px 0;
          }
          
          .cta-button {
            display: inline-block;
            padding: 14px 36px;
            background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
            color: #ffffff;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 15px;
            margin: 24px 0;
            transition: all 0.3s ease;
            box-shadow: 
              0 0 20px rgba(139, 92, 246, 0.4),
              0 4px 15px rgba(139, 92, 246, 0.3);
            border: 1px solid rgba(139, 92, 246, 0.5);
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .cta-button:hover {
            background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
            box-shadow: 
              0 0 30px rgba(139, 92, 246, 0.6),
              0 6px 20px rgba(139, 92, 246, 0.5);
            transform: translateY(-2px);
          }
          
          .info-box {
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%);
            border-left: 4px solid #8b5cf6;
            border-radius: 6px;
            padding: 16px;
            margin: 20px 0;
            border: 1px solid rgba(139, 92, 246, 0.2);
          }
          
          .info-box.warning {
            background: linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 193, 7, 0.05) 100%);
            border-left-color: #ffc107;
            border-color: rgba(255, 193, 7, 0.2);
          }
          
          .info-box.success {
            background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%);
            border-left-color: #4caf50;
            border-color: rgba(76, 175, 80, 0.2);
          }
          
          .info-box.error {
            background: linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(244, 67, 54, 0.05) 100%);
            border-left-color: #f44336;
            border-color: rgba(244, 67, 54, 0.2);
          }
          
          .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent);
            margin: 24px 0;
          }
          
          .email-footer {
            background: linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(30, 20, 60, 0.4) 100%);
            padding: 30px;
            text-align: center;
            border-top: 1px solid rgba(139, 92, 246, 0.2);
            font-size: 12px;
            color: #999;
          }
          
          .email-footer p {
            margin-bottom: 8px;
            font-size: 12px;
            color: #888;
          }
          
          .social-links {
            margin-top: 16px;
          }
          
          .social-links a {
            display: inline-block;
            margin: 0 8px;
            color: #8b5cf6;
            text-decoration: none;
            font-size: 12px;
            transition: all 0.3s ease;
          }
          
          .social-links a:hover {
            color: #a78bfa;
            text-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 16px 0;
          }
          
          table th {
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(124, 58, 237, 0.1) 100%);
            padding: 12px;
            text-align: left;
            font-weight: 600;
            border-bottom: 2px solid rgba(139, 92, 246, 0.3);
            font-size: 14px;
            color: #a78bfa;
          }
          
          table td {
            padding: 12px;
            border-bottom: 1px solid rgba(139, 92, 246, 0.1);
            font-size: 14px;
            color: #d0d0d0;
          }
          
          table tr:last-child td {
            border-bottom: none;
          }
          
          .highlight {
            color: #8b5cf6;
            font-weight: 600;
            text-shadow: 0 0 10px rgba(139, 92, 246, 0.3);
          }
          
          .text-center {
            text-align: center;
          }
          
          .text-muted {
            color: #888;
            font-size: 13px;
          }
          
          .star {
            display: inline-block;
            animation: twinkle 3s infinite;
          }
          
          @media (max-width: 600px) {
            .email-container {
              width: 100%;
              border-radius: 0;
            }
            
            .email-header {
              padding: 30px 15px;
            }
            
            .email-header h1 {
              font-size: 24px;
            }
            
            .email-content {
              padding: 20px 15px;
            }
            
            .email-footer {
              padding: 20px 15px;
            }
            
            table {
              font-size: 12px;
            }
            
            table th,
            table td {
              padding: 8px;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1>✦ ${title} ✦</h1>
            <p>${preheader}</p>
          </div>
          
          <div class="email-content">
            ${content}
            ${cta ? `<div class="text-center"><a href="${cta.url}" class="cta-button">→ ${cta.text} ←</a></div>` : ''}
          </div>
          
          <div class="email-footer">
            <p>✧ ${footer} ✧</p>
            <div class="social-links">
              <a href="https://grandson-clothes.com">Site Web</a>
              <a href="https://instagram.com/grandson-clothes">Instagram</a>
              <a href="https://facebook.com/grandson-clothes">Facebook</a>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
};

/**
 * Order confirmation email content - Cosmic theme
 */
export const orderConfirmationContent = (order: any, items: any[]): string => {
  const itemsRows = items
    .map(
      (item) =>
        `<tr>
          <td>${item.productName}</td>
          <td style="text-align: center;">${item.quantity}</td>
          <td style="text-align: right;">${(item.priceAtPurchase * item.quantity).toLocaleString()} GNF</td>
        </tr>`
    )
    .join('');

  const orderDate = new Date(order.created_at).toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
    <p>Bonjour <span class="highlight">✦ ${order.customer_name} ✦</span>,</p>
    <p>Merci pour votre commande! Votre voyage cosmique a commencé. Voici les détails de votre achat:</p>
    
    <h2>🌌 Confirmation de Commande</h2>
    
    <div class="info-box">
      <p><strong>Numéro de commande:</strong> <span class="highlight">#${order.id}</span></p>
      <p><strong>Date:</strong> ${orderDate}</p>
      <p><strong>Statut:</strong> <span style="color: #4caf50; font-weight: 600;">✓ Confirmée</span></p>
    </div>
    
    <h3>📦 Détails de votre commande</h3>
    <table>
      <thead>
        <tr>
          <th>Produit</th>
          <th style="text-align: center;">Quantité</th>
          <th style="text-align: right;">Prix unitaire</th>
          <th style="text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(item => `<tr>
          <td>${item.productName}</td>
          <td style="text-align: center;">${item.quantity}</td>
          <td style="text-align: right;">${item.priceAtPurchase.toLocaleString()} GNF</td>
          <td style="text-align: right; font-weight: 600;">${(item.priceAtPurchase * item.quantity).toLocaleString()} GNF</td>
        </tr>`).join('')}
      </tbody>
    </table>
    
    <div class="divider"></div>
    
    <h3>💰 Résumé du paiement</h3>
    <div class="info-box">
      <table style="width: 100%; border: none;">
        <tr>
          <td style="border: none; padding: 8px 0;"><strong>Sous-total:</strong></td>
          <td style="border: none; padding: 8px 0; text-align: right;">${order.subtotal.toLocaleString()} GNF</td>
        </tr>
        <tr>
          <td style="border: none; padding: 8px 0;"><strong>Frais de livraison (${order.delivery_zone}):</strong></td>
          <td style="border: none; padding: 8px 0; text-align: right;">${order.delivery_fee.toLocaleString()} GNF</td>
        </tr>
        <tr style="border-top: 2px solid rgba(139, 92, 246, 0.3);">
          <td style="border: none; padding: 12px 0; font-size: 16px;"><strong>Total à payer:</strong></td>
          <td style="border: none; padding: 12px 0; text-align: right; font-size: 18px; color: #8b5cf6; font-weight: 700;">${order.total_amount.toLocaleString()} GNF</td>
        </tr>
      </table>
    </div>
    
    <h3>🚀 Adresse de livraison</h3>
    <div class="info-box">
      <p style="margin: 0; line-height: 1.8;">${order.shipping_address}</p>
    </div>
    
    <div class="info-box success">
      <p style="margin-top: 0;"><strong>✨ Prochaines étapes</strong></p>
      <p style="margin-bottom: 0;">Votre commande est en cours de préparation. Vous recevrez bientôt un email avec le numéro de suivi pour suivre votre colis à travers l'univers.</p>
    </div>
    
    <h3>❓ Besoin d'aide?</h3>
    <p>Si vous avez des questions concernant votre commande, n'hésitez pas à nous contacter. Notre équipe cosmique est là pour vous aider!</p>
    
    <p>Merci d'avoir choisi Grandson Clothes pour votre voyage cosmique!</p>
  `;
};

/**
 * Welcome email content - Cosmic theme
 */
export const welcomeEmailContent = (name: string): string => {
  return `
    <p>Bonjour <span class="highlight">✦ ${name} ✦</span>,</p>
    <p>Bienvenue dans notre galaxie! Vous venez de rejoindre une communauté de voyageurs cosmiques passionnés par la mode et l'aventure.</p>
    
    <h2>🌟 Explorez notre univers</h2>
    <p>Découvrez notre collection exclusive de vêtements et accessoires, conçus pour les explorateurs de l'espace qui ont du style.</p>
    
    <div class="info-box success">
      <p style="margin-top: 0;"><strong>✨ Offre de bienvenue cosmique</strong></p>
      <p style="margin-bottom: 0;">Profitez de <span class="highlight">10% de réduction</span> sur votre première commande avec le code: <strong style="font-size: 16px; letter-spacing: 2px;">WELCOME10</strong></p>
    </div>
    
    <h3>🚀 Pourquoi rejoindre notre galaxie?</h3>
    <ul style="margin-left: 20px; margin-bottom: 16px; color: #d0d0d0; line-height: 2;">
      <li><strong>Vêtements de qualité premium</strong> - Sélectionnés avec soin pour vous</li>
      <li><strong>Livraison rapide</strong> - À travers l'univers en quelques jours</li>
      <li><strong>Service client stellaire</strong> - Disponible pour vous aider</li>
      <li><strong>Retours faciles et gratuits</strong> - Aucune question posée</li>
      <li><strong>Offres exclusives</strong> - Réservées à nos membres</li>
    </ul>
    
    <h3>🎁 Commencez votre voyage</h3>
    <p>Explorez notre collection dès maintenant et trouvez les pièces parfaites pour votre style cosmique.</p>
    
    <div class="info-box">
      <p style="margin: 0;"><strong>💡 Conseil:</strong> Consultez notre blog pour des conseils de style et des tendances actuelles!</p>
    </div>
    
    <p>Si vous avez des questions, notre équipe cosmique est là pour vous aider. N'hésitez pas à nous contacter!</p>
  `;
};

/**
 * Shipping notification email content - Cosmic theme
 */
export const shippingNotificationContent = (orderData: any): string => {
  const estimatedDate = new Date(orderData.estimatedDelivery).toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <p>Bonjour <span class="highlight">✦ ${orderData.customerName} ✦</span>,</p>
    <p>Bonne nouvelle! Votre commande #${orderData.orderId} a décollé et voyage à travers les étoiles!</p>
    
    <h2>🛸 Votre colis est en route</h2>
    
    <div class="info-box success">
      <p style="margin-top: 0;"><strong>Numéro de suivi cosmique:</strong></p>
      <p style="font-size: 18px; font-weight: bold; color: #8b5cf6; margin: 12px 0; letter-spacing: 2px;">
        ${orderData.trackingNumber}
      </p>
      <p style="margin-bottom: 0; color: #a78bfa;"><strong>Arrivée estimée:</strong> ${estimatedDate}</p>
    </div>
    
    <h3>📍 Suivre votre voyage</h3>
    <p>Vous pouvez suivre votre colis en temps réel à travers l'univers. Cliquez sur le bouton ci-dessous pour accéder au suivi détaillé:</p>
    
    <div class="info-box">
      <p style="margin: 0;"><strong>🔗 Lien de suivi:</strong></p>
      <p style="margin: 8px 0 0 0; word-break: break-all; color: #8b5cf6;">
        <a href="${orderData.trackingUrl || '#'}" style="color: #8b5cf6; text-decoration: underline;">Suivre mon colis</a>
      </p>
    </div>
    
    <h3>📦 Qu'attendre?</h3>
    <ul style="margin-left: 20px; color: #d0d0d0; line-height: 1.8;">
      <li>Votre colis est actuellement en transit</li>
      <li>Vous recevrez des mises à jour de suivi régulières</li>
      <li>Assurez-vous que quelqu'un sera disponible à la livraison</li>
      <li>Vérifiez votre adresse de livraison</li>
    </ul>
    
    <div class="info-box warning">
      <p style="margin: 0;"><strong>⚠️ Important:</strong> Si vous ne recevez pas votre colis à la date estimée, veuillez nous contacter immédiatement.</p>
    </div>
    
    <h3>❓ Questions?</h3>
    <p>Si vous avez des questions concernant votre livraison cosmique, n'hésitez pas à nous contacter. Notre équipe est disponible 24/7!</p>
  `;
};

/**
 * Password reset email content - Cosmic theme
 */
export const passwordResetContent = (resetLink: string): string => {
  const expiryTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
    <p>Bonjour voyageur cosmique,</p>
    <p>Vous avez demandé une réinitialisation de mot de passe pour accéder à votre compte Grandson Clothes.</p>
    
    <h2>🔐 Réinitialiser votre mot de passe</h2>
    
    <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe sécurisé:</p>
    
    <div class="text-center">
      <a href="${resetLink}" class="cta-button">→ Réinitialiser mon mot de passe ←</a>
    </div>
    
    <p class="text-muted">Ou copiez ce lien dans votre navigateur:</p>
    <p class="text-muted" style="word-break: break-all; background: rgba(139, 92, 246, 0.1); padding: 12px; border-radius: 6px; border-left: 3px solid #8b5cf6;">
      ${resetLink}
    </p>
    
    <div class="info-box warning">
      <p style="margin-top: 0;"><strong>⚠️ Sécurité cosmique</strong></p>
      <p style="margin-bottom: 0;">Ce lien expire le <strong>${expiryTime}</strong>. Si vous n'avez pas demandé cette réinitialisation, ignorez cet email et votre compte restera sécurisé.</p>
    </div>
    
    <h3>💡 Conseils de sécurité</h3>
    <ul style="margin-left: 20px; color: #d0d0d0; line-height: 1.8;">
      <li>Utilisez un mot de passe fort et unique</li>
      <li>Ne partagez jamais votre mot de passe avec quiconque</li>
      <li>Utilisez une combinaison de lettres, chiffres et symboles</li>
      <li>Changez votre mot de passe régulièrement</li>
    </ul>
    
    <p>Si vous avez des questions ou si vous n'avez pas demandé cette réinitialisation, contactez notre équipe de support immédiatement.</p>
  `;
};

/**
 * Contact form response email content - Cosmic theme
 */
export const contactFormResponseContent = (name: string, message: string): string => {
  return `
    <p>Bonjour <span class="highlight">✦ ${name} ✦</span>,</p>
    <p>Merci de nous avoir contactés! Nous avons bien reçu votre message depuis l'univers et nous l'examinons attentivement.</p>
    
    <h2>📬 Votre message cosmique</h2>
    
    <div class="info-box">
      <p style="margin: 0; line-height: 1.8; color: #d0d0d0;">${message}</p>
    </div>
    
    <h3>⏱️ Délai de réponse</h3>
    <p>Notre équipe d'explorateurs examinera votre demande et vous répondra dans les plus brefs délais:</p>
    <ul style="margin-left: 20px; color: #d0d0d0; line-height: 1.8;">
      <li><strong>Questions générales:</strong> 24 heures</li>
      <li><strong>Problèmes de commande:</strong> 12 heures</li>
      <li><strong>Problèmes techniques:</strong> 48 heures</li>
    </ul>
    
    <div class="info-box success">
      <p style="margin: 0;"><strong>✨ Numéro de référence:</strong> Conservez cet email pour référence. Vous pouvez nous le renvoyer si vous avez besoin de suivi.</p>
    </div>
    
    <h3>🚀 Pendant ce temps</h3>
    <p>Vous pouvez explorer notre FAQ ou consulter notre blog pour trouver des réponses à vos questions.</p>
    
    <p>Merci de votre patience et de votre confiance en Grandson Clothes!</p>
  `;
};

/**
 * Admin order notification email content - Cosmic theme
 */
export const adminOrderNotificationContent = (order: any, items: any[]): string => {
  const orderDate = new Date(order.created_at).toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const itemsRows = items
    .map(
      (item) =>
        `<tr>
          <td>${item.productName}</td>
          <td style="text-align: center;">${item.quantity}</td>
          <td style="text-align: right;">${item.priceAtPurchase.toLocaleString()} GNF</td>
          <td style="text-align: right; font-weight: 600;">${(item.priceAtPurchase * item.quantity).toLocaleString()} GNF</td>
        </tr>`
    )
    .join('');

  return `
    <p>🚨 <strong>Alerte:</strong> Une nouvelle commande a atterri dans votre galaxie!</p>
    
    <h2>🌌 Nouvelle Commande #${order.id}</h2>
    
    <div class="info-box success">
      <p style="margin: 0;"><strong>Date:</strong> ${orderDate}</p>
    </div>
    
    <h3>👤 Informations du client</h3>
    <div class="info-box">
      <table style="width: 100%; border: none;">
        <tr>
          <td style="border: none; padding: 8px 0; font-weight: 600; width: 40%;"><strong>Nom:</strong></td>
          <td style="border: none; padding: 8px 0;">${order.customer_name}</td>
        </tr>
        <tr>
          <td style="border: none; padding: 8px 0; font-weight: 600;"><strong>Email:</strong></td>
          <td style="border: none; padding: 8px 0;"><a href="mailto:${order.customer_email}" style="color: #8b5cf6; text-decoration: none;">${order.customer_email}</a></td>
        </tr>
        <tr>
          <td style="border: none; padding: 8px 0; font-weight: 600;"><strong>Téléphone:</strong></td>
          <td style="border: none; padding: 8px 0;">${order.customer_phone || 'Non fourni'}</td>
        </tr>
      </table>
    </div>
    
    <h3>📦 Détails de la commande</h3>
    <table>
      <thead>
        <tr>
          <th>Produit</th>
          <th style="text-align: center;">Quantité</th>
          <th style="text-align: right;">Prix unitaire</th>
          <th style="text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
      </tbody>
    </table>
    
    <h3>💰 Résumé financier</h3>
    <div class="info-box">
      <table style="width: 100%; border: none;">
        <tr>
          <td style="border: none; padding: 8px 0;"><strong>Sous-total:</strong></td>
          <td style="border: none; padding: 8px 0; text-align: right;">${order.subtotal.toLocaleString()} GNF</td>
        </tr>
        <tr>
          <td style="border: none; padding: 8px 0;"><strong>Frais de livraison (${order.delivery_zone}):</strong></td>
          <td style="border: none; padding: 8px 0; text-align: right;">${order.delivery_fee.toLocaleString()} GNF</td>
        </tr>
        <tr style="border-top: 2px solid rgba(139, 92, 246, 0.3);">
          <td style="border: none; padding: 12px 0; font-size: 16px;"><strong>Total:</strong></td>
          <td style="border: none; padding: 12px 0; text-align: right; font-size: 18px; color: #8b5cf6; font-weight: 700;">${order.total_amount.toLocaleString()} GNF</td>
        </tr>
      </table>
    </div>
    
    <h3>🚀 Adresse de livraison</h3>
    <div class="info-box">
      <p style="margin: 0; line-height: 1.8;">${order.shipping_address}</p>
    </div>
    
    ${order.notes ? `
    <h3>📝 Notes spéciales</h3>
    <div class="info-box warning">
      <p style="margin: 0;">${order.notes}</p>
    </div>
    ` : ''}
    
    <div class="divider"></div>
    
    <h3>⚡ Actions requises</h3>
    <ul style="margin-left: 20px; color: #d0d0d0; line-height: 1.8;">
      <li>Vérifier la disponibilité des produits</li>
      <li>Préparer le colis pour l'expédition</li>
      <li>Générer l'étiquette de livraison</li>
      <li>Envoyer la notification de suivi au client</li>
    </ul>
  `;
};
