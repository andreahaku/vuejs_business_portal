export default {
  data: function () {
    return {
      path: "print.html"
    }
  },
  methods: {
    printContent(dynamicHTML, wrapper, ignoreSelector, css_custom) {

      for (var i = 0; i < dynamicHTML.length; i++) {
        var info = dynamicHTML[i];
        var els = $(info.selector);

        console.log(info.selector + ": " + els.length);

        var keeping = (info.into == 'keep')
        for (var ii = 0; ii < els.length; ii++) {
          var x = null;
          if (!keeping) {
            x = document.createElement(info.into)
          }

          var text = dynamicHTML[i].how(els[ii]);

          if (text == null || text == "") {
            text = "-"
          }
          if (text == 'nothing') {
            text = ""
          }
          if (!keeping) {
            var t = document.createTextNode(text);
            x.appendChild(t);
            els[ii].parentElement.appendChild(x);
          } else {
            els[ii].innerHTML = text;
          }
        }
        if (!keeping) {
          els.remove();
        }
      }
      if (ignoreSelector != null) {
        try {
          $(ignoreSelector).remove();
        } catch (err) {
          console.log(err)
        }
      }

      for (var i = 0; i < css_custom.length; i++) {
        var cs = css_custom[i];
        for (var ii = 0; ii < cs.style.length; ii++) {
          $(cs.selector).css(cs.style[ii].what, cs.style[ii].val);
        }
      }
      var isChrome = !!window.chrome && !!window.chrome.webstore;
      if (isChrome) {
        $("#elt").height($("#elt").height() * 1.5);
      }
      localStorage.setItem("html", $("#" + wrapper).html());
      this.$emit('printing')
      if (isChrome) {
        $("#elt").height($("#elt").height() * 0.66);
      }
      var myWindow = window.open(this.path, '_self');
    }

  }
}