# Review della Fase 2 — MyTaskboard con database

Il passaggio da `localStorage` a SQLite con Prisma funziona ed è impostato bene: client Prisma in un'unica istanza in `src/lib/prisma.ts`, relazioni con `onDelete: Cascade`, client generato escluso da git, `postinstall` che rigenera il client, CRUD con Server Actions, login che legge gli utenti dal DB con cookie `httpOnly`, seed degli utenti e README aggiornato. Anche la rimozione di `apiUtils.ts` e del download, che con il DB non servivano più, è una buona pulizia.

Il tema di questo giro: **con un database vero, il server è la fonte della verità.** Lo schema versionato, i dati sul DB e i controlli sulle azioni devono stare in piedi da soli, senza contare su quello che fa il client. Diversi problemi qui sotto nascono da qui.

Stesse regole di sempre: i task sono in ordine, **un commit per task**, messaggi convenzionali. E da questa fase in poi **un branch per task e una PR verso `main`**, come previsto dal piano: in Fase 2 tutti i commit sono finiti direttamente su `main`.

---

## 1. Le migration devono descrivere lo schema

**Problema:** in `8451067` hai cambiato `schema.prisma` (aggiunto `User`, `user` diventato `userId`, tolti `createdAt` e `updatedAt`) senza generare una nuova migration. L'unica migration, `20261029105325_init_tasks`, crea ancora la colonna `user` e non crea la tabella `User`. Il README usa `prisma db push`, che allinea il DB allo schema saltando le migration, quindi il problema non si vede. Ma chiunque cloni il repo e lanci `prisma migrate dev` ottiene un DB sbagliato.

**Da fare:**

- Ragiona sulla differenza tra `db push` e `migrate dev`: quando si usa l'uno e quando l'altro?
- Rigenera le migration in modo che, partendo da un DB vuoto, producano esattamente lo schema attuale. Non ci sono dati da preservare, quindi puoi anche ripartire da una migration iniziale pulita.
- Aggiorna il README: il setup da zero deve usare le migration.

**Fatto quando:** cancellando `prisma/dev.db` e seguendo il README alla lettera, l'app funziona e `prisma migrate status` non segnala differenze.

## 2. "Elimina tutto" manda l'app in loop

**Problema:** dopo "Elimina tutte le attività" la pagina si ricarica di continuo finché il dev server non va in errore. Nei log del server, subito dopo `deleteAllTasksFromDb()` si alternano `GET /` e `fetchTasks()` circa una volta al secondo, compaiono decine di `✓ Compiled` senza che nessun sorgente sia cambiato, e alla fine una raffica di `ECONNRESET`. La causa non è ancora confermata.

**Da fare:**

- Riproduci il problema con DevTools aperti. In Console cerca messaggi di Fast Refresh o di "full reload"; in Network guarda se le `GET /` sono ricaricamenti del documento o fetch RSC (`_rsc`).
- Verifica se succede anche eliminando un solo task, o modificandolo.
- Un'ipotesi da verificare: il file `prisma/dev.db` sta dentro il progetto, e il dev server potrebbe vedere le scritture sul DB come modifiche ai file. Cosa succede se il DB sta fuori dalla cartella del progetto?
- Scrivi in `NOTES.md` come hai trovato la causa, non solo la soluzione.

**Fatto quando:** "Elimina tutto" svuota la board una volta sola e il server resta stabile.

## 3. L'indirizzo del DB in un posto solo

**Problema:** `file:./prisma/dev.db` è scritto a mano in `prisma.config.ts`, `src/lib/prisma.ts` e `prisma/seed.ts`. Se lo sposti (vedi task 2) devi ricordarti tre file.

**Da fare:**

- Leggi l'indirizzo da una variabile d'ambiente (`DATABASE_URL` in `.env`) in tutti e tre i punti.
- Aggiungi un `.env.example` versionato. Il `.env` vero non va su git.
- `seed.ts` crea un proprio `PrismaClient` copiato da `lib/prisma.ts`: riusa quello. E i cinque `upsert` identici possono diventare un ciclo.

**Fatto quando:** l'indirizzo del DB compare solo in `.env` / `.env.example`.

## 4. Una sola fonte per i task

**Problema:** i task vengono caricati due volte: `page.tsx` li legge sul server e li passa come `initialTasks`, e il `useEffect` del `TaskProvider` li richiede di nuovo con `fetchTasks()` al mount. In `List` c'è `const currentTasks = tasks.length > 0 ? tasks : initialTasks`. Quando `tasks` diventa vuoto, dopo "Elimina tutto" o dopo aver eliminato l'ultimo task, la lista torna a mostrare `initialTasks`, cioè task che sul DB non esistono più.

**Da fare:**

- Scegli un solo caricamento. Per esempio: il Server Component legge i task e il context si inizializza con quei dati, senza un secondo fetch.
- Togli il fallback su `initialTasks` da `List`.
- Spiega nel commit perché "array vuoto" non è un buon segnale per dire "non ancora caricato".

