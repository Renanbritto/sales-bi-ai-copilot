import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Sales BI & AI Copilot API"
    VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # AI Model
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
    
    # DuckDB Path (relativo ou absoluto)
    DUCKDB_PATH: str = os.getenv("DUCKDB_PATH", "")
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "*"
    ]
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )
    
    def get_resolved_db_path(self) -> str:
        if self.DUCKDB_PATH and os.path.isabs(self.DUCKDB_PATH) and os.path.exists(self.DUCKDB_PATH):
            return self.DUCKDB_PATH
        
        # Procura nas localizações padrão
        base_dir = Path(__file__).resolve().parent.parent.parent.parent
        candidates = [
            base_dir / "data" / "sales.duckdb",
            Path("data/sales.duckdb").resolve(),
            Path("../data/sales.duckdb").resolve(),
            Path("../../data/sales.duckdb").resolve(),
        ]
        for c in candidates:
            if c.exists():
                return str(c)
        return str(candidates[0])

settings = Settings()
