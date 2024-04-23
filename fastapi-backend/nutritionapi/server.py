import json
from urllib.request import urlopen

from fastapi import Depends, FastAPI, HTTPException, Request, Security
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2AuthorizationCodeBearer
from jose import JWTError, jwt

# Configuration
AUTH0_DOMAIN = 'dev-dvb6li7z8kj02il0.us.auth0.com'
API_AUDIENCE = 'https://nutrition/info'  
ALGORITHMS = ["RS256"]

app = FastAPI()

oauth2_scheme = OAuth2AuthorizationCodeBearer(
    authorizationUrl=f"https://{AUTH0_DOMAIN}/authorize",
    tokenUrl=f"https://{AUTH0_DOMAIN}/oauth/token"
)

# Custom exception for auth errors
class AuthError(Exception):
    def __init__(self, error: dict, status_code: int):
        self.error = error
        self.status_code = status_code

@app.exception_handler(AuthError)
async def auth_exception_handler(request: Request, exc: AuthError):
    return JSONResponse(status_code=exc.status_code, content=exc.error)


# Dependency to get the token and validate it
def get_token_auth_header(token: str = Depends(oauth2_scheme)):
    try:
        # Fetch the public key from Auth0
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
        # Validate the token using the rsa_key
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


@app.get("/api/public")
async def public():
    return {"message": "Hello from a public endpoint! You don't need to be authenticated to see this."}

@app.get("/api/private")
async def private(current_user: dict = Depends(get_token_auth_header)):
    return current_user
        
        # { "message": f"Hello from a private endpoint! You need to be authenticated to see this. Your "}



# update user metadata
# -- height, weight, gender

# post
# -- Updates database with meal info and user_id info

# get
# -- Take user info and find corresponding meals filtered by date