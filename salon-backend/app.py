# app.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from routes import appointments, services, clients

load_dotenv()

app = FastAPI(title="Salon Management API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Modify for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(appointments.router, prefix="/appointments", tags=["appointments"])
app.include_router(services.router, prefix="/services", tags=["services"])
app.include_router(clients.router, prefix="/clients", tags=["clients"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)