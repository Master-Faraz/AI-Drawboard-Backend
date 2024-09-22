from dotenv import load_dotenv
import os
load_dotenv()

# SERVER_URL = 'https://ai-drawboard-backend.onrender.com'
# PORT = '8000'
# ENV = 'dev'

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")