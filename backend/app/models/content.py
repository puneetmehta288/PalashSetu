from sqlalchemy import Column, Integer, String, DateTime, JSON
from app.core.database import Base
from datetime import datetime

class ContentItem(Base):
    __tablename__ = "content_items"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    type = Column(String) # lesson, worksheet, flashcard
    grade = Column(String)
    subject = Column(String)
    topic = Column(String)
    language = Column(String)
    version = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    content_data = Column(JSON)
    file_path = Column(String, nullable=True)

class SyncManifest(Base):
    __tablename__ = "sync_manifests"
    id = Column(Integer, primary_key=True, index=True)
    content_id = Column(Integer, index=True)
    version = Column(Integer)
    updated_at = Column(DateTime, default=datetime.utcnow)
    checksum = Column(String)

class Flashcard(Base):
    __tablename__ = "flashcards"
    id = Column(Integer, primary_key=True, index=True)
    topic = Column(String, index=True)
    hindi_text = Column(String)
    santali_text = Column(String)
    pronunciation = Column(String)
    visual = Column(String)
    audio_path = Column(String)
