import os
from supabase import create_client, Client
from typing import Dict, Any

class SupabaseService:
    def __init__(self):
        url: str = os.getenv("SUPABASE_URL")
        key: str = os.getenv("SUPABASE_SERVICE_KEY")
        self.supabase: Client = create_client(url, key)

    def download_file(self, bucket: str, path: str) -> str:
        """Downloads a file from Supabase Storage and returns the local path."""
        res = self.supabase.storage.from_(bucket).download(path)
        
        # Save locally for processing
        local_path = f"tmp_{os.path.basename(path)}"
        with open(local_path, "wb") as f:
            f.write(res)
        return local_path

    def update_document(self, doc_id: str, updates: Dict[str, Any]):
        """Updates a document record in the database."""
        return self.supabase.table("documents").update(updates).eq("id", doc_id).execute()

    def insert_questions(self, questions: list):
        """Inserts generated questions into the database."""
        return self.supabase.table("questions").insert(questions).execute()

supabase_service = SupabaseService()
