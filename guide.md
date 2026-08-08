backend:
source venv/bin/activate
uvicorn server:app --reload

mongo: 
brew services restart mongodb-community

frontend:
npm run dev
