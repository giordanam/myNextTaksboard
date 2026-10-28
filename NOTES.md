# Appunti di Progetto

### 1. Inizializzazione e lettura del localStorage in Next.js

Inizialmente mi sono trovata di fronte a questo errore: `ReferenceError: localStorage is not defined`.
Provando a risolverlo con un controllo del tipo `if (typeof window !== 'undefined')`, l'errore in console sparisce, ma ne appare un altro: `Error: Hydration failed because the server rendered HTML didn't match the client.`

Questo succede per la differenza sostanziale tra un'app classica React (com'era la mia) e un'app in Next.js: prima il codice veniva compilato direttamente nel browser dell'utente, dove l'oggetto `window` e il `localStorage` esistono da sempre. In un'app in Next.js c'è una fase intermedia chiamata _Server-Side Rendering (SSR)_. Avvengono, quindi, due fasi distinte:

1. **Fase Server (Node.js)**
   Prima che la pagina arrivi all'utente, Next.js "la disegna" (esegue il codice) sul proprio server per creare l'HTML. Questo server, usando l'ambiente di Node.js, non ha uno schermo o un browser, ergo `localStorage` non esiste. Ecco perché cercare di leggerlo in modo diretto causa il primo errore.

2. **Fase Client (Hydration Mismatch)**
   Cercando di risolvere il primo errore dicendo a Next.js di ignorare il `localStorage` quando è sul server, si crea un disallineamento. Il server genera la pagina vuota (es. 0 task); una frazione di secondo dopo l'HTML arriva al browser, il quale esegue il JavaScript, legge i task salvati nel `localStorage` e genera una pagina piena (es. 5 task). Quando React cerca di "idratare" (fondere) la struttura vuota inviata dal server con quella generata dal client, si accorge che le due versioni sono diverse, va in crash e lancia l'errore di _Hydration Mismatch_.

**La Soluzione:**
Per risolvere il problema è necessario che i due render iniziali (server e client) siano perfettamente identici. Ho quindi inizializzato lo stato sempre come vuoto per far combaciare le due versioni. Successivamente, ho utilizzato l'hook `useEffect` (un'operazione che avviene _esclusivamente_ lato client a idratazione conclusa) per leggere il `localStorage` in totale sicurezza e aggiornare lo stato in un secondo momento.

### 2. Fetching: useEffect vs Server Component

**L'approccio in React classico**
Inizialmente nella mia app React classica avevo creato più stati per gestire l'attesa (`isLoading`) e l'errore (`isError`). Avevo creato la funzione `fetchTaskData` che gestiva la fetch vera e propria e faceva i `setState` in caso di errore (`AbortSignal`). Avevo anche istanziato un controller (`AbortController`) nello `useEffect` che poi andava "pulito" nel `return` dello `useEffect`. A livello di esperienza utente il browser scaricava la pagina vuota, mostrava lo spinner del loading e mostrava l'elenco delle tasks dopo aver scaricato i dati.

**Il refactoring in Next.js**
Adesso in Next.js il componente diventa una semplice funzione asincrona: ho fatto `await fetch()` e ho restituito l'HTML. Non ho usato nessun `useEffect`, nessuno stato, nessun `AbortController`. La logica di fetch è stata semplicemente spostata in `page.tsx` e sono state create le pagine di `loading` ed `error` che si occupano solamente appunto del caricamento (attesa durante la fetch dei dati) e di eventuali errori.

**Riflessioni e difficoltà**
A livello di difficoltà, allo stesso modo dell'es2, è stato difficile capire bene il flusso logico della fetch e della divisione appunto tra server e client, e quindi fare refactor del mio codice per rendere appunto il server un server e il client un client. Questa divisione netta ha molti pro sia a livello di leggibilità del codice, sia a livello di logica vera e propria dell'applicazione. Allo stesso tempo, però, è la parte più complicata quando si passa dalla logica di un'app react semplice alla logica di un'app next. Infatti la sfida più difficile è stata sempre gestire l'Hydration Mismatch, ma alla fine è stato più semplice del previsto...
