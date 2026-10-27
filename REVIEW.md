# Review del modulo ponte Next.js — task da completare

Hai usato molte convenzioni del router di Next.js, ed è un ottimo lavoro: route group `(dashboard)` con `layout`, `loading` ed `error` propri, parallel route `@modal` con intercepting route `(.)task/[id]` e la pagina vera `task/[id]` come fallback, fetch iniziale in un Server Component `async`, filtri salvati nell'URL con `useSearchParams` (così una vista filtrata si può condividere con un link), `useTransition` per il download. Sei andata ben oltre quello che chiedeva il modulo.

Il tema di questo giro è uno solo: **lascia che sia la struttura delle cartelle a decidere cosa si vede, non i componenti.** Oggi diversi componenti chiedono "su che pagina sono?" con `usePathname` e si nascondono o cambiano di conseguenza. In Next quella decisione spetta a layout e route group.

Stesse regole di sempre: i task sono in ordine, **un commit per task**, messaggi convenzionali. Prima di ogni consegna rileggi il diff e chiediti _"cos'altro tocca questa modifica?"_: due dei bug qui sotto nascono da funzionalità aggiunte in momenti diversi che non sono state verificate insieme.

---

## 1. Build verde

**Problema:** `npm run build` nel tuo repo fallisce al controllo dei tipi. Non è colpa del codice: `.next/dev` contiene tipi generati quando `page.tsx` stava ancora in `src/app/` e cerca un file che non esiste più. Su una copia pulita la build passa.

**Da fare:**

- Cancella la cartella `.next` e rilancia la build.
- Togli l'import `use` non usato in `@modal/(.)task/[id]/page.tsx` (è rimasto dal commit che ha eliminato l'unwrap della promise: è l'unico warning di lint).
- Togli il ritardo finto di 2 secondi in `fetchTasks` ("per test"). Se ti serve per vedere `loading.tsx`, mettilo dietro una condizione esplicita, ma non lasciarlo nel codice consegnato.

**Fatto quando:** `npm run lint` e `npm run build` sono puliti.

## 2. Due aree, due layout

**Problema:** `/login` sta sotto il root layout, quindi riceve l'header e i provider della board. Per nasconderlo, `Header` fa `if (pathname === '/login') return null`. Funziona, ma è il componente a correggere a posteriori una decisione che spettava alla struttura delle cartelle. In più `login/page.tsx` ha `'use client'` anche se si limita a mostrare `LoginForm`, che è già client.

**Da fare:**

- Crea due route group, per esempio `(auth)` per il login e `(app)` per tutto il resto. Il root layout tiene solo `<html>`, `<body>` e quello che serve davvero ovunque. Header, provider e `GlobalModals` vanno nel layout di `(app)`.
- Togli il controllo su `/login` da `Header`.
- Togli `'use client'` da `login/page.tsx`.

**Domanda su cui ragionare:** perché un route group (cartella tra parentesi) cambia il layout ma non l'URL? Quali URL ottieni dopo lo spostamento?

**Fatto quando:** `Header` non contiene più nessun riferimento a `/login`.

## 3. Il layout della dashboard può restare sul server

**Problema:** `(dashboard)/layout.tsx` ha `'use client'` solo per leggere `handleDownloadClick` da `useTasks()` e passarlo a `FilterBar`. Ma `FilterBar` è già un Client Component e può chiamare `useTasks()` da sola. È l'opposto di quello che chiedeva l'esercizio 2: spingere `'use client'` il più in basso possibile.

**Da fare:**

- Fai leggere a `FilterBar` la funzione dal context e togli la prop `onClick`.
- Togli `'use client'` dal layout.
- Già che ci sei: `FilterBar` usa `useState`, `useTransition` e `usePathname`, quindi è un Client Component, ma non dichiara `'use client'`. Funziona solo perché viene importata da un file client. Dopo questo task non sarà più così: cosa succede?

**Fatto quando:** nessun `layout.tsx` del progetto ha `'use client'`.

