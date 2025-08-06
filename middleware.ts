// Mise à jour du fichier de routage pour inclure les nouvelles pages académiques

import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Routes protégées pour les élèves
  const studentProtectedRoutes = [
    '/school/student/grades',
    '/school/student/schedule',
    '/school/student/attendance',
    '/school/student/profile'
  ];

  // Routes protégées pour les enseignants
  const teacherProtectedRoutes = [
    '/school/teacher/grades',
    '/school/teacher/schedule',
    '/school/teacher/attendance',
    '/school/teacher/students'
  ];

  // Routes protégées pour l'administration
  const adminProtectedRoutes = [
    '/school/admin/grades',
    '/school/admin/schedule',
    '/school/admin/teachers',
    '/school/admin/students',
    '/school/admin/reports'
  ];

  // Vérifier l'authentification selon le type d'utilisateur
  if (pathname.startsWith('/school/')) {
    const token = request.cookies.get('auth-token')?.value;
    const userType = request.cookies.get('user-type')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Vérifier les permissions selon le type d'utilisateur
    if (studentProtectedRoutes.some(route => pathname.startsWith(route)) && userType !== 'student') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    if (teacherProtectedRoutes.some(route => pathname.startsWith(route)) && userType !== 'teacher') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    if (adminProtectedRoutes.some(route => pathname.startsWith(route)) && userType !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/school/:path*',
    '/admin/:path*',
    '/teacher/:path*',
    '/student/:path*'
  ]
};
