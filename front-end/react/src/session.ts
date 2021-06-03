import * as Cookies from 'js-cookie';

export const setSessionCookie = (data: string) => {
  Cookies.remove('session');
  Cookies.set('session', data, { expires: 14 });
};

export const getSessionCookie = () => {
  const sessionCookie = Cookies.get('session');

  if (sessionCookie) {
    return sessionCookie;
  }

  return null;
};

export const getDarkModePreference = () => {
  const darkMode = Cookies.get('darkMode');

  return darkMode === 'true';
};

export const toggleDarkMode = (darkMode: boolean) => {
  Cookies.remove('darkMode');
  Cookies.set('darkMode', (!darkMode).toString(), { expires: 14 });
};
