import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ogni volta che viene digitato un indirizzo o si cambia pagima, parte una request (che contiene URL, IP e cookie)
// il middleware intercetta queste richieste e può decidere se permetterle o meno
export function middleware(request: NextRequest) {
  // controlliamo se l'utente ha il cookie "isAuthenticated" (ha già fatto login)
  const hasToken = request.cookies.has('isAuthenticated');
  // vediamo dove vuole andare
  const isGoingToHome = request.nextUrl.pathname === '/';

  // se cerca di entrare in bacheca (/) ma non è autenticato
  if (isGoingToHome && !hasToken) {
    // redirect alla pagina di login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // in tutti gli altri casi l'utente può proseguire normalmente
  return NextResponse.next();
}

// il middleware viene eseguito su tutte le richieste, tranne quando il browser sta cercando di scaricare immagini, CSS, script interni (_next) o la favicon
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
