# Time Capsulator
A digital time capsule webapp.

## Demo
https://timecapsulator.herokuapp.com/home/

**Note** - Since this demo is deployed to heroku (free pack), it lacks some core functionalities:
- `celery` is not running. 
- The uploaded images can't be served back.

## Used Technologies
- Backend
	- Django (The web framework)
	- Django REST Framework (API toolkit - For usage with React)
	- Celery (Async Task Queue - Used to send emails and manage background tasks)
	- Google API Python client (For authentication)
	- PostgreSQL (The used database in production)
- Frontend
	- React (Building UI components)
	- Redux Toolkit (For state management & storing API data)
	- Tailwind CSS (For styling the React components)

## Local Setup
### The backend
After cloning the repo, go to the `backend/` directory and create a new python virtual environment:
```bash
cd backend/
python -m venv venv
source venv/bin/activate
```
Then install the `requirements.txt`:
```bash
pip install -r requirements.txt
```
Assuming you have created a [Google OAuth 2.0 client](https://support.google.com/cloud/answer/6158849?hl=en) & got a Gmail account ready (for sending the emails) the next step would be creating the `.env` file:
```bash
cd conf
touch .env
```
Then adding the OAuth 2.0 credentials & Gmail info in it:
```env
# backend/conf/.env
SOCIAL_AUTH_GOOGLE_OAUTH2_KEY="[your client id]"
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET="[your client secret]"
EMAIL_HOST_USER="[your gmail email address]"
EMAIL_HOST_PASSWORD="[your gmail app password or account password]"
```
Install and run the redis server (the Celery broker)
```bash
sudo pacman -S redis 
redis-server
```
Run the Celery worker
```
celery -A conf worker -l info
```

Now you can successfully migrate and run the django server:
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

### The frontend
Go to the frontend root directory and install the needed packages:
```bash
cd frontend/capsulator/
npm install
``` 
Finally, you can now use the app:
```bash
npm start
```