// Cross-page link: the existing lead SPA contains an older architecture route.
// Navigate to the independently maintained architecture document instead.
document.addEventListener('click', event => {
  const link=event.target.closest('a[href]');
  if(!link || event.defaultPrevented || event.button!==0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || link.target==='_blank') return;
  const target=new URL(link.href,location.href);
  if(target.origin===location.origin && /^\/architecture\/?$/.test(target.pathname)) {
    event.preventDefault();event.stopPropagation();location.assign('/architecture/'+target.search+target.hash);
  }
},true);
