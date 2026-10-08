import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.router import api_router
from app.db.session import execute_safe_query

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Verificação de integridade do DuckDB ao inicializar
    db_path = settings.get_resolved_db_path()
    if os.path.exists(db_path):
        try:
            res = execute_safe_query("SELECT COUNT(*) AS total FROM f_vendas;")
            print(f"🚀 [DuckDB Conectado] {db_path} ({res[0]['total']} transações)")
        except Exception as e:
            print(f"⚠️ [Aviso DuckDB] Erro ao testar query: {e}")
    else:
        print(f"⚠️ [Aviso DuckDB] Banco não encontrado em: {db_path}. Execute o gerador de dados.")
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend analítico com DuckDB e RN Intelligence (Gemini) para Business Intelligence Comercial.",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

@app.get("/", tags=["Health"])
def root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "database": settings.get_resolved_db_path(),
    }

@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
