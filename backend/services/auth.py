from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from supabase import create_client

from config import settings

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """Verify the Supabase access token by calling Supabase auth.getUser()."""
    token = credentials.credentials

    # Create a Supabase client with the user's access token
    supabase = create_client(settings.supabase_url, settings.supabase_service_role_key)
    try:
        response = supabase.auth.get_user(token)
        user = response.user
        if not user:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"user_id": user.id, "email": user.email}
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Authentication failed: {e}")
