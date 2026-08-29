from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "BhashaSetu"
    APP_VERSION: str = "1.0.0"
    DATABASE_URL: str = "sqlite+aiosqlite:///./data/bhashasetu.db"
    TRANSLATION_PROVIDER: str = "indictrans2"
    ASR_PROVIDER: str = "webspeech"
    TTS_PROVIDER: str = "gtts"
    LLM_PROVIDER: str = "template"
    MODELS_DIR: str = "./models"
    CONTENT_DIR: str = "./data/content"
    AUDIO_DIR: str = "./data/audio"
    CORS_ORIGINS: str = "*"
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    class Config:
        env_file = ".env"

settings = Settings()
