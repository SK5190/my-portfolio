# Deploy: Vercel (frontend) + Render (backend)

Your repo is ready for this setup. Follow these steps in order.

---

## 1. Backend on Render

1. Go to **[render.com](https://render.com)** → sign in with GitHub.
2. **New → Web Service** → select your portfolio repo.
3. Settings:
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. **Environment** → Add:
   - `MONGODB_URI` = your MongoDB Atlas connection string (e.g. `mongodb+srv://user:pass@cluster.xxx.mongodb.net/portfolio`)
   - `FRONTEND_URL` = leave empty for now (you’ll set it after deploying the frontend)
5. **Create Web Service.** Wait for the first deploy to succeed.
6. Copy your backend URL, e.g. **`https://your-app-name.onrender.com`** (no trailing slash).

---

## 2. Upload your resume (optional, do this while backend is on Render)

You can upload your resume **from your machine** so it’s on the deployed backend (and stays there if you use ImageKit).

1. In the **project root** (not inside `backend`), create or edit **`.env`** and set the API to your **Render** backend:
   ```env
   VITE_API_URL=https://your-app-name.onrender.com
   ```
   (Use your real Render URL, no trailing slash.)

2. From the project root run the frontend:
   ```bash
   npm run dev
   ```

3. Open **http://localhost:5173**. You’ll see the **“Update Resume”** button (it only shows in local dev).

4. Click **Update Resume** → choose your PDF (or Word) file. It will upload to your **Render** backend.

5. **If you set ImageKit on Render** (see step 4 below): the resume is stored in ImageKit and its URL in MongoDB, so it **persists across redeploys**.  
   **If you don’t use ImageKit:** the resume is stored on Render’s disk and may be lost on redeploy (you can re-upload locally again).

6. When you’re done, you can set `.env` back to `VITE_API_URL=http://localhost:4000` for everyday local dev, or leave it pointing to Render if you prefer.

---

## 3. Frontend on Vercel

1. Go to **[vercel.com](https://vercel.com)** → sign in with GitHub.
2. **Add New → Project** → import the **same** repo.
3. Settings:
   - **Root Directory:** leave default (repo root)
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. **Environment Variables** → Add:
   - **Name:** `VITE_API_URL`
   - **Value:** your Render backend URL, e.g. `https://your-app-name.onrender.com` (no trailing slash)
5. **Deploy.** Wait for the build to finish.
6. Copy your site URL, e.g. **`https://your-project.vercel.app`**.

---

## 4. Connect frontend and backend (CORS)

1. In **Render** → your backend service → **Environment**.
2. Add or set **`FRONTEND_URL`** = your Vercel URL, e.g. `https://your-project.vercel.app`.
3. Save. Render will redeploy so the frontend can call the API.

---

## 5. Optional: ImageKit (persistent resume + project/certificate images)

On **Render → Environment**, add:

- `IMAGEKIT_URL_ENDPOINT`
- `IMAGEKIT_PUBLIC_KEY`
- `IMAGEKIT_PRIVATE_KEY`

Then the resume (and project/certificate images) are stored in ImageKit and **survive redeploys**. Without these, the resume is stored on disk and may be lost on redeploy.

---

## Checklist

| Step | Done |
|------|------|
| MongoDB Atlas cluster + connection string | ☐ |
| Repo pushed to GitHub | ☐ |
| Render: Web Service, root `backend`, `MONGODB_URI` set | ☐ |
| (Optional) Run frontend locally with `VITE_API_URL=<Render URL>`, upload resume | ☐ |
| Vercel: import repo, set `VITE_API_URL` = Render URL, deploy | ☐ |
| Render: set `FRONTEND_URL` = Vercel URL | ☐ |
| (Optional) ImageKit env vars on Render | ☐ |

---

## Is this project set for deployment?

- **Frontend:** Uses `VITE_API_URL` for the API (defaults to `http://localhost:4000` in dev). Vercel will inject it at build time. No code changes needed.
- **Backend:** Runs with `npm start`, reads `MONGODB_URI` and `FRONTEND_URL` from env. Render runs from the `backend` folder. No code changes needed.
- **Resume:** “Download Resume” uses the same API base. “Update Resume” only appears when you run the app locally (`npm run dev`); visitors on Vercel never see it. Upload from local with `VITE_API_URL` pointing to Render to put the file on the deployed backend.
