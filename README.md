# অফিস মেস ম্যানেজার

অফিস মেসের সদস্য, মিল কাউন্ট, খরচ, সাপ্তাহিক মেনু ও মাসিক হিসাব পরিচালনার সিস্টেম।

## ফিচার

- সদস্য যোগ/বাদ, জমার টাকা ট্র্যাক
- দুপুর/রাত/দুটোই মিল এন্ট্রি
- বাজার, গ্যাস, ইউটিলিটি খরচ ট্র্যাকিং
- সাপ্তাহিক মেনু সেট করা
- প্রতি মিল রেট ও বকেয়া হিসাব

## Vercel Deploy

1. GitHub-এ push করুন:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mess-app.git
git push -u origin main
```

2. [vercel.com](https://vercel.com) এ গিয়ে GitHub repo import করুন — Next.js auto-detect হবে, Deploy করুন।

## Local চালান

```bash
npm install
npm run dev
```

## Tech Stack

Next.js 16 · TypeScript · Tailwind CSS v4 · Lucide React · localStorage
