backend:
source venv/bin/activate
uvicorn server:app --reload

mongo: 
brew services restart mongodb-community

frontend:
npm run dev

---

## Deploy (free): MongoDB Atlas + Render (backend) + Vercel (frontend)

1. **MongoDB Atlas** (free M0 cluster) — Database Access mein user banao,
   Network Access mein `0.0.0.0/0` allow karo (Render/Vercel ka IP fixed nahi hota),
   "Connect your application" se `mongodb+srv://...` URL copy karo.

2. **Backend → Render.com** (free web service):
   - New Web Service → GitHub repo connect → Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn server:app --host 0.0.0.0 --port $PORT`
   - Environment vars: `MONGO_URL` (Atlas string), `DB_NAME`, `CORS_ORIGINS`
     (frontend URL, step 3 ke baad update karo), `JWT_SECRET` (naya random
     secret — `python -c "import secrets; print(secrets.token_hex(32))"`),
     `SMTP_HOST`, `SMTP_PORT`, `SMTP_EMAIL`, `SMTP_PASSWORD`
   - Deploy ke baad backend URL milega, e.g. `https://xyz.onrender.com`
   - Free tier 15 min inactivity ke baad sleep hota hai, first request slow (~30-50s)

3. **Frontend → Vercel** (free):
   - New Project → GitHub repo connect → Root Directory: `frontend`
   - Next.js auto-detect ho jayega
   - Environment var: `NEXT_PUBLIC_BACKEND_URL` = Render backend URL (step 2)
   - Deploy → Vercel URL milega, e.g. `https://your-portfolio.vercel.app`

4. Render par wapas jaake `CORS_ORIGINS` ko Vercel URL se update karo, redeploy.

5. Admin banane ke liye: local `.env` mein `MONGO_URL` temporarily Atlas
   string pe switch karo, `python create_admin.py` chalao, phir wapas
   local Mongo pe switch kar do.

Real secrets kabhi `.env` file mein commit mat karo (already gitignored) —
sirf Render/Vercel dashboard ke environment variables mein daalo.
See `backend/.env.example` for required vars.
