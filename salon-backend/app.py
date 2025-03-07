from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routes import appointments, services, clients, stats

import os

load_dotenv()

app = FastAPI(title="Salon Management API")

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(appointments.router, prefix="/appointments", tags=["appointments"])
app.include_router(services.router, prefix="/services", tags=["services"])
app.include_router(clients.router, prefix="/clients", tags=["clients"])
app.include_router(stats.router, prefix="/stats", tags=["stats"])

@app.get("/")
async def read_root():
    return {"message": "Salon Management API running with MySQL"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)