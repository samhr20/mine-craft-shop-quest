# Production Setup Guide

## Issue: Products not loading in production AdminProducts page

### Possible Causes:
1. **Environment Variables not set in production**
2. **Database RLS policies blocking access**
3. **Different database instance**
4. **Authentication issues**

### Solutions:

#### 1. Check Environment Variables
Make sure your production deployment has these environment variables:
```bash
VITE_SUPABASE_URL=https://xwvkmhkmhsprqrtnbshc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3dmttaGttaHNwcnFydG5ic2hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4ODQyMTksImV4cCI6MjA3MjQ2MDIxOX0.ruZSVJN6Ap_zCM_1eBWeLdCQ39WQllBvQjKtf6oH648
```

#### 2. Run Database Fixes
Execute the SQL files in your Supabase dashboard:
1. `CHECK_PRODUCTION_DATABASE.sql` - Check current state
2. `FIX_PRODUCTION_RLS_POLICIES.sql` - Fix RLS policies

#### 3. Check Browser Console
Open browser dev tools and check for errors:
- Network tab for failed requests
- Console tab for JavaScript errors
- Look for Supabase connection errors

#### 4. Verify Admin Access
Make sure your user has admin privileges:
- Check `admin_users` table
- Verify `admin_roles` permissions
- Ensure user is marked as `is_active = true`

#### 5. Test Database Connection
Add this temporary code to test connection:
```javascript
// Test in browser console
const { data, error } = await supabase.from('products').select('count');
console.log('Connection test:', { data, error });
```

### Quick Fix Steps:
1. Deploy with correct environment variables
2. Run the RLS policy fixes in Supabase
3. Check browser console for specific errors
4. Verify admin user permissions
5. Test database connection

### If Still Not Working:
1. Check if you're using the same Supabase project for local and production
2. Verify the database has product data
3. Check if RLS is enabled and policies are correct
4. Ensure authentication is working in production

