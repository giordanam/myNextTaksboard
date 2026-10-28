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

```
src/
├── app/
│ ├── (dashboard)/ # Route Group: Condivide il layout senza alterare l'URL
│ │ ├── user/
│ │ │   └── page.tsx # Pagina vista utente specifica
│ │ ├── error.tsx # Gestione errori nativa per l'area dashboard
│ │ ├── layout.tsx # Layout condiviso (Header, Filtri)
│ │ ├── page.tsx # Server Component: Fetching iniziale asincrono
│ │ └── loading.tsx # UI Skeleton mostrato durante il fetch del server
│ ├── @modal/ # Parallel Route: Renderizza il modale in parallelo
│ │ ├── (.)task/[id]/ # Intercepting Route: Apre la task in modal sovrapponendosi
│ │ │   └── page.tsx
│ │ └── default.tsx # Fallback (ritorna null quando il modale è chiuso)
│ ├── task/[id]/ # Rotta Standard: Fallback se l'utente ricarica la pagina del modale
│ │     └── page.tsx
│ ├── globals.css # Stili globali e direttive Tailwind CSS
│ └── layout.tsx # Root Layout con i Provider globali (Context)
├── components/ # Client e Server Components (List, Card, FilterBar, ecc.)
├── contexts/ # Gestione dello stato globale (TaskContext, FilterContext)
├── services/ # Chiamate API (tasksApi.ts)
├── utils/ # Funzioni di utilità (filterUtils, apiUtils, dateUtils)
├── constants.tsx # Costanti globali e dati statici
└── proxy.ts # Protezione delle rotte private e controllo accessi
```

---

## Architettura dei Dati: Fetching e Hydration

Per garantire la massima velocità di caricamento e un'ottima User Experience, l'applicazione utilizza un approccio ibrido per i dati:

1. **Server-Side Fetching:** Il file `page.tsx` effettua la richiesta dati iniziale sul server senza bloccare l'interfaccia utente (grazie a `loading.tsx`).
2. **Client-Side Hydration:** Il componente `<List>` funge da ponte. Al primo accesso (quando il `localStorage` è vuoto), riceve i dati del server e innesca il salvataggio nel `TaskContext`.
3. **Persistenza Continua:** Da quel momento in poi, il `TaskContext` prende il pieno controllo, gestendo in modo autonomo il salvataggio automatico sul browser tramite `localStorage`.

---

## Next.js: Server Components vs Client Components

| Componente            | Serve `"use client"`? | Motivo                                                                                                                                                                                                                                     |
| :-------------------- | :-------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **(logged)/page.tsx** | **No**                | **[AGGIORNATO]** Non si occupa più solo del layout: ora è il componente incaricato di eseguire la `fetch` iniziale lato server, passando poi i dati estratti ai componenti figli.                                                          |
| **TaskProvider**      | **Sì**                | **[SOSTITUISCE TaskContainer]** Sostituisce il vecchio TaskContainer. Detiene lo stato globale (`tasks`), le funzioni CRUD e gestisce in automatico il salvataggio/lettura da `localStorage` tramite `useEffect`.                          |
| **List**              | **Sì**                | Riceve le `initialTasks` dal server e consuma il Context per renderizzare materialmente le card. È qui che avviene il raccordo tra i dati scaricati dal server e quelli presenti nel browser dell'utente.                                  |
| **FilterContext**     | **Sì**                | **[AGGIORNATO]** Non usa più un semplice `useState` isolato: ora legge e scrive lo stato della ricerca direttamente nell'URL (tramite `useSearchParams` e `router.replace`), utilizzando un `useEffect` per gestire il ritardo (debounce). |
| **FilterBar**         | **Sì**                | Legge lo stato globale tramite l'hook personalizzato `useFilters` e gestisce le interazioni e l'input dell'utente.                                                                                                                         |
| **Button**            | **Sì**                | Gestisce eventi interattivi dell'utente (es. `onClick`).                                                                                                                                                                                   |
| **DetailModal**       | **Sì**                | Gestisce lo stato visivo dell'avviso di uscita (`showWarning`) per prevenire la perdita dei dati non salvati, delegando la gestione degli input al componente interno `Form`.                                                              |
