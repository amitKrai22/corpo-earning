from sqlalchemy import Column, Integer, String, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    
    products = relationship("Product", back_populates="owner")

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    image_url = Column(String) # URL of the uploaded product image
    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="products")
    generations = relationship("Generation", back_populates="product")

class Generation(Base):
    __tablename__ = "generations"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    prompt = Column(Text)
    result_image_url = Column(String, nullable=True)
    result_video_url = Column(String, nullable=True)
    status = Column(String, default="pending") # pending, completed, failed

    product = relationship("Product", back_populates="generations")
