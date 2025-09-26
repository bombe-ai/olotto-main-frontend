# Vercel Deployment Issues & Solutions

**Date:** September 23, 2025  
**Project:** Omillionaire Indian Site Client

---

## 🚨 Problems We Encountered

### 1. **npm vs pnpm Dependency Conflicts**

**Error:**

```
npm error ERESOLVE unable to resolve dependency tree
npm error peer react@"^18.0.0" from react-jhipster@0.25.3
npm error Found: react@19.1.1
```

**What happened:** When trying to deploy with `npm install`, it failed because some libraries expect React 18 but we're using React 19.

### 2. **Vercel Configuration Error**

**Error:**

```
Invalid request: should NOT have additional property `nodeVersion`. Please remove it.
```

**What happened:** Used wrong property name in vercel.json configuration file.

### 3. **404 Page Not Found on Routes**

**Error:** Visiting `yoursite.com/register` directly showed "404 NOT_FOUND" instead of the register page.

**What happened:** Vercel was looking for physical files like `/register.html` instead of letting React Router handle the routing.

---

## ✅ Solutions Applied

### 1. **Fixed npm Compatibility**

**Solution:** Created `.npmrc` file with:

```
legacy-peer-deps=true
```

**Why this works:** Tells npm to use older, more flexible dependency resolution that allows React 19 with React 18-expecting libraries.

**Result:** `npm install` now works without errors during deployment.

### 2. **Fixed Vercel Configuration**

**Solution:** Created proper `vercel.json`:

```json
{
  "buildCommand": "pnpm run build",
  "outputDirectory": "dist",
  "installCommand": "pnpm install --frozen-lockfile",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Why this works:**

- Tells Vercel to use pnpm (our preferred package manager)
- Redirects ALL routes to index.html so React Router can handle them
- Uses correct property names Vercel recognizes

### 3. **Fixed Node.js Version**

**Solution:** Created `.nvmrc` file with:

```
18
```

**Why this works:** Forces Vercel to use Node.js 18, which is stable and compatible with our build process.

---

## 📁 Files You Need to Copy for Deployment

When deploying to Vercel, make sure these files are included:

1. **`.npmrc`** - Fixes npm compatibility
2. **`vercel.json`** - Configures Vercel properly
3. **`.nvmrc`** - Sets correct Node.js version
4. **`package.json`** - Your dependencies (make sure it has the engines field)

---

## 🚀 Deployment Process

1. **Copy your project** to a clean folder
2. **Include the 4 config files** mentioned above
3. **Deploy to Vercel** - it should now work correctly
4. **Test the routes** - `/register`, `/login`, etc. should work

---

## 🎯 Why These Issues Happened

- **React 19 is new** - some libraries haven't updated their compatibility requirements yet
- **Different package managers** handle dependencies differently (pnpm vs npm)
- **Single Page Applications** need special server configuration to handle client-side routing
- **Vercel has specific syntax** requirements for configuration files

---

## ⚠️ Important Notes

- **Don't downgrade React** - the warnings about React 18 vs 19 are harmless
- **Keep using pnpm locally** - it works fine for development
- **These config files make npm work** for deployment without changing our development setup
- **The CORS issues** need to be fixed on the backend server, not in our frontend code

---

**Bottom Line:** The deployment now works because we told Vercel exactly how to handle our React 19 app with proper routing and dependency resolution.
