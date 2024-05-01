from fastapi import APIRouter, Depends, Query, HTTPException, Path, Body
from include.dependencies import get_token_auth_header, get_auth0
from include.models import Metadata, Goals
from include.database import get_db_connection


router = APIRouter(tags=["Metadata Updating"])






@router.post("/api/update_user")
async def update_user(metadata: Metadata, current_user: dict = Depends(get_token_auth_header)):
    """
    Updates the metadata for a user in Auth0.

    This endpoint receives user metadata and the current authenticated user, then updates the user's metadata
    in Auth0. It requires the user to be authenticated and their metadata must comply with the defined Metadata model.

    Args:
        metadata (Metadata): A Pydantic model that contains user metadata fields.
        current_user (dict): A dictionary representing the authenticated user, containing the relevant fields.

    Returns:
        dict: A dictionary with a success status and data about the user if the update is successful.

    Raises:
        HTTPException: An error 400 is raised if there is any exception during the user metadata update process,
                        containing the error message.
    """
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


@router.post("/api/update_goals")
async def update_goals(goals: Goals, current_user: dict = Depends(get_token_auth_header)):
    """
    Updates the diet and nutrition goals for a user in Auth0.

    This endpoint receives nutrition goals and the current authenticated user, then updates or creates the user's goals
    in Auth0. It requires the user to be authenticated and their goals must comply with the defined Goals model.

    Args:
        goals (Goals): A Pydantic model that contains fields for calories, carbohydrates, protein, and fat.
        current_user (dict): A dictionary representing the authenticated user, containing the relevant fields.

    Returns:
        dict: A dictionary with a success status and data about the user if the update is successful.

    Raises:
        HTTPException: An error 400 is raised if there is any exception during the user goals update process,
                        containing the error message.
    """
    try:
        auth0 = get_auth0()
        # Update or create user goals
        goals_dict = goals.dict()
        print(goals_dict)
        # Fetch existing metadata if available
        existing_metadata = auth0.users.get(current_user['uid']).get('user_metadata', {})
        existing_metadata['goals'] = goals_dict  # Update or set the goals

        response = auth0.users.update(current_user['uid'], {
            'user_metadata': existing_metadata
        })
        return {"success": True, "data": response}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
