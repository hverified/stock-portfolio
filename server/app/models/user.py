from pydantic import BaseModel, EmailStr


class User(BaseModel):
    name: str
    contact_number: str
    email: EmailStr | None = None
    password: str


class UserInDB(User):
    hashed_password: str
