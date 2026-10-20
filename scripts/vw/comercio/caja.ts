import { readFileSync } from 'node:fs';
import path from 'node:path';
import { envolver, javascript } from './inyectable.ts';
import { SITIO, URL_PUBLICA } from '../../../src/lib/despliegue.ts';

export const ARCHIVO_CAJA = path.resolve('webflow', 'caja.html');

export const PAGINA_CHECKOUT = 'checkout';

const TEXTOS = { email: 'Email', cambiar: 'Cambiar' };

/** Webflow's checkout texts, as it writes them, to the site's Spanish. */
export const ES: Record<string, string> = {
  'Pay with browser.': 'Paga con el navegador.',
  'Customer Info': 'Tus datos',
  '* Required': '* Obligatorio',
  'Shipping Address': 'Dirección de envío',
  'Full Name *': 'Nombre completo *',
  'Street Address *': 'Dirección *',
  'City *': 'Ciudad *',
  'State/Province': 'Estado / Provincia',
  'Zip/Postal Code *': 'Código postal *',
  'Country *': 'País *',
  'Shipping Method': 'Envío',
  'No shipping methods are available for the address given.':
    'No hay envío disponible para esta dirección.',
  'Payment Info': 'Pago',
  'Card Number *': 'Número de tarjeta *',
  'Expiration Date *': 'Vencimiento *',
  'Security Code *': 'Código de seguridad *',
  'Billing address same as shipping': 'La dirección de facturación es la misma de envío',
  'Billing Address': 'Dirección de facturación',
  'Items in Order': 'Tu pedido',
  'Quantity:': 'Cantidad:',
  'Order Summary': 'Resumen del pedido',
  'Discount Code': 'Código de descuento',
  Apply: 'Aplicar',
  'Apply Discount': 'Aplicar descuento',
  'Place Order': 'Confirmar y pagar',
  'Placing Order...': 'Procesando…',
  'Billing address optional': 'Dirección de facturación opcional',
  'Shipping address optional': 'Dirección de envío opcional',
  'Flat-Rate': 'Tarifa fija',
  'Free Shipping': 'Envío gratis',
  'Sales Tax': 'Impuesto',
  'State Taxes': 'Impuesto estatal',
  'County Taxes': 'Impuesto del condado',
  Tax: 'Impuesto',
  Shipping: 'Envío',
  'There was an error processing your customer info. Please try again, or contact us if you continue to have problems.':
    'Hubo un error con tus datos. Inténtalo de nuevo o escríbenos si el problema sigue.',
};

/** Lines Webflow writes with a value inside: «Discount (VEROPRUEBA)». */
export const ES_PATRONES: [string, string][] = [['^Discount \\((.+)\\)$', 'Descuento ($1)']];

/** The error messages Webflow reads from attributes of the error box when something fails. */
export const ERRORES: Record<string, string> = {
  'data-w-info-error':
    'Hubo un error con tus datos. Inténtalo de nuevo o escríbenos si el problema sigue.',
  'data-w-shipping-error': 'No podemos enviar tu pedido a esa dirección.',
  'data-w-billing-error':
    'No se pudo completar el pago con esos datos. Revisa la tarjeta y la dirección de facturación, o usa otra tarjeta. Escríbenos si el problema sigue.',
  'data-w-payment-error':
    'Hubo un error al procesar tu pago. Inténtalo de nuevo o escríbenos si el problema sigue.',
  'data-w-pricing-error':
    'El precio de algo de tu pedido cambió. Recarga la página e inténtalo de nuevo.',
  'data-w-minimum-error': 'Tu pedido no llega al mínimo.',
  'data-w-extras-error':
    'Cambió una configuración de la tienda. Recarga la página e inténtalo de nuevo.',
  'data-w-product-error':
    'Algo de tu pedido ya no está disponible. Recarga la página e inténtalo de nuevo.',
  'data-w-invalid-discount-error': 'Este código no es válido.',
  'data-w-expired-discount-error': 'Este código ya no está disponible.',
  'data-w-usage-reached-discount-error': 'Este código ya no está disponible.',
  'data-w-requirements-not-met-error': 'Tu pedido no cumple las condiciones de este código.',
};