**Fatto quando:** dopo aver eliminato tutti i task, la board mostra lo stato vuoto e non ricompare niente fino a una nuova creazione.

## 5. Caricamento ed errori: un comportamento coerente

**Problema:**

- `deleteTask` e `updateTaskStatus` aggiornano subito l'interfaccia e mostrano subito il toast di successo. Se il DB fallisce compare l'errore, ma lo stato locale resta diverso dal DB e non viene ripristinato. `handleSaveForm` invece aspetta il DB prima di aggiornare. Sono due strategie diverse nello stesso file.
- `TaskDetail` usa `if (tasks.length === 0) return null` per capire se i dati stanno ancora arrivando. Con zero task, un link diretto a un task mostra una pagina vuota invece di "Task non trovata".
- Il toast di errore ha ancora il titolo "Impossibile scaricare", rimasto dal download che hai tolto.

**Da fare:**

- Scegli una strategia e applicala a tutte le operazioni: o aspetti il DB, oppure aggiorni subito e torni indietro in caso di errore. Guarda `useOptimistic` di React 19 e motiva la scelta nel commit.
- Introduci uno stato di caricamento esplicito invece di dedurlo dalla lunghezza dell'array.
- Sistema i testi del toast.

**Fatto quando:** simulando un errore del DB (per esempio lanciando un'eccezione in `deleteTaskFromDb`), l'interfaccia torna allo stato reale e mostra un messaggio corretto.

## 6. Il server non si fida del client

**Problema:** le funzioni in `src/services/tasksApi.ts` hanno `'use server'`, quindi sono endpoint pubblici che chiunque può chiamare, anche senza passare dall'interfaccia. `saveTaskToDb` scrive sul DB l'oggetto `Task` ricevuto così com'è: TypeScript controlla i tipi solo in compilazione, non quello che arriva davvero dalla rete. In più a ogni salvataggio la checklist viene cancellata e ricreata, quindi gli id cambiano, e lo stato locale tiene quelli vecchi perché non usa il valore restituito dall'upsert.

**Da fare:**

- Valida i dati in ingresso di ogni action, per esempio con `zod`: campi ammessi, tipi, valori consentiti per `status` e `category`.
- Usa il task restituito dal DB per aggiornare lo stato del client.

**Domanda su cui ragionare:** perché TypeScript non basta a proteggere una Server Action?

**Fatto quando:** una chiamata a `saveTaskToDb` con campi sbagliati o in più viene rifiutata dal server.

## 7. Il modello dati

**Problema:**

- Il piano chiedeva di decidere se la scadenza è una data pura o una data con orario. Nello schema `expire` è una `String`: la decisione non è stata presa, solo rimandata.
- `status` e `category` sono stringhe libere. Il DB accetta qualsiasi valore.
- La pagina `/user` filtra con `task.userId === userName`, dove `userName` viene dal cookie. Funziona solo perché il seed imposta `id` uguale allo username. Un utente creato con l'`uuid()` di default non vedrebbe i propri task.
- `USERS` in `constants.tsx` ripete a mano la tabella `User`.
- Sono spariti `createdAt` e `updatedAt`, che c'erano nella prima migration.

**Da fare:**

- Decidi il tipo della scadenza e scrivi la motivazione in `NOTES.md`, ricordando il bug ora locale/UTC della Fase 1B.
- Valuta gli enum di Prisma per `status` e `category`. Per le categorie, valuta anche una tabella, come chiede il piano.
- Filtra i task dell'utente nella query Prisma, usando l'id vero, e leggi l'elenco utenti dal DB.

**Fatto quando:** il seed crea utenti con id generati e tutto continua a funzionare.

## 8. Autenticazione

**Problema:**

- Il login controlla i cookie `isAuthenticated` e `userName`, ma chiunque può crearli a mano nel browser: `httpOnly` impedisce di leggerli da JavaScript, non di falsificarli. Basta impostare `userName=lucio` per entrare come Lucio.
- Le password sono salvate in chiaro e confrontate con `===`.
- Le Server Actions non controllano chi le chiama (vedi task 6).

**Da fare:** questo task lo impostiamo insieme in pair programming, perché tocca scelte che ritroverai nell'app di labeling.

- Password con hash (bcrypt o argon2).
- Sessione che il server può verificare: cookie firmato o una libreria dedicata.
- Controllo della sessione dentro ogni action, non solo nel `proxy`.

**Fatto quando:** modificare i cookie a mano non dà accesso ai dati di un altro utente.

---

## Processo

- **Branch e PR:** dalla prossima consegna ogni task va su un branch e arriva su `main` con una PR. Nella descrizione della PR scrivi cosa hai cambiato e come l'hai verificato.
- **Rileggere il diff:** il task 1 nasce da un cambio di schema che non è stato riletto insieme alla migration. Prima di aprire una PR chiediti: _"ho cambiato un file che ne descrive un altro?"_
- **Commit:** messaggi convenzionali e ben divisi. Bene.
