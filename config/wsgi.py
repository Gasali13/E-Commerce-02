import os
import sys
from django.core.wsgi import get_wsgi_application

# 1. Tambahkan path project ke sistem agar Vercel tidak bingung
path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if path not in sys.path:
    sys.path.append(path)

# 2. Arahkan ke file settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# 3. Jalankan aplikasi
application = get_wsgi_application()

# 4. Alias untuk Vercel (Wajib ada)
app = application