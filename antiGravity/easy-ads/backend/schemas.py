from pydantic import BaseModel
from typing import Optional, List

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    class Config:
        orm_mode = True

class ProductBase(BaseModel):
    name: str
    description: str

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int
    user_id: int
    image_url: str
    class Config:
        orm_mode = True

class GenerationBase(BaseModel):
    prompt: str

class GenerationCreate(GenerationBase):
    product_id: int

class Generation(GenerationBase):
    id: int
    result_image_url: Optional[str] = None
    result_video_url: Optional[str] = None
    status: str
    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
