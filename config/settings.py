import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# ========================================
# SECURITY CONFIGURATION
# ========================================

# Ambil Secret Key dari Vercel, kalau di laptop pakai default yang panjang
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-default-key-for-dev-only')

# DEBUG otomatis False jika di Vercel, True jika di Laptop
DEBUG = os.environ.get('DEBUG', 'True') == 'True'

ALLOWED_HOSTS = ['127.0.0.1', 'localhost', '.vercel.app']


# ========================================
# APPLICATION DEFINITION
# ========================================

INSTALLED_APPS = [
    'unfold',
    'unfold.contrib.filters', 
    'unfold.contrib.forms',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'blog.apps.BlogConfig',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'


# ========================================
# DATABASE
# ========================================
# Catatan: SQLite di Vercel datanya akan RESET setiap redeploy.
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# ========================================
# PASSWORD VALIDATION
# ========================================
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]


# ========================================
# INTERNATIONALIZATION
# ========================================
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Jakarta'
USE_I18N = True
USE_TZ = True


# ========================================
# STATIC FILES (CSS, JS, IMAGES)
# ========================================
STATIC_URL = 'static/'
STATICFILES_DIRS = [BASE_DIR / 'static']
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Penting agar CSS ter-compress dan jalan di Vercel
STATICFILES_STORAGE = 'whitenoise.storage.CompressedStaticFilesStorage'

# [PENTING] BARIS INI YANG MENGATASI ERROR 404 DI VERCEL
# Ini memaksa Whitenoise mencari file di folder 'static/' jika 'staticfiles/' kosong
WHITENOISE_USE_FINDERS = True

# Media Files (Upload User)
# Ingat: Di Vercel file media akan hilang sendiri (ephemeral) kecuali pakai Cloudinary/S3
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# ========================================
# AUTHENTICATION & REDIRECTS
# ========================================
AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
]

LOGIN_REDIRECT_URL = '/profile/'
LOGOUT_REDIRECT_URL = '/'
LOGIN_URL = '/login/'

from django.contrib.messages import constants as messages
MESSAGE_TAGS = {
    messages.DEBUG: 'debug',
    messages.INFO: 'info',
    messages.SUCCESS: 'success',
    messages.WARNING: 'warning',
    messages.ERROR: 'error',
}


# ========================================
# EMAIL CONFIGURATION (GMAIL SMTP)
# ========================================
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'threeofkind1@gmail.com'
DEFAULT_FROM_EMAIL = 'Threeofkind.supply <threeofkind1@gmail.com>'
ADMIN_EMAIL = 'threeofkind1@gmail.com'

# PASSWORD DIAMBIL DARI ENVIRONMENT VARIABLE (Agar aman di GitHub)
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD') 

PASSWORD_RESET_TIMEOUT = 86400


# ========================================
# MIDTRANS PAYMENT GATEWAY
# ========================================
MIDTRANS_IS_PRODUCTION = True

# KEY DIAMBIL DARI ENVIRONMENT VARIABLE
MIDTRANS_SERVER_KEY = os.environ.get('MIDTRANS_SERVER_KEY')
MIDTRANS_CLIENT_KEY = os.environ.get('MIDTRANS_CLIENT_KEY')