const MARCO = {
  marca: 'Veronica Wellness',
  volver: URL_PUBLICA,
  volverTexto: '← Volver',
  pie: 'Pago seguro · Tus datos están protegidos. Veronica Wellness no almacena datos de tarjeta.',
};

function tokens(): (nombre: string) => string {
  const css = readFileSync(path.resolve('src', 'styles', 'global.css'), 'utf8');
  return (nombre) => {
    const valor = css.match(new RegExp(`--${nombre}:\\s*([^;]+);`))?.[1].trim();
    if (!valor) throw new Error(`No encontré --${nombre} en global.css`);
    return valor;
  };
}

/** The site's checkout look (Checkout.astro, CheckoutLayout.astro) on Webflow's class names. */
function estilo(): string {
  const t = tokens();
  const fuentes = new URL('fonts/', URL_PUBLICA).toString();
  const c = 'w-commerce-commercecheckout';
  return `
@font-face{font-family:'Cormorant Garamond';font-weight:500;font-display:swap;src:url(${fuentes}cormorant-garamond-latin-500-normal.woff2) format('woff2')}
@font-face{font-family:'Cormorant Garamond';font-weight:600;font-display:swap;src:url(${fuentes}cormorant-garamond-latin-600-normal.woff2) format('woff2')}
@font-face{font-family:'Nunito Variable';font-weight:200 1000;font-display:swap;src:url(${fuentes}nunito-latin-wght-normal.woff2) format('woff2')}
@keyframes vw-mostrar{to{visibility:visible}}
html:not(.vw-lista) body{visibility:hidden;animation:vw-mostrar 0s 1.5s forwards}
body{background:${t('color-bone')};color:${t('color-charcoal')};font-family:${t('font-sans')};font-size:16px;font-variant-numeric:lining-nums;margin:0}
.vw-cabecera{display:flex;align-items:center;justify-content:space-between;padding:20px 40px;background:${t('color-bone')};border-bottom:1px solid rgb(48 47 42 / .08)}
.vw-marca{display:flex;align-items:center;gap:10px;color:${t('color-charcoal')};text-decoration:none;font-weight:800;font-size:16px;letter-spacing:.01em}
.vw-volver{color:rgb(48 47 42 / .7);font-weight:700;font-size:14px;text-decoration:none}
.vw-volver:hover{color:${t('color-charcoal')}}
.vw-pie{text-align:center;font-size:13px;color:rgb(48 47 42 / .6);padding:28px 22px 40px}
.${c}formcontainer{background:transparent;padding:40px 40px 60px;min-height:auto}
.w-commerce-commercelayoutcontainer{max-width:1180px;margin:0 auto}
.w-commerce-commercelayoutsidebar{position:sticky;top:28px}
.w-commerce-commercecartapplepaybutton{border-radius:${t('radius-pill')};min-height:50px}
.${c}blockheader,.${c}summaryblockheader{background:transparent;border:0;padding:0 0 10px;margin:0}
.${c}blockheader h2,.${c}summaryblockheader h2{font-family:${t('font-serif')};font-weight:500;font-size:30px;line-height:1.1;margin:0;color:${t('color-charcoal')}}
.${c}blockheader div{font-size:13px;color:rgb(48 47 42 / .6)}
.${c}blockcontent,.${c}shippingmethodslist{background:${t('color-white')};border:0;border-radius:${t('radius-lg')};padding:24px 26px;margin-bottom:28px;box-shadow:0 1px 0 rgb(48 47 42 / .06)}
.${c}customerinfowrapper,.${c}shippingaddresswrapper,.${c}shippingmethodswrapper,.${c}billingaddresswrapper,.${c}paymentinfowrapper,.${c}orderitemswrapper,.${c}ordersummarywrapper{margin-bottom:8px}
.${c}label,.${c}formcontainer label{font-family:${t('font-sans')};font-weight:700;font-size:13px;color:${t('color-charcoal')};margin-bottom:6px}
.${c}formcontainer input[type='text'],.${c}formcontainer input[type='email'],.${c}formcontainer select,.${c}emailinput,.${c}cardnumber,.${c}cardexpirationdate,.${c}cardsecuritycode,.${c}discountsinput{font-family:${t('font-sans')};font-size:16px;color:${t('color-charcoal')};background:${t('color-ivory')};border:1.5px solid rgb(48 47 42 / .12);border-radius:${t('radius-md')};padding:13px 16px;height:auto;min-height:50px;box-shadow:none;margin-bottom:16px}
.${c}formcontainer input[type='text']:focus,.${c}formcontainer input[type='email']:focus,.${c}formcontainer select:focus,.${c}discountsinput:focus,.${c}cardnumber.StripeElement--focus,.${c}cardexpirationdate.StripeElement--focus,.${c}cardsecuritycode.StripeElement--focus{border-color:${t('color-clay-deep')};background:${t('color-white')};box-shadow:0 0 0 4px rgb(214 154 124 / .18);outline:none}
.${c}orderitemslist{margin:0;padding:0}
.${c}orderitem{padding:10px 0;border-bottom:1px solid rgb(48 47 42 / .08)}
.${c}orderitem:last-child{border-bottom:0}
.${c}summarylineitem,.${c}ordersummaryextraitemslistitem{display:flex;justify-content:space-between;align-items:baseline;gap:12px;font-size:14.5px;color:rgb(48 47 42 / .7);padding:6px 0}
.${c}summarytotal{font-weight:800;color:${t('color-charcoal')};font-size:17px}
.${c}discounts{background:${t('color-ivory')};border:0;border-radius:${t('radius-md')};padding:16px;margin-top:14px;display:flex;flex-wrap:wrap;gap:8px;align-items:stretch}
.${c}discountslabel{width:100%;font-weight:700;font-size:13px;margin:0}
.${c}discounts input.${c}discountsinput{flex:1;min-width:0;margin:0;background:${t('color-white')}}
.${c}discountsbutton{flex-shrink:0;border:1.5px solid ${t('color-charcoal')};background:${t('color-white')};color:${t('color-charcoal')};border-radius:${t('radius-md')};padding:0 18px;min-height:50px;font-family:${t('font-sans')};font-weight:800;font-size:14px;cursor:pointer}
.${c}discountsbutton:hover{background:${t('color-charcoal')};color:${t('color-bone')}}
.${c}placeorderbutton{display:flex;align-items:center;justify-content:center;width:100%;margin-top:20px;background:${t('color-clay')};color:${t('color-charcoal')};font-family:${t('font-sans')};font-weight:800;font-size:15px;letter-spacing:.02em;padding:17px 32px;border-radius:${t('radius-pill')};border:0;text-decoration:none;transition:background .2s,box-shadow .2s,transform .2s}
.${c}placeorderbutton:hover{background:${t('color-clay-deep')};box-shadow:${t('shadow-lift-warm')};transform:translateY(-2px)}
.${c}errorstate{background:rgb(181 84 74 / .08);border:1.5px solid ${t('color-error')};border-radius:${t('radius-md')};color:${t('color-error')};padding:12px 14px;margin-top:14px}
.w-checkout-error-msg{color:${t('color-error')};font-weight:600;font-size:14px}
.${c}billingaddresstogglewrapper{display:flex;align-items:center;gap:10px;margin:4px 0 12px}
.${c}billingaddresstogglelabel{margin:0;font-weight:600;font-size:14px}
[data-vw-cliente]{background:${t('color-white')};border-radius:${t('radius-lg')};padding:18px 26px;font-size:15px}
[data-vw-cliente] a{color:${t('color-clay-rich')};font-weight:800}
@media (max-width:767px){.vw-cabecera{padding:16px 22px}.${c}formcontainer{padding:24px 16px 40px}.${c}blockcontent{padding:20px 18px}}
`
    .trim()
    .replace(/\n/g, '');
}

export const generarCaja = () =>
  `<style>${estilo()}</style>\n` +
  envolver([
    `const SITIO = ${JSON.stringify(new URL(SITIO).hostname)};`,
    `const TEXTOS = ${JSON.stringify(TEXTOS)};`,
    `const ES = ${JSON.stringify(ES)};`,
    `const ES_PATRONES = ${JSON.stringify(ES_PATRONES)};`,
    `const ERRORES = ${JSON.stringify(ERRORES)};`,
    `const MARCO = ${JSON.stringify(MARCO)};`,
    javascript('webflow/caja-es.ts'),
    javascript('src/lib/comercio/traspaso.ts'),
    javascript('webflow/caja.ts'),
  ]);