## 4. I contenitori si scrivono una volta sola

**Problema:** il root layout avvolge già tutto in `bg-gray-100 text-gray-800 min-h-screen` e `max-w-7xl mx-auto p-6`. `(dashboard)/page.tsx` e `user/page.tsx` ripetono le stesse classi, e `/user` aggiunge un altro `p-6`, quindi il padding è doppio. Un layout serve proprio a non ripetere questi contenitori.

**Da fare:**

- Lascia sfondo, larghezza massima e padding solo nel layout. Le pagine restituiscono direttamente il loro contenuto.
- In `layout.tsx` il `Suspense` attorno a `GlobalModals` ha come fallback un `<header>` finto, copiato da quello sopra: se `GlobalModals` sospende, compare un secondo header vuoto. Scegli un fallback sensato.
- `FilterProvider` contiene già un `Suspense` con `fallback={null}`, e avvolge **tutta** l'app: finché i search params non sono pronti, al posto della pagina non c'è niente. Valuta se il `Suspense` può stare più in basso, attorno ai soli componenti che leggono l'URL.

## 5. Una sola pagina del task, due modi di aprirla

**Problema:** `task/[id]/page.tsx` e `@modal/(.)task/[id]/page.tsx` sono quasi identiche: cercano il task, gestiscono "non trovato", salvano ed eliminano. Cambia solo cosa succede alla chiusura (`router.back()` oppure `router.push('/')`). Inoltre entrambe usano un trucco con `isReady` e un `eslint-disable`, quando il context espone già `isMounted`, che serve esattamente a sapere se i task sono stati letti dal `localStorage`.

**Da fare:**

- Estrai un Client Component in comune (es. `TaskDetail`) che riceve l'`id` e una callback `onClose`.
- Le due pagine diventano Server Component che ricevono `params` come prop. Attenzione: in Next 16 `params` è una Promise.
- Usa `isMounted` al posto di `isReady` ed elimina gli `eslint-disable`.
- Nella versione modale, "Task non trovata" viene mostrato senza overlay e senza un modo per chiuderlo. Sistemalo.

**Domanda su cui ragionare:** chi decide se il dettaglio si apre come modale o come pagina intera? Il componente lo sa?

## 6. Bug: il fetch sul server non parte mai per un nuovo utente

**Problema:** prova da una finestra in incognito.

1. Apri `/`: il middleware ti rimanda a `/login`.
2. `/login` sta sotto il root layout, quindi viene montato `TaskProvider`, e il suo effetto scrive il cookie `hasVisited=true`.
3. Fai login: torni su `/`, `page.tsx` trova `hasVisited` e non chiama `fetchTasks()`.

La board di un utente nuovo parte sempre vuota: la funzionalità dell'esercizio 3 di fatto non si attiva mai. È nato quando hai aggiunto il login, perché le due funzionalità non sono state provate insieme.

**Da fare:**

- Correggi il flusso. Il task 2 da solo potrebbe già bastare: verifica se è così e perché.
- Chiediti anche cosa succede se l'utente svuota il `localStorage` ma il cookie `hasVisited` resta: oggi ci sono tre meccanismi (cookie, `localStorage`, `isMounted`) che devono restare d'accordo tra loro. Si può semplificare?

**Fatto quando:** in incognito, dopo il login, la board si carica con i task scaricati dal server.

## 7. Filtri nell'URL: una voce di cronologia per ogni lettera

**Problema:** `updateUrlParams` fa `router.push` a ogni modifica. Per la ricerca vuol dire a ogni carattere digitato: scrivi "design", premi "indietro" e torni a "desig", poi a "desi"… Inoltre ogni navigazione chiede di nuovo la pagina al server.

**Da fare:**

- Per i filtri usa `router.replace`: cambiare un filtro non è "andare in un'altra pagina".
- Aggiungi un debounce alla ricerca, così l'URL si aggiorna solo quando smetti di scrivere.

**Domanda su cui ragionare:** quando ha senso che un cambio di URL crei una voce nella cronologia, e quando no?

