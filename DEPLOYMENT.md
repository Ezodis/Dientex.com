# Deployment Guide

## Backend (Railway)

Your Django backend is deployed on Railway and should be accessible at `https://api.dientex.com`

### Environment Variables Required on Railway:
- `DATABASE_URL` - Automatically set by Railway PostgreSQL
- `DJANGO_SECRET_KEY` - Your Django secret key
- `DJANGO_DEBUG` - Set to `false` for production
- `DOMAIN` - Set to `dientex.com`
- `DJANGO_SUPERUSER_USERNAME` - Admin username (e.g., `admin`)
- `DJANGO_SUPERUSER_PASSWORD` - Admin password
- `GCS_BUCKET_NAME` - (Optional) Google Cloud Storage bucket name
- `GCS_PROJECT_ID` - (Optional) Google Cloud project ID
- `GOOGLE_APPLICATION_CREDENTIALS_JSON` - (Optional) GCS credentials as JSON string

### Backend API Endpoints:
All API endpoints are now prefixed with `/api/`:
- Health check: `https://api.dientex.com/health/`
- Dashboard: `https://api.dientex.com/api/dashboard/`
- Admin: `https://api.dientex.com/admin/`

## Frontend (Vercel)

Your Next.js frontend is deployed on Vercel at `https://dientex.com`

### Initial Vercel Setup:

1. **Configure Root Directory:**
   - Go to Project Settings
   - Find "Root Directory" section
   - Set to: `frontend/web`
   - Save changes

2. **Add Environment Variable:**
   - Go to Settings → Environment Variables
   - Click "Add New"
   - Enter:
     - Name: `NEXT_PUBLIC_API_URL`
     - Value: `https://api.dientex.com`
     - Apply to: Production, Preview, and Development
   - Save

3. **Redeploy your application:**
   - Go to "Deployments" tab
   - Click the three dots on the latest deployment
   - Select "Redeploy"

### Vercel Configuration:
The `vercel.json` file is configured to:
- Use Next.js framework
- Build from the `frontend/web` directory
- Use the backend URL configured in `NEXT_PUBLIC_API_URL`

## Testing the Deployment

### Test Backend:
```bash
# Health check
curl https://api.dientex.com/health/

# Dashboard endpoint (should return JSON)
curl https://api.dientex.com/api/dashboard/
```

### Test Frontend:
1. Visit `https://dientex.com`
2. You should see the dashboard load with data
3. Check browser console for any errors

## Common Issues

### Issue: "Error loading dashboard"
**Solution:** Make sure `NEXT_PUBLIC_API_URL` is set in Vercel environment variables and redeploy.

### Issue: CORS errors
**Solution:** Your backend `settings.py` already has CORS configured for `dientex.com`. Verify the `DOMAIN` environment variable is set correctly on Railway.

### Issue: 404 on API calls
**Solution:** Verify the backend is accessible at `https://api.dientex.com/api/dashboard/`

### Issue: GCS warnings
**Solution:** These are warnings, not errors. The app will work with local storage. To fix, add GCS credentials to Railway environment variables.

## Local Development

### Backend:
```bash
cd backend
python manage.py runserver
```

### Frontend:
```bash
cd frontend
cp .env.local.example .env.local
# Edit .env.local and set NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```

## Verification Checklist

- [ ] Railway backend is running and accessible
- [ ] `NEXT_PUBLIC_API_URL` is set in Vercel
- [ ] Backend health endpoint returns `{"status": "healthy"}`
- [ ] Dashboard endpoint returns JSON data
- [ ] Frontend loads without errors
- [ ] CORS is properly configured
- [ ] Database migrations are applied
