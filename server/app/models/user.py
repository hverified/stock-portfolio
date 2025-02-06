from pydantic import BaseModel


class User(BaseModel):
    name: str
    contact_number: str
    email: str | None = None
    password: str


class UserInDB(User):
    hashed_password: str
