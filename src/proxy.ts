import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const privateRoutes = ['/admin/dashboard', '/admin/pix'];

// This function can be marked `async` if using `await` inside
export async function proxy(req: NextRequest) {
  const pathName = req.nextUrl.pathname;
  const cookies = req.cookies;
  const isPrivateRoute = privateRoutes.includes(pathName);
  const isAuth = !!(await getToken({ req }));
  const authProcessing = cookies.has('next-auth.processing');

  const redirect = (newUrl: string) => {
    return NextResponse.redirect(new URL(newUrl, req.url));
  };

  if (isAuth && !authProcessing && pathName === '/admin/login') {
    return redirect('/admin/dashboard');
  }

  if (!isAuth && isPrivateRoute) {
    return redirect('/admin/login');
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'], // Middleware será aplicado a todas as rotas que começam com "/admin"
};
