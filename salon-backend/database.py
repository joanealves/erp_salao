# database.py
import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")

print(f"SUPABASE_URL: {supabase_url}")
print(f"SUPABASE_SERVICE_KEY: {supabase_key}")

supabase: Client = create_client(supabase_url, supabase_key)