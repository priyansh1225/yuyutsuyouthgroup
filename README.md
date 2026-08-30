# Yuyutsu Youth Group

## About the Project

Yuyutsu Youth Group is a website created to represent the group's work and make it easier for people to connect with us. It explains what we do, why we do it, and how people can get involved.

## Features

- Information about the group and its activities
- Gallery to showcase our work
- Admin panel for managing content
- Image upload and post management
- Admin authentication
- Audit logs for tracking important actions

- ## Technologies Used

- HTML
- CSS
- JavaScript
- Supabase
- Git & GitHub

- ## Project Structure

- `index.html` — Main website page
- `gallery.html` — Displays posts and images
- `admin.html` — Admin panel
- `script.js` — JavaScript for the main website
- `gallery.js` — Handles gallery data and display
- `admin.js` — Handles admin authentication and content management
- `audit.js` — Handles audit log creation and verification
- `supabase-client.js` — Initializes the Supabase connection

- ## How It Works

The website uses JavaScript to interact with Supabase.

The main website retrieves content from Supabase and displays it to visitors. The admin panel allows authorized users to manage website content, including uploading and deleting images.

Supabase is used for authentication, database operations, and image storage.


## Audit Logging

The project includes an audit logging system to keep track of important actions performed in the admin panel.

Actions such as login, logout, inserting data, and deleting data can be recorded in the audit log. Each log entry is linked to the previous entry using a hash, creating a hash chain.

The purpose of this system is to make unauthorized changes to the audit history easier to detect.


## Security Considerations

The audit logging system is designed to provide tamper-evident records, but it is not a completely tamper-proof system.

Currently, the application relies on client-side code for parts of the audit logging process. This means that a user with sufficient database privileges could potentially modify or remove audit records.

A future improvement is to move security-sensitive audit operations to the server or database side and use stricter access policies to protect the audit records.

## Future Improvements

- Move audit logging to a more trusted server-side or database-side process
- Improve database access policies
- Add stronger validation for uploaded files
- Improve error handling and user feedback
- Add more administrative controls