## 8. `middleware` → `proxy`, e proteggere tutte le rotte

**Problema:**

- In Next 16 il file `middleware.ts` è deprecato e si chiama `proxy.ts`. La build lo segnala con un warning.
- Il middleware controlla solo `pathname === '/'`: `/user`, `/about` e `/task/...` si aprono anche senza login.
- Un utente già autenticato può comunque aprire `/login`.

**Da fare:**

- Rinomina il file seguendo la guida di migrazione nel warning.
- Proteggi tutte le rotte tranne `/login`. Ragiona su cosa sia più sicuro: elencare le rotte da proteggere o quelle da lasciare libere?
- Se l'utente è già autenticato, da `/login` rimandalo alla board.

**Fatto quando:** in incognito, qualsiasi URL dell'app porta al login.

## 9. I componenti non dovrebbero sapere su che pagina sono

**Problema:** dopo il task 2 restano altri controlli sul `pathname`:

- `Header` nasconde "Elimina tutte le attività" su `/user`;
- `FilterBar` nasconde "Scarica tasks" e il filtro utente su `/user`;
- `GlobalModals`, dopo aver creato un task da `/about`, ti porta sul dettaglio, ma da tutte le altre pagine no.

**Da fare:**

- Per `/user`, scegli un approccio e motivalo nel commit: per esempio la pagina passa delle props (`showUserFilter`, …) oppure la struttura dei layout cambia. Non esiste una sola risposta giusta, ma la decisione deve stare in un layout o in una pagina, non in un componente condiviso.
- Il caso speciale di `/about` in `GlobalModals` va tolto: il comportamento dopo il salvataggio deve essere uguale ovunque.

**Fatto quando:** `usePathname` resta solo dove serve davvero, come la voce di menu attiva in `Header`.

## 10. Completare le consegne del modulo

Il codice è molto avanti rispetto agli appunti. Dal brief mancano ancora:

- **Tabella Server/Client nel README:** non è aggiornata. Cita `TaskContainer`, che hai eliminato, dice che `page.tsx` "si occupa solo del layout strutturale" (ora fa il fetch e legge i cookie) e che `FilterContext` usa `useState` (ora legge l'URL). Aggiornala dopo i task 2–5, perché alcune risposte cambieranno.
- **File di appunti** (es. `NOTES.md`) con:
  - cosa succede leggendo `localStorage` in fase di inizializzazione dentro Next, e perché;
  - le 5-6 righe di confronto tra il fetch con `useEffect` e quello nel Server Component: cosa è diventato più semplice, cosa meno ovvio;
  - le ipotesi sugli snippet di Connect dell'esercizio 4, che ti mando a parte.
- **La vecchia versione del fetch** con `useEffect` + `AbortController` in un branch o in un file a parte, per il confronto fianco a fianco. Oggi c'è solo `main`.

---

## Bonus

- **Login con una Server Action:** oggi il login scrive i cookie con `document.cookie` dal browser. In Next si può fare con una Server Action che chiama `cookies().set(...)`, senza `useState` per i campi e senza `setTimeout`. È anche un buon ponte verso Connect.
- **"Task personali" per l'utente loggato:** `List` filtra su `'giordana'` scritto a mano, mentre il cookie `userName` esiste già ("da capire se lasciare"). Collega le due cose.
- **Conferma su "Elimina tutte le attività":** è l'azione più distruttiva dell'app e parte senza chiedere niente, mentre chiudere la modale chiede conferma.
- **`memo` e React Compiler:** in `next.config.ts` hai attivato `reactCompiler: true`. Cosa fa il compilatore, e servono ancora `memo(List)` e `useCallback`? Tieni conto che `List` legge due context: quando cambia uno dei due, `memo` la protegge?

**Commit:** in generale buoni. Due cose da evitare: `7b7de42` contiene tre messaggi convenzionali in uno (erano tre commit), e `c5d07a1` ha una virgoletta di troppo nel messaggio.
