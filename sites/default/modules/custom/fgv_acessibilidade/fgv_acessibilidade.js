(function ($, Drupal, cookies) {
  "use strict";

  /**
   * Executa apenas no document ready.
   */
  window.addEventListener("DOMContentLoaded", function (e) {
    var script = document.createElement("script");
    script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
    script.onload = function () {
      new window.VLibras.Widget("https://vlibras.gov.br/app");
    };
    document.head.appendChild(script);
  });

  function fgvAcessibilidadeDragElement() {
    var pElement = $("#slidable")[0];

    /**
     * Simula os eventos do mouse em dispositivos touch
     */
    function touchHandler(event) {
      var touch = event.changedTouches[0];

      var simulatedEvent = new MouseEvent(
        {
          touchstart: "mousedown",
          touchmove: "mousemove",
          touchend: "mouseup",
        }[event.type],
        true,
        true,
        window,
        1,
        touch.screenX,
        touch.screenY,
        touch.clientX,
        touch.clientY,
        false,
        false,
        false,
        false,
        0,
        null
      );

      touch.target.dispatchEvent(simulatedEvent);
      event.preventDefault();
    }

    /**
     * Atribui o drag and drop ao elemento
     */
    $(once('drag-widget', '#side')).each(function () {
        dragElement(this);

        $(once('drag-widget', this)).click(function (e) {
            if ($(this).hasClass("dragging-widget")) {
              e.preventDefault();
            }
        });

        this.addEventListener("touchstart", touchHandler, { passive: true });
        this.addEventListener("touchmove", touchHandler, { passive: true });
        this.addEventListener("touchend", touchHandler, true);
        this.addEventListener("touchcancel", touchHandler, true);
      });

    /**
     * Reseta a posição inicial do elemento
     */
    // $(once('drag-widget', window)).on("resize", function () {
    //     setTimeout(function () {
    //       $("#side").each(function () {
    //         //this.style.removeProperty('top');
    //         $(this).parents("#slidable")[0].style.removeProperty("top");
    //       });
    //     }, 200);
    //   });

    /**
     * Drag and drop
     */
    function dragElement(elmnt) {
      var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
      if (document.getElementById(elmnt.id)) {
        // if present, you move the DIV from:
        document.getElementById(elmnt.id).onmousedown = dragMouseDown;
      } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
      }

      function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
      }

      function elementDrag(e) {
        $("#side:not(.dragging-widget").addClass("dragging-widget");

        e = e || window.event;
        e.preventDefault();

        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        // set the element's new position:
        if (pos4 > 0) {
          var maxTop = window.innerHeight - pElement.offsetHeight;
          if (maxTop > pos4) {
            pElement.style.top = pos4 + "px";
          } else {
            pElement.style.top = maxTop + "px";
          }
        } else {
          pElement.style.top = "0px";
        }
      }

      function closeDragElement() {
        setTimeout(function () {
          $("#side.dragging-widget").removeClass("dragging-widget");
        }, 200);

        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
      }
    }
  }

  if($(window).width() >= 768) {
    fgvAcessibilidadeDragElement();
  }

  $("#side").on("click", function (a) {
    a.preventDefault();
    $("#slidable").toggleClass("open");
    if ($("div[vw-plugin-wrapper]").hasClass("active")) {
      $(".vpw-header-btn-close").click();
    }
  });

  // Alto contraste
  if (cookies.get("highcontrast") == "yes") {
    $("body").addClass("highcontrast");
    $(".highcontrast-btn").html('<i class="icon-adjust"></i>Cores originais');
  }

  $(".highcontrast-btn").on("click", function (b) {
    b.preventDefault();
    if (
      cookies.get("highcontrast") === undefined ||
      cookies.get("highcontrast") === null ||
      cookies.get("highcontrast") == "no"
    ) {
      cookies.set("highcontrast", "yes", { expires: 7, path: "/" });
      $("body").addClass("highcontrast");
      $(".highcontrast-btn").html(
        '<i class="icon-adjust"></i>' + Drupal.t("Original colors")
      );
    } else {
      cookies.set("highcontrast", "no", { expires: 7, path: "/" });
      $("body").removeClass("highcontrast");
      $(".highcontrast-btn").html(
        '<i class="icon-adjust"></i>' + Drupal.t("High contrast")
      );
    }
  });

  // Verifica se a div possui background
  // http://jsfiddle.net/emosaurusrex/DACwz/
  $.fn.hasBack = function () {
    var me = $.fn.hasBack;
    if (!me.cache) {
      // get the background image
      // create a temporary element
      var $tmpElem = $("<div />").hide().appendTo("body");
      $.fn.hasBack.cache = {
        'image': $tmpElem.css("background-image"),
      };
      $tmpElem.remove();
    }
    var elem = this.eq(0);
    return !(elem.css("background-image") === me.cache.image);
  };

  $("div").each(function (index, value) {
    var $val = $(value);
    var back = $val.hasBack();
    if (back) {
      $val.addClass("highcontrastRemove");
    }
  });

  $("#toolbar-administration *").addClass("highcontrastRemove");

  // Tamanho das fontes
  var $affectedElements = $("body *").not(
    "div, #toolbar-administration *, .visually-hidden, script, img, header, footer, nav, aside, main, link"
  );
  $affectedElements.each(function () {
    var $this = $(this);
    $this.data("orig-size", $this.css("font-size"));
  });

  $(".azao").on("click", function (c) {
    c.preventDefault();
    changeFontSize(1);
  });

  $(".azinho").on("click", function (d) {
    d.preventDefault();
    changeFontSize(-1);
  });

  $(".adefault").on("click", function (e) {
    e.preventDefault();
    $affectedElements.each(function () {
      var $this = $(this);
      $this.css("font-size", $this.data("orig-size"));
    });
  });

  function changeFontSize(direction) {
    $affectedElements.each(function () {
      var $this = $(this);
      $this.css("font-size", parseInt($this.css("font-size")) + direction);
    });
  }
})(jQuery, Drupal, window.Cookies);
