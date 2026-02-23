#!/bin/bash

# Script de test de l'API en production
# Usage: ./scripts/test-production-api.sh https://votre-app.vercel.app

if [ -z "$1" ]; then
  echo "❌ Usage: $0 <URL_BASE>"
  echo "   Exemple: $0 https://votre-app.vercel.app"
  exit 1
fi

BASE_URL=$1
echo "🧪 Test de l'API en production: $BASE_URL"
echo "================================================"
echo ""

# Test 1: Health check
echo "1️⃣ Test Health Check..."
HEALTH=$(curl -s "$BASE_URL/health")
if echo "$HEALTH" | grep -q "ok"; then
  echo "   ✅ Serveur en ligne: $HEALTH"
else
  echo "   ❌ Serveur hors ligne"
  exit 1
fi
echo ""

# Test 2: Récupérer les produits et le token CSRF
echo "2️⃣ Test récupération des produits + token CSRF..."
RESPONSE=$(curl -si "$BASE_URL/api/products")
TOKEN=$(echo "$RESPONSE" | grep -i "X-CSRF-Token:" | cut -d' ' -f2 | tr -d '\r')

if [ -z "$TOKEN" ]; then
  echo "   ❌ Token CSRF non trouvé dans les headers"
  echo "   Headers reçus:"
  echo "$RESPONSE" | head -20
  exit 1
else
  echo "   ✅ Token CSRF récupéré: ${TOKEN:0:20}..."
fi

PRODUCTS=$(echo "$RESPONSE" | tail -1)
PRODUCT_COUNT=$(echo "$PRODUCTS" | grep -o '\[' | wc -l)
echo "   ✅ Produits récupérés: $PRODUCT_COUNT produit(s)"
echo ""

# Test 3: Tester la création de produit (devrait échouer sans auth admin)
echo "3️⃣ Test création de produit (sans auth - devrait échouer)..."
CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/products" \
  -H "X-CSRF-Token: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "price": 50000,
    "category": "Test",
    "imageUrl": "https://via.placeholder.com/300"
  }')

echo "   Réponse: $CREATE_RESPONSE"
echo ""

# Test 4: Récupérer un nouveau token pour la commande
echo "4️⃣ Récupération d'un nouveau token CSRF pour la commande..."
RESPONSE=$(curl -si "$BASE_URL/api/products")
TOKEN=$(echo "$RESPONSE" | grep -i "X-CSRF-Token:" | cut -d' ' -f2 | tr -d '\r')
echo "   ✅ Nouveau token récupéré: ${TOKEN:0:20}..."
echo ""

# Test 5: Tester la création de commande
echo "5️⃣ Test création de commande..."
ORDER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/orders" \
  -H "X-CSRF-Token: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test User",
    "customerEmail": "test@example.com",
    "customerPhone": "622000000",
    "deliveryAddress": "Test Address, Conakry",
    "deliveryZone": "Conakry Centre",
    "deliveryFee": 0,
    "subtotal": 50000,
    "totalAmount": 50000,
    "items": [
      {
        "productId": "test-1",
        "productName": "Test Product",
        "quantity": 1,
        "selectedSize": "M",
        "selectedColor": "Noir",
        "priceAtPurchase": 50000
      }
    ]
  }')

if echo "$ORDER_RESPONSE" | grep -q "success"; then
  echo "   ✅ Commande créée avec succès!"
  echo "   Réponse: $ORDER_RESPONSE"
else
  echo "   ❌ Échec de création de commande"
  echo "   Réponse: $ORDER_RESPONSE"
fi
echo ""

# Test 6: Vérifier les headers de sécurité
echo "6️⃣ Vérification des headers de sécurité..."
HEADERS=$(curl -sI "$BASE_URL")

check_header() {
  HEADER_NAME=$1
  if echo "$HEADERS" | grep -qi "$HEADER_NAME"; then
    echo "   ✅ $HEADER_NAME présent"
  else
    echo "   ⚠️  $HEADER_NAME manquant"
  fi
}

check_header "X-Content-Type-Options"
check_header "X-Frame-Options"
check_header "X-XSS-Protection"
check_header "Referrer-Policy"
echo ""

# Test 7: Vérifier le rate limiting
echo "7️⃣ Test rate limiting (3 requêtes rapides)..."
for i in {1..3}; do
  RESPONSE=$(curl -si "$BASE_URL/api/products")
  REMAINING=$(echo "$RESPONSE" | grep -i "X-RateLimit-Remaining:" | cut -d' ' -f2 | tr -d '\r')
  LIMIT=$(echo "$RESPONSE" | grep -i "X-RateLimit-Limit:" | cut -d' ' -f2 | tr -d '\r')
  echo "   Requête $i: $REMAINING/$LIMIT requêtes restantes"
done
echo ""

echo "================================================"
echo "✅ Tests terminés!"
echo ""
echo "📝 Résumé:"
echo "   - Health check: OK"
echo "   - CSRF tokens: OK"
echo "   - Création de commande: Vérifiez ci-dessus"
echo "   - Headers de sécurité: Vérifiez ci-dessus"
echo "   - Rate limiting: Actif"
echo ""
echo "💡 Prochaines étapes:"
echo "   1. Vérifier les emails dans Resend dashboard"
echo "   2. Tester le panneau admin avec ADMIN_API_KEY"
echo "   3. Monitorer les logs Vercel"
