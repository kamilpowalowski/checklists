import { NgcCookieConsentConfig } from 'ngx-cookieconsent';

export const cookieSettings: NgcCookieConsentConfig = {
  cookie: {
    domain: 'lizt.co'
  },
  position: 'bottom-left',
  theme: 'classic',
  type: 'info',
  palette: {
    popup: {
      background: '#000'
    },
    button: {
      background: '#40dc7e',
      text: '#000'
    }
  },
  content: {
    message: 'By continuing to browse the site, you\'re agreeing to our use of cookies.',
    link: 'Learn more in our Privacy Policy',
    href: '/legal/policy'
  },
  enabled: false
};
