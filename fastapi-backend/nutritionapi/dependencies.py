from fastapi import HTTPException, Depends
from fastapi.security import OAuth2AuthorizationCodeBearer
from jose import jwt, JWTError
from urllib.request import urlopen
import json
from config import AUTH0_DOMAIN, ALGORITHMS, API_AUDIENCE

oauth2_scheme = OAuth2AuthorizationCodeBearer(
    authorizationUrl=f"https://{AUTH0_DOMAIN}/authorize",
    tokenUrl=f"https://{AUTH0_DOMAIN}/oauth/token"
)

def get_token_auth_header(token: str = Depends(oauth2_scheme)):
    try:
        jsonurl = urlopen(f"https://{AUTH0_DOMAIN}/.well-known/jwks.json")
        jwks = json.loads(jsonurl.read())
        unverified_header = jwt.get_unverified_header(token)
        rsa_key = {}
        for key in jwks['keys']:
            if key['kid'] == unverified_header['kid']:
                rsa_key = {
                    'kty': key['kty'],
                    'kid': key['kid'],
                    'use': key['use'],
                    'n': key['n'],
                    'e': key['e']
                }
        payload = jwt.decode(
            token, rsa_key, algorithms=ALGORITHMS,
            audience=API_AUDIENCE, issuer=f"https://{AUTH0_DOMAIN}/"
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except JWTError as e:
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        raise HTTPException(status_code=401, detail="Unable to parse authentication token.")
