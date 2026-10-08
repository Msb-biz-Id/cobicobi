import { useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';

export default function Turnstile({
    siteKey,
    onSuccess,
    onError,
    onExpire,
    className = 'my-3 flex justify-center',
    theme = 'auto',
    size = 'normal',
}) {
    const { turnstile } = usePage().props;
    const containerRef = useRef(null);
    const widgetIdRef = useRef(null);

    const isEnabled = Boolean(turnstile?.enabled);
    const effectiveSiteKey = siteKey || turnstile?.site_key;

    useEffect(() => {
        if (!isEnabled || !effectiveSiteKey || !containerRef.current) {
            return;
        }

        let isMounted = true;
        let intervalId = null;

        const renderWidget = () => {
            if (!isMounted || !containerRef.current) return;
            if (widgetIdRef.current !== null) return;

            if (window.turnstile && typeof window.turnstile.render === 'function') {
                try {
                    widgetIdRef.current = window.turnstile.render(containerRef.current, {
                        sitekey: effectiveSiteKey,
                        theme: theme,
                        size: size,
                        callback: (token) => {
                            if (isMounted && typeof onSuccess === 'function') {
                                onSuccess(token);
                            }
                        },
                        'expired-callback': () => {
                            if (isMounted && typeof onExpire === 'function') {
                                onExpire();
                            }
                        },
                        'error-callback': (errCode) => {
                            if (isMounted && typeof onError === 'function') {
                                onError(errCode);
                            }
                        },
                    });
                } catch (e) {
                    console.warn('Turnstile render warning:', e);
                }

                if (intervalId) {
                    clearInterval(intervalId);
                }
            }
        };

        // Turnstile script is async, check if ready or wait for it
        if (window.turnstile) {
            renderWidget();
        } else {
            intervalId = setInterval(() => {
                if (window.turnstile) {
                    renderWidget();
                }
            }, 100);
        }

        return () => {
            isMounted = false;
            if (intervalId) {
                clearInterval(intervalId);
            }
            if (widgetIdRef.current !== null && window.turnstile && typeof window.turnstile.remove === 'function') {
                try {
                    window.turnstile.remove(widgetIdRef.current);
                } catch (e) {
                    // ignore
                }
                widgetIdRef.current = null;
            }
        };
    }, [isEnabled, effectiveSiteKey, theme, size]);

    if (!isEnabled || !effectiveSiteKey) {
        return null;
    }

    return (
        <div className={className}>
            <div ref={containerRef} className="cf-turnstile" />
        </div>
    );
}
