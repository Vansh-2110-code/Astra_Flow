# Remember Me Functionality - Testing Guide

## Implementation Complete

All changes have been implemented successfully:

✅ **authService.js** - Added storage utility functions
✅ **Login.jsx** - Updated to use storeAuthData with rememberMe
✅ **api.js** - Updated interceptors to check both storages

---

## Testing Instructions

### Prerequisites

1. Clear all browser storage before testing:
   ```javascript
   // Run in browser console:
   localStorage.clear();
   sessionStorage.clear();
   ```

2. Have the application running:
   ```bash
   npm run dev
   ```

---

## Test Suite

### Test 1: Remember Me CHECKED (localStorage)

**Steps:**
1. Navigate to login page
2. ✅ **Check** the "Remember me" checkbox
3. Enter valid credentials and login
4. After successful login, open DevTools → Application → Storage
5. **Verify localStorage contains:**
   - `access_token`
   - `refresh_token`
   - `user`
   - `rememberMe` = `"true"`
6. **Verify sessionStorage is empty** (no tokens)
7. Navigate around the app (should work normally)
8. **Close the entire browser** (all windows)
9. Reopen browser and navigate to the app URL
10. **Expected Result:** User is still logged in (no redirect to login page)

**Pass Criteria:**
- ✅ Tokens stored in localStorage
- ✅ User remains logged in after browser restart
- ✅ Can access protected routes without re-login

---

### Test 2: Remember Me UNCHECKED (sessionStorage)

**Steps:**
1. Logout from the app
2. Navigate to login page
3. ❌ **Uncheck** the "Remember me" checkbox
4. Enter valid credentials and login
5. After successful login, open DevTools → Application → Storage
6. **Verify sessionStorage contains:**
   - `access_token`
   - `refresh_token`
   - `user`
7. **Verify localStorage contains:**
   - `rememberMe` = `"false"` (only this)
   - No tokens in localStorage
8. Navigate around the app (should work normally)
9. **Refresh the page** (F5 or Ctrl+R)
10. **Expected Result:** Still logged in (sessionStorage persists during session)
11. **Close the entire browser** (all windows)
12. Reopen browser and navigate to the app URL
13. **Expected Result:** User is logged out (redirected to login page)

**Pass Criteria:**
- ✅ Tokens stored in sessionStorage
- ✅ User remains logged in during same browser session
- ✅ User logged out after browser close
- ✅ Redirected to login page on app access

---

### Test 3: Checkbox State Persists

**Steps:**
1. Navigate to login page
2. ✅ **Check** the "Remember me" checkbox
3. Login successfully
4. Navigate around the app
5. Logout
6. **Expected Result:** Checkbox is still checked on login page
7. ❌ **Uncheck** the checkbox
8. Login successfully
9. Logout
10. **Expected Result:** Checkbox is unchecked on login page

**Pass Criteria:**
- ✅ Checkbox state persists across login/logout cycles
- ✅ State is read from localStorage on component mount

---

### Test 4: Token Refresh Works with Both Storages

**Test 4A: With localStorage (Remember Me checked)**

**Steps:**
1. Login with Remember Me checked
2. Verify tokens in localStorage
3. Wait for access token to expire (or manually delete access_token from localStorage)
4. Make an API request (navigate to a page that fetches data)
5. **Expected Result:** 
   - Token refresh triggers automatically
   - New access_token stored in localStorage
   - Request succeeds
   - User not logged out

**Test 4B: With sessionStorage (Remember Me unchecked)**

**Steps:**
1. Logout and login with Remember Me unchecked
2. Verify tokens in sessionStorage
3. Wait for access token to expire (or manually delete access_token from sessionStorage)
4. Make an API request (navigate to a page that fetches data)
5. **Expected Result:**
   - Token refresh triggers automatically
   - New access_token stored in sessionStorage
   - Request succeeds
   - User not logged out

**Pass Criteria:**
- ✅ Token refresh works with localStorage
- ✅ Token refresh works with sessionStorage
- ✅ Refreshed tokens stored in same storage type

---

### Test 5: Switching Between Remember Me States

**Steps:**
1. Login with Remember Me **checked**
2. Verify tokens in localStorage
3. Logout
4. Login with Remember Me **unchecked**
5. **Expected Result:** 
   - Old tokens cleared from localStorage
   - New tokens stored in sessionStorage
6. Navigate around (should work normally)
7. Logout
8. Login with Remember Me **checked** again
9. **Expected Result:**
   - Old tokens cleared from sessionStorage
   - New tokens stored in localStorage

**Pass Criteria:**
- ✅ Tokens move between storages correctly
- ✅ Old tokens are cleared when switching
- ✅ No token conflicts between storages

---

### Test 6: Manual Storage Clear

**Steps:**
1. Login with Remember Me checked
2. While logged in, open DevTools → Application → localStorage
3. Manually delete `access_token` and `refresh_token`
4. Try to make an API request (navigate to a page)
5. **Expected Result:** User is logged out (redirected to login)

**Pass Criteria:**
- ✅ App handles missing tokens gracefully
- ✅ User redirected to login page
- ✅ No JavaScript errors

