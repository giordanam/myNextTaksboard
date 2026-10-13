# Taskboard - Next.js & TypeScript Migration

Una moderna applicazione per la gestione delle attività (Taskboard), migrata da un progetto React classico al framework **Next.js (App Router)** e convertita interamente da JavaScript a **TypeScript**.

## Tecnologie Utilizzate

- **Framework:** React 19 + Next.js (App Router)
- **Linguaggio:** TypeScript
- **Styling:** Tailwind CSS
- **Stato Globale:** React Context API
- **Persistenza:** LocalStorage

---

## Installazione e Avvio

Per avviare il progetto in ambiente di sviluppo:

```bash
npm install
npm run dev
```

L'applicazione sarà disponibile all'indirizzo `http://localhost:3000`.

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
