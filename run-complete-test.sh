#!/bin/bash

# Script pour exécuter le test complet du flux e-commerce

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     PRÉPARATION DU TEST COMPLET DU FLUX E-COMMERCE         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Vérifier que les variables d'environnement sont définies
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Erreur: DATABASE_URL n'est pas défini"
  echo "Veuillez configurer les variables d'environnement dans .env.local"
  exit 1
fi

if [ -z "$RESEND_API_KEY" ]; then
  echo "⚠️  Avertissement: RESEND_API_KEY n'est pas défini"
  echo "Les emails ne seront pas envoyés"
fi

echo "✓ Variables d'environnement vérifiées"
echo ""

# Compiler et exécuter le test
echo "Compilation du test..."
npx ts-node test-complete-flow.ts

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                  TEST TERMINÉ                              ║"
echo "╚════════════════════════════════════════════════════════════╝"
