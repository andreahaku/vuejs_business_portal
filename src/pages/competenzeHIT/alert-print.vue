<template>
<transition name="modal">
</transition>
</template>

<script>
export default {
  props: {
    show: Boolean
  },
  data: function() {
    return {
      showAlert: false,
      path: location.href
    }
  },
  watch: {
    show: function() {
      this.showAlert = this.show;
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      this.PrintElem();
    })
  },
  methods: {
    PrintElem() {

      var tas = $("#elt textarea")
      for (var i = 0; i < tas.length; i++) {
        var x = document.createElement("DIV")
        var text = tas[i].value;
        if (text == null || text == "") {
          text = "-"
        }
        var t = document.createTextNode(text);
        x.appendChild(t);
        tas[i].parentElement.appendChild(x);
      }
      $("#elt textarea").remove()

      var inp = $("#elt input")
      for (var i = 0; i < inp.length; i++) {
        var x = document.createElement("span")
        var text = inp[i].value;
        if (text == null || text == "") {
          text = "-"
        }
        var t = document.createTextNode(text);
        x.appendChild(t);
        inp[i].parentElement.appendChild(x);
      }
      $("#elt input").remove()

      var sel = $("#elt select")
      for (var i = 0; i < sel.length; i++) {
        var x = document.createElement("DIV")
        var text = sel[i].value;
        if (text == null || text == "") {
          text = "-"
        }
        var t = document.createTextNode(text);
        x.appendChild(t);
        sel[i].parentElement.appendChild(x);
      }
      $("#elt select").remove()

      $("#elt .printden").remove()

      $("#elt").height($("#elt").height() * 1.5);
      localStorage.setItem("html", document.getElementById("content").innerHTML)

      var mywindow = window.open("print.html");
      mywindow.focus(); // necessary for IE >= 10*/
      mywindow.print()

      this.$emit("reload");
      return true;
    }
  }
}
</script>

<style>

</style>
