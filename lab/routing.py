from django.urls import re_path
from .consumers import CodeExecutionConsumer


websocket_urlpatterns = [
    re_path(
        r"ws/run-code/$",
        CodeExecutionConsumer.as_asgi()
    ),
]