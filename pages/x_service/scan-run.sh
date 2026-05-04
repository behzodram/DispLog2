#!/data/data/com.termux/files/usr/bin/bash

FILE="$HOME/bin/dona/dona_Call_OCR.sh"

if [ -f "$FILE" ]; then
  echo "╔════════════════════════════════════════╗"
  echo "║                                        ║"
  echo "║         📡 Skanerlash boshlandi        ║"
  echo "║                                        ║"
  echo "╚════════════════════════════════════════╝"
else
  echo "╔════════════════════════════════════════╗"
  echo "║                                        ║"
  echo "║   🔍 Skaner                            ║"
  echo "║                                        ║"
  echo "║   ❌ File topilmadi!                   ║"
  echo "║                                        ║"
  echo "╚════════════════════════════════════════╝"
fi

cd "$HOME/bin/dona"
./dona_Call_OCR.sh