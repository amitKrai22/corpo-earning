from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
import shutil

from database import get_db
import models, schemas
from deps import get_current_user

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)

@router.post("/", response_model=schemas.Product)
async def create_product(
    name: str = Form(...),
    description: str = Form(...),
    file: UploadFile = File(...),
    current_user: models.User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    file_location = f"uploads/{file.filename}"
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # In production, use full URL or relative path handled by frontend
    # For now, assuming localhost:8000
    image_url = f"http://localhost:8000/{file_location}"
    
    new_product = models.Product(
        name=name, 
        description=description, 
        image_url=image_url, 
        user_id=current_user.id
    )
    db.add(new_product)
    await db.commit()
    await db.refresh(new_product)
    return new_product

@router.get("/", response_model=List[schemas.Product])
async def read_products(current_user: models.User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Product).filter(models.Product.user_id == current_user.id))
    products = result.scalars().all()
    return products
