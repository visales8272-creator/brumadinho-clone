(function ($, Drupal, drupalSettings, cookies) {
    /**
     * Função para tratamentio de cookies do site.
     */
    var lgpdCookie;
    lgpdCookie = lgpdCookie || (function () {
        return {
            /**
             * Grava o cookie das informações sobre cookie
             */
            setcookieLgpdInfo: function () {
                // $.cookie('cookieLgpdInfo', 'ok', {expires: 30, domain: 'fgv.br', path: '/'});
                cookies.set('fgv_lgpd_agreement', 'ok', {expires: 30, path: '/'});
            },
            /**
             * Recupera o cookie das informações sobre cookie
             */
            getcookieLgpdInfo: function () {
                var c = cookies.get("fgv_lgpd_agreement");
                if (c === 'undefined' || c === null || c !== 'ok') {
                    return false;
                } else {
                    return true;
                }
            },
            /**
             * bind cookie ok click.
             */
            bindCookieOkClick: function () {
                //#fgv-lgpd = ID da div com a mesnagem
                var $blockcookieLgpdInfo = $('#fgv-lgpd');

                if (!this.getcookieLgpdInfo()) {
                    $blockcookieLgpdInfo.css("display", "flex").fadeIn();
                } else {
                    $blockcookieLgpdInfo.css("display", "none");
                }

                $(once('ok-cookie', '#fgv-lgpd')).find('a#ok-lgpd, button#ok-lgpd').click(function (e) {
                    e.preventDefault();
                    lgpdCookie.setcookieLgpdInfo();

                    $(this).parents('#fgv-lgpd').fadeOut();
                });

            }
        };
    })();
    
    //Exibe a mensagem no topo do site:
    lgpdCookie.bindCookieOkClick();

})(jQuery, Drupal, drupalSettings, window.Cookies);