---

### Test 7: Multiple Tabs (localStorage)

**Steps:**
1. Login with Remember Me checked
2. Open a new tab with the same app URL
3. **Expected Result:** User is logged in on second tab
4. Logout from first tab
5. **Expected Result:** Second tab should detect logout (on next API call or page refresh)

**Pass Criteria:**
- ✅ Login state shared across tabs with localStorage
- ✅ Logout clears tokens in all tabs

---

### Test 8: Multiple Tabs (sessionStorage)

**Steps:**
1. Login with Remember Me unchecked
2. Open a new tab with the same app URL
3. **Expected Result:** User is **NOT** logged in on second tab (sessionStorage is tab-specific)
4. Login on second tab (with Remember Me unchecked)
5. Close first tab
6. **Expected Result:** Second tab remains logged in

**Pass Criteria:**
- ✅ sessionStorage isolates sessions per tab
- ✅ Each tab has independent login state

---

## Browser Console Verification Commands

### Check Token Locations

```javascript
// Check localStorage
console.log('localStorage tokens:', {
    access: localStorage.getItem('access_token'),
    refresh: localStorage.getItem('refresh_token'),
    user: localStorage.getItem('user'),
    rememberMe: localStorage.getItem('rememberMe')
});

// Check sessionStorage
console.log('sessionStorage tokens:', {
    access: sessionStorage.getItem('access_token'),
    refresh: sessionStorage.getItem('refresh_token'),
    user: sessionStorage.getItem('user')
});
```

### Force Token Expiry (for testing refresh)

```javascript
// Delete access token to force refresh
localStorage.removeItem('access_token');
// OR
sessionStorage.removeItem('access_token');
```

### Clear All Storage

```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

---

## Expected Behavior Summary

| Scenario | Remember Me | Token Storage | Persists on Browser Close | Shared Across Tabs |
|----------|-------------|---------------|---------------------------|-------------------|
| Checked  | ✅ True     | localStorage  | ✅ Yes                    | ✅ Yes            |
| Unchecked| ❌ False    | sessionStorage| ❌ No                     | ❌ No             |

---

## Troubleshooting

### Issue: Checkbox doesn't stay checked after login/logout

**Solution:** Check that `rememberMe` state is initialized from localStorage:
```javascript
const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem('rememberMe') === 'true';
});
```

### Issue: Tokens in both storages

**Solution:** This shouldn't happen. If it does:
1. Clear both storages
2. Login fresh
3. Verify only one storage has tokens

### Issue: Token refresh fails

**Check:**
1. Network tab for refresh endpoint call
2. Console for error messages
3. Verify refresh_token exists in correct storage
4. Verify backend refresh endpoint is working

### Issue: User logged out unexpectedly

**Check:**
1. Verify tokens exist in storage
2. Check if tokens expired and refresh failed
3. Check browser console for errors
4. Verify backend is accessible

---

## Success Criteria Checklist

After completing all tests, verify:

- ✅ Remember Me checkbox works correctly
- ✅ Tokens stored in correct storage based on checkbox
- ✅ localStorage persists across browser restarts
- ✅ sessionStorage clears on browser close
- ✅ Checkbox state persists
- ✅ Token refresh works with both storages
- ✅ No token conflicts between storages
- ✅ Logout clears all tokens
- ✅ No console errors
- ✅ Smooth user experience

---

## Test Results Template

Copy this template to record your test results:

```
# Remember Me Testing - [Date]

## Test 1: Remember Me CHECKED
- Status: [ ] Pass / [ ] Fail
- Notes: 

## Test 2: Remember Me UNCHECKED
- Status: [ ] Pass / [ ] Fail
- Notes: 

## Test 3: Checkbox State Persists
- Status: [ ] Pass / [ ] Fail
- Notes: 

## Test 4A: Token Refresh (localStorage)
- Status: [ ] Pass / [ ] Fail
- Notes: 

## Test 4B: Token Refresh (sessionStorage)
- Status: [ ] Pass / [ ] Fail
- Notes: 

## Test 5: Switching States
- Status: [ ] Pass / [ ] Fail
- Notes: 

## Test 6: Manual Storage Clear
- Status: [ ] Pass / [ ] Fail
- Notes: 

## Test 7: Multiple Tabs (localStorage)
- Status: [ ] Pass / [ ] Fail
- Notes: 

## Test 8: Multiple Tabs (sessionStorage)
- Status: [ ] Pass / [ ] Fail
- Notes: 

## Overall Result
- All Tests Passed: [ ] Yes / [ ] No
- Issues Found: 
- Browser Tested: 
- Tester: 
```

---

## Additional Notes

- The implementation is backward compatible - existing users with tokens in localStorage will continue to work
- Default behavior is `rememberMe = true` (uses localStorage) if not specified
- The `rememberMe` preference itself is always stored in localStorage (not sessionStorage) so it persists
- Token refresh logic intelligently uses the same storage type as the refresh token

**Implementation Status: ✅ COMPLETE AND READY FOR TESTING**
