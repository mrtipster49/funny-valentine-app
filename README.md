# Valentine Crush Web App

A mobile-first Valentine proposal web app. Share with your crush via `?q=theirname` for a personalized link.

## Deploy for Free (Vercel)

### Step 1: Create a GitHub account (if you don't have one)

1. Go to [github.com](https://github.com) and sign up
2. Create a new repository (e.g. `valentine-app`)
3. Push this folder to GitHub:
   - In Terminal: `cd` into this folder
   - Run: `git init`
   - Run: `git add .`
   - Run: `git commit -m "Initial commit"`
   - Run: `git branch -M main`
   - Run: `git remote add origin https://github.com/YOUR_USERNAME/valentine-app.git`
   - Run: `git push -u origin main`

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign up (use "Continue with GitHub")
2. Click **Add New** → **Project**
3. Import your `valentine-app` repository
4. Click **Deploy** (no config needed)
5. Your app will be live at `https://your-project.vercel.app`

### Step 3: Telegram notifications (optional)

To get notified when someone says Yes:

1. Open Telegram, search for `@BotFather`
2. Send `/newbot` and follow the prompts
3. Copy the **Bot Token** you receive
4. Start a chat with your new bot and send "hi"
5. Visit `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates`
6. Find `"chat":{"id": 123456789}` — that's your **Chat ID**
7. In Vercel: go to your project → **Settings** → **Environment Variables**
8. Add:
   - `TELEGRAM_BOT_TOKEN` = your bot token
   - `TELEGRAM_CHAT_ID` = your chat ID
9. Redeploy (Deployments → ⋮ → Redeploy)

## Share your link

- Base: `https://your-project.vercel.app`
- For your crush: `https://your-project.vercel.app?q=ananya`

## Local development

Open `index.html` in a browser, or run:

```bash
npx serve .
```

Then visit `http://localhost:3000?q=ananya` to test.
