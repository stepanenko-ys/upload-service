import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings.config.base')
application = get_wsgi_application()

ON_HEROKU = os.environ.get("ON_HEROKU")
if ON_HEROKU:
    from whitenoise.django import DjangoWhiteNoise
    application = DjangoWhiteNoise(application)
