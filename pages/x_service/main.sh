
if [ -d ~/storage/shared ]; then
  echo "Xotira Tayyor"
else
  termux-setup-storage
fi

# pkg upgrade -y
pkg install jq inotify-tools tesseract -y # python

if [ ! -d ~/bin/dona ]; then
  mkdir -p ~/bin/dona
  echo "📁 ~/bin/dona papkasi yaratildi"
else
  echo "📁 ~/bin/dona papkasi allaqachon mavjud"
fi

cd ~/bin/dona
cat > dona_Call_OCR.sh << 'EOF'

SRC="/storage/emulated/0/DCIM/Screenshots"
JSON="/storage/emulated/0/DCIM/Last_Ring.json"

mkdir -p "$SRC"

# JSON fayl bo'sh bo'lsa yaratish
if [ ! -f "$JSON" ] || [ ! -s "$JSON" ]; then
    echo '{"file":"","ocr":"","ocr_digits":"","used":true}' > "$JSON"
fi

inotifywait -m -r -e create "$SRC" --format "%f %w" | while read FILE DIR
do
    # Faqat dialer screenshotlari
    if [[ "$FILE" == *com.google.android.dialer* ]]; then
        FULL="$DIR$FILE"

        # JSON faylni tekshirish
        USED=$(jq -r '.used' "$JSON")
        PREV_FILE=$(jq -r '.file' "$JSON")

        if [ "$USED" == "false" ]; then
            echo "Previous screenshot still unused. Skipping: $FULL"
            continue
        fi

        # Agar oldingi screenshot used=true bo'lsa va fayl mavjud bo'lsa, o'chirish
        if [ "$PREV_FILE" != "" ] && [ -f "$PREV_FILE" ]; then
            rm "$PREV_FILE"
            echo "Deleted previous used screenshot: $PREV_FILE"
        fi

        # OCR qilish (barcha matn)
        OCR_TEXT=$(tesseract "$FULL" stdout)

        # Raqamlarni ajratish (bo'sh joy va + belgisi bilan)
        OCR_DIGITS=$(echo "$OCR_TEXT" | tr -d ' ' | grep -Eo "\+?[0-9]{5,}")

        # JSON faylga yozish (bitta obyekt)
        jq -n --arg fp "$FULL" --arg text "$OCR_TEXT" --arg digits "$OCR_DIGITS" \
            '{"file":$fp,"ocr":$text,"ocr_digits":$digits,"used":false}' > "$JSON"

        echo "New screenshot added: $FULL"
        echo "OCR Text: $OCR_TEXT"
        echo "OCR Digits: $OCR_DIGITS"
    fi
done
EOF
echo ✅ Fayl yozildi

cd ~/bin/dona && chmod +x dona_Call_OCR.sh
echo faylga execute chmod +x berildi ✅ 

echo "╔════════════════════════════════════════╗"
echo "║                                        ║"
echo "║   📌 Xotira uchun ruxsat berilsin.     ║"
echo "║                                        ║"
echo "║   ✅ Sizning faylingiz foydalanishga   ║"
echo "║      tayyor                            ║"
echo "║                                        ║"
echo "╚════════════════════════════════════════╝"