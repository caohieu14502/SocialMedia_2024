import cloudinary
from oauth2_provider.backends import OAuth2Backend
from social_media.models import User
from rest_framework.authentication import TokenAuthentication
from google.oauth2 import id_token
from google.auth.transport import requests


class CustomOAuth2Authentication(TokenAuthentication):
    def authenticate(self, request):
        user = super().authenticate(request)
        if not user:
            try:
                token = request.META['HTTP_AUTHORIZATION'].split()
                idinfo = id_token.verify_oauth2_token(token[1], requests.Request(), '611265397810-sg0qqdi3ik2rqvrsvbuq2e3adv014apt.apps.googleusercontent.com')
                email = idinfo['email']
                user, created = User.objects.get_or_create(email=email)
                if created:
                    user.first_name = idinfo["given_name"]
                    if 'family_name' in idinfo:
                        user.last_name = idinfo["family_name"]
                    user.username = idinfo["email"].split("@")[0]
                    user.avatar = cloudinary.uploader.upload_resource(idinfo["picture"])

                    user.save()

                return user, idinfo
            except ValueError as e:
                print('Error Authenticators.py\n')
                print(e)
                return None


# class CustomOAuth2Backend(OAuth2Backend):
#     def authenticate(self, request=None, **credentials):
        # print("vo duoc roi ne")
        # authen = super().authenticate(request=request, **credentials)
        # print(authen)
        # if authen:
        #     return authen
        # token = request.META['HTTP_AUTHORIZATION'].split()
        # payload = jwt.decode(token, verify=False)
        # email = payload.get('email')
        # user = User.objects.get_or_create(email=email)

        # return None#user

