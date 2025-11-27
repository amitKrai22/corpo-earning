from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from database import get_db
import models, schemas
from deps import get_current_user
from ai_service import ai_service

router = APIRouter(tags=["Generations"])

@router.post("/generate/", response_model=schemas.Generation)
async def generate_ad(
    generation: schemas.GenerationCreate,
    current_user: models.User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Verify product belongs to user
    result = await db.execute(select(models.Product).filter(models.Product.id == generation.product_id, models.Product.user_id == current_user.id))
    product = result.scalars().first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Create generation record
    new_gen = models.Generation(
        product_id=generation.product_id,
        prompt=generation.prompt,
        status="processing"
    )
    db.add(new_gen)
    await db.commit()
    
    # Call AI Service (Mock)
    image_url = await ai_service.generate_image(generation.prompt)
    video_url = await ai_service.generate_video(image_url)
    
    new_gen.result_image_url = image_url
    new_gen.result_video_url = video_url
    new_gen.status = "completed"
    await db.commit()
    await db.refresh(new_gen)
    
    return new_gen

@router.get("/generations/{product_id}", response_model=List[schemas.Generation])
async def get_generations(product_id: int, current_user: models.User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Generation).filter(models.Generation.product_id == product_id))
    generations = result.scalars().all()
    return generations
