# Lab Members Area

## Overview
A password-protected internal space for Maruvka Lab members to access shared resources, updates, and important links.

## Features
- 🔐 Password protection
- 📰 Internal updates/news feed
- 🔗 Organized resource links
- 🚀 Quick access shortcuts
- 📱 Responsive design
- 🌓 Dark mode support

## Setup

### 1. Set Your Password
The default password is `maruvka2026`. To change it:

1. Edit `.env.local` file (create it if it doesn't exist)
2. Set `NEXT_PUBLIC_LAB_PASSWORD` to your desired password:
   ```env
   NEXT_PUBLIC_LAB_PASSWORD=your_secure_password_here
   ```
3. Restart your development server

**Important:** The `.env.local` file is git-ignored and won't be committed to the repository.

### 2. Accessing the Members Area
- Navigate to `/members` or click "Members 🔒" in the navigation
- Enter the lab password
- Session persists until browser tab is closed or logout is clicked

## Customizing Content

### Adding/Updating Links
Edit [`content/members.ts`](../content/members.ts):

```typescript
links: [
  {
    category: 'Your Category Name',
    items: [
      { 
        name: 'Link Name', 
        url: 'https://example.com', 
        description: 'Brief description' 
      },
    ],
  },
],
```

### Adding Updates/News
Add new items to the `updates` array:

```typescript
updates: [
  {
    id: 2, // Increment the ID
    date: '2026-02-20',
    title: 'New Equipment Available',
    content: 'The new sequencer is ready for use...',
    author: 'Lab Manager',
  },
],
```

### Customizing Quick Links
Modify the `quickLinks` array:

```typescript
quickLinks: [
  { name: 'Tool Name', url: 'https://example.com', icon: '🔧' },
],
```

## Security Notes

### Current Implementation
- **Client-side password check**: Simple protection suitable for internal lab use
- Password stored in environment variable
- Session-based authentication (cleared on tab close)
- No user accounts or database

### Limitations
- Not suitable for highly sensitive data
- Password is shared among all members
- Protection can be bypassed by determined users
- Password visible in browser dev tools

### For Enhanced Security (Future)
If you need stronger protection, consider:
1. **NextAuth.js**: Add proper authentication with individual accounts
2. **Server-side validation**: Move password check to API routes
3. **Database**: Store encrypted credentials and session tokens
4. **Two-factor authentication**: Add SMS or authenticator app support
5. **IP restrictions**: Limit access to Technion network

## Maintenance

### Regular Updates
1. Add new lab updates to `content/members.ts`
2. Update links as resources change
3. Remove outdated information
4. Change password periodically (edit `.env.local`)

### Deployment
When deploying to production (Vercel, Netlify, etc.):
1. Add the environment variable in your hosting platform's dashboard
2. Set `NEXT_PUBLIC_LAB_PASSWORD` to your secure password
3. Never commit `.env.local` to the repository

## Usage Tips

### For Lab Members
- Bookmark `/members` for quick access
- You'll need to re-enter password if you:
  - Close the browser tab
  - Clear browser cache
  - Use a different device

### For Lab Admin
- Share the password securely (in person, encrypted message, etc.)
- Update the password if someone leaves the lab
- Keep `content/members.ts` updated with current resources
- Consider organizing weekly/monthly update posts

## Troubleshooting

### "Incorrect password"
- Verify the password in `.env.local`
- Restart the development server after changing `.env.local`
- Check for typos (passwords are case-sensitive)

### Changes not appearing
- Clear browser cache
- Restart development server
- Check that you saved `content/members.ts`

### Can't access in production
- Verify environment variable is set in hosting platform
- Check deployment logs for errors
- Ensure `.env.local` is not committed to git

## Future Enhancements

Potential features to add:
- [ ] File upload/download capability
- [ ] Calendar integration for lab events
- [ ] Lab member directory with contact info
- [ ] Equipment booking system
- [ ] Expense tracking integration
- [ ] Meeting scheduler
- [ ] Lab protocols repository
- [ ] Individual user accounts

## Support

For issues or questions:
- Contact the lab's web administrator
- Check Next.js documentation for deployment issues
- Review this guide for customization options
