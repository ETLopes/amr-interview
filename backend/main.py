from app.main import app
from app.crud.users import UserRepository  # re-export for tests that patch main.UserRepository

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
