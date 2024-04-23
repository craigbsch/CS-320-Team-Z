from fastapi import APIRouter, Depends, Query, HTTPException, Path, Body
from include.dependencies import get_token_auth_header, get_auth0
from include.models import Metadata
from include.database import get_db_connection


router = APIRouter(tags=["Metadata Updating"])

@router.post("/api/update_user")
async def update_user_metadata(metadata: Metadata, current_user: dict = Depends(get_token_auth_header)):
    try:
        auth0 = get_auth0()
        # Update user metadata
        metadata_dict = metadata.model_dump()
        print(metadata_dict)
        response = auth0.users.update(current_user['uid'], {
            'user_metadata': metadata_dict
        })
        return {"success": True, "data": response}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


