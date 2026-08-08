"""
Admin banane/manage karne ke liye helper — credentials code mein kahin nahi.
Isse DB ke `admins` collection mein ek admin daala jaata hai (password bcrypt-hashed).
Login isi DB record ko check karta hai.

Chalane ka tareeka (backend folder se, venv active):
    python create_admin.py
Ye email + password interactively poochega aur DB mein daal dega.
Agar wahi email pehle se hai to password update kar dega.
"""
import os
import asyncio
import getpass
import bcrypt
from datetime import datetime, timezone
from dotenv import load_dotenv
from pathlib import Path
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv(Path(__file__).parent / '.env')

mongo_url = os.environ['MONGO_URL']
db_name = os.environ.get('DB_NAME', 'portfolio_db')


async def main():
    email = input("Admin email: ").strip().lower()
    if not email:
        print("Email khali nahi ho sakta.")
        return
    password = getpass.getpass("Admin password: ").strip()
    if len(password) < 6:
        print("Password kam se kam 6 characters ka hona chahiye.")
        return

    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]

    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    existing = await db.admins.find_one({"email": email})
    if existing:
        await db.admins.update_one({"email": email}, {"$set": {"password": hashed}})
        print(f"✅ Admin ka password update ho gaya: {email}")
    else:
        await db.admins.insert_one({
            "email": email,
            "password": hashed,
            "created_at": datetime.now(timezone.utc),
        })
        print(f"✅ Naya admin ban gaya: {email}")

    client.close()


if __name__ == "__main__":
    asyncio.run(main())
