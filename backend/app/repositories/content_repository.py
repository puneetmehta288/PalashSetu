from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.content import ContentItem

class ContentRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self):
        result = await self.db.execute(select(ContentItem))
        return result.scalars().all()

    async def get_by_id(self, item_id: int):
        result = await self.db.execute(select(ContentItem).where(ContentItem.id == item_id))
        return result.scalar_one_or_none()
