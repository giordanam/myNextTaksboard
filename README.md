# Taskboard - Next.js & TypeScript Migration

Una moderna applicazione per la gestione delle attività (Taskboard), migrata da un progetto React classico al framework **Next.js (App Router)** e convertita interamente da JavaScript a **TypeScript**.

## Tecnologie Utilizzate

- **Framework:** React 19 + Next.js (App Router)
- **Linguaggio:** TypeScript
- **Styling:** Tailwind CSS
- **Stato Globale:** React Context API (`TaskContext`, `FilterContext`)
- **Persistenza:** LocalStorage
- **Funzionalità Next.js Avanzate:** Parallel Routes, Intercepting Routes, Server Fetching, Suspense, Streaming UI (`loading.tsx`)

---

## Installazione e Avvio

Per avviare il progetto in ambiente di sviluppo:

```bash
npm install
npm run dev
```

L'applicazione sarà disponibile all'indirizzo `http://localhost:3000`.

---

## Struttura del Progetto (App Router)

Il progetto sfrutta le convenzioni di routing avanzate di Next.js, come i Route Groups `(dashboard)` per layout condivisi e le Parallel/Intercepting Routes `@modal/(.)task` per la gestione modale delle task.

src/
├── app/
│ ├── (dashboard)/ # Route Group: Condivide il layout senza alterare l'URL
│ │ ├── user/
│ │ │ └── page.tsx # Pagina vista utente specifica
│ │ ├── error.tsx # Gestione errori nativa per l'area dashboard
│ │ ├── layout.tsx # Layout condiviso (Header, Filtri)
│ │ ├── page.tsx # Server Component: Fetching iniziale asincrono
│ │ └── loading.tsx # UI Skeleton mostrato durante il fetch del server
│ ├── @modal/ # Parallel Route: Renderizza il modale in parallelo
│ │ ├── (.)task/[id]/ # Intercepting Route: Apre la task in modal sovrapponendosi
│ │ │ └── page.tsx
│ │ └── default.tsx # Fallback (ritorna null quando il modale è chiuso)
│ ├── task/[id]/ # Rotta Standard: Fallback se l'utente ricarica la pagina del modale
│ │ └── page.tsx
│ ├── globals.css # Stili globali e direttive Tailwind CSS
│ └── layout.tsx # Root Layout con i Provider globali (Context)
├── components/ # Client e Server Components (List, Card, FilterBar, ecc.)
├── contexts/ # Gestione dello stato globale (TaskContext, FilterContext)
├── services/ # Chiamate API (tasksApi.ts)
├── utils/ # Funzioni di utilità (filterUtils, apiUtils, dateUtils)
└── constants.tsx # Costanti globali e dati statici

---

## Architettura dei Dati: Fetching e Hydration

Per garantire la massima velocità di caricamento e un'ottima User Experience, l'applicazione utilizza un approccio ibrido per i dati:

1. **Server-Side Fetching:** Il file `page.tsx` effettua la richiesta dati iniziale sul server senza bloccare l'interfaccia utente (grazie a `loading.tsx`).
2. **Client-Side Hydration:** Il componente `<List>` funge da ponte. Al primo accesso (quando il `localStorage` è vuoto), riceve i dati del server e innesca il salvataggio nel `TaskContext`.
3. **Persistenza Continua:** Da quel momento in poi, il `TaskContext` prende il pieno controllo, gestendo in modo autonomo il salvataggio automatico sul browser tramite `localStorage`.

---

## Next.js: Server Components vs Client Components

In Next.js (App Router), ogni componente è di default un **Server Component** (renderizzato su server, zero JS inviato al client). Tramite la direttiva `"use client"` i componenti diventano interattivi.
L'obiettivo è stato spingere `"use client"` il più in basso possibile nell'albero (Push Down) per massimizzare le performance.

| Componente        | Serve `"use client"`? | Motivo                                                                                                                                                                                           |
| :---------------- | :-------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **page.tsx**      | **No**                | È stato rifattorizzato come puro Server Component. Si occupa solo del layout strutturale (`<div className="bg-gray-100...">`) delegando la logica ai figli.                                      |
| **TaskContainer** | **Sì**                | Funge da "Container". Detiene lo stato globale (`tasks`), la logica del LocalStorage e le funzioni di modifica. È il punto più basso in cui lo stato può risiedere per essere condiviso.         |
| **Button**        | **Sì**                | Gestisce eventi interattivi dell'utente (es. `onClick`).                                                                                                                                         |
| **DetailModal**   | **Sì**                | È un form interattivo. Usa `useState` per tenere traccia degli input e gestisce eventi `onSubmit`.                                                                                               |
| **FilterBar**     | **Sì**                | Legge lo stato globale tramite l'hook personalizzato `useFilters` e gestisce interazioni.                                                                                                        |
| **FilterContext** | **Sì**                | Il Provider del Context usa `useState` e `createContext` per memorizzare i filtri. La memoria di stato globale deve esistere sul browser dell'utente, quindi è un Client Component obbligatorio. |
