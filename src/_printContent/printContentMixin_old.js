export default {
    data: function () {
        return {
            path: "print.html"
        }
    },
    methods: {
        printContent(dynamicHTML, wrapper, ignoreSelector, css_custom) {
            this.mayPrint = true;
            this.$nextTick(function () {

                var frame = $("#print_frame");
                console.log(frame)
                var frameWindow = frame[0].contentWindow;
                var frameDocument = frame[0].contentDocument;
                var $$ = frame.contents()

                console.log($$)
                console.log($$.find("#elt"))
                console.log($("#print_frame #elt"))

                for (var i = 0; i < dynamicHTML.length; i++) {
                    var info = dynamicHTML[i];
                    var els = $(info.selector);

                    var frame_els = $$.find(info.selector);
                    console.log(info.selector + ": " + els.length + " " + frame_els.length);

                    var keeping = (info.into == 'keep')
                    for (var ii = 0; ii < frame_els.length; ii++) {
                        var x = null;
                        if (!keeping) {
                            x = document.createElement(info.into)
                        }

                        var text = dynamicHTML[i].how(els[ii]);

                        if (text == null || text == "") { text = "-" }
                        if (text == 'nothing') { text = "" }
                        if (!keeping) {
                            var t = document.createTextNode(text);
                            x.appendChild(t);
                            frame_els[ii].parentElement.appendChild(x);
                        } else {
                            frame_els[ii].innerHTML = text;
                        }
                    }
                    if (!keeping) {
                        frame_els.remove();
                    }
                }
                if (ignoreSelector != null) {
                    try {
                        console.log($$.find(ignoreSelector))
                        $$.find(ignoreSelector).remove()
                    } catch (err) { console.log(err) }
                }
                console.log($$.find("#print_frame"))
                $$.find("#print_frame").remove()

                for (var i = 0; i < css_custom.length; i++) {
                    var cs = css_custom[i];
                    for (var ii = 0; ii < cs.style.length; ii++) {
                        $$.find(cs.selector).css(cs.style[ii].what, cs.style[ii].val);
                    }
                }
                var isChrome = !!window.chrome && !!window.chrome.webstore;
                if (isChrome) {
                    $$.find("#elt").height($$.find("#elt").height() * 1.5);
                }
                localStorage.setItem("html", $$.find("#" + wrapper).html());
                console.log($$.find("#" + wrapper))
                console.log($$.find("#" + wrapper).html())

                if (isChrome) {
                    $$.find("#elt").height($$.find("#elt").height() * 0.66);
                }
                frameWindow = window.open(this.path)
                //frameWindow = window.open(this.path, '_self')
                try {
                    frameWindow.focus();
                } catch (err) {
                    console.log(err)
                }
                //this.mayPrint = false;
            })
        }
    }
}