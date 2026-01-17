<img width="1700" height="460" alt="github-header-banner" src="https://github.com/user-attachments/assets/888422d6-dd92-4d50-bcd4-b879548a3980" />

</br>
</br>

**It’s the man drawer for developers.**
Packed full of handy tools you always need.

TheDevDraw is a growing collection of fast, simple developer tools all in one place.
No ads. No popups. No nonsense. Just useful stuff.

## 🔗 Live Site

👉 https://thedevdraw.dev

## 💡 Motivation

I got fed up of constantly jumping between different websites for different tools.

Each one comes with its own:

- UI patterns
- reliability issues
- cookie banners
- popups
- adverts
- tracking
- random paywalls

TheDevDraw exists to solve that.

One fast site.
One clean UI.
All the tools you need.

## ⚙️ Tech Stack

Built with a modern frontend stack:

- React
- TypeScript
- Vite
- Material UI

Pure frontend. No backend. No tracking.

## 🧰 Features

Current tools available:

- Password generator
- QR code generator
- Base64 encode and decode
- JWT encode (not signed) and decode

More tools will be added over time.

## 🚀 Running Locally

This repository is a workspace containing three projects:

- tdd-components
- tdd-tools
- tdd-app

tdd-app is the main application.

The others are shared packages and only need installing and building.

### Install dependencies

```bash
npm install
```

### Build workspace packages

```bash
npm run build
```

### Run the app

```bash
cd packages/tdd-app
npm run dev
```

## 🌍 Self Hosting

If you want to self host TheDevDraw, the repo includes a pre-configured `amplify.yml` at the root.

To deploy:

1.  Fork the repository
2.  Create a new AWS Amplify project
3.  Link your forked repo
4.  Deploy

That’s it. You will have your own hosted version of TheDevDraw.

## 🛠 Want a Tool Added?

If there is a tool you would like to see added, create an issue.

Suggestions are welcome.

## ⭐ Support the Project

If you find TheDevDraw useful, please consider starring the repo.
It helps others discover the project and keeps it growing.

## 📦 Roadmap

Planned tools include:

- JSON formatter and validator
- SQL formatter
- URL encoder and decoder
- Unix timestamp converter
- C# to TypeScript model converter
- Text diff tool
- Regex tester

## 📜 License

MIT
