<template>
    <div class="new_modal-mask" v-show="datashow">
        <transition name="new_modal">
            <div class="new_modal-wrapper" v-show="toggleTrans">
                <div class="new_modal-container">
                    <div class="new_modal-header">
                        <div class="media">
                            <div class="media-left" style="vertical-align: middle; padding-left: 5px; padding-right: 20px;">
                                <i class="fa fa-file alert-icon" style="width: 40px; height: 40px;"></i>
                            </div>
                            <div class="media-body">
                                <h4 class="media-heading">Carica Immagine</h4>
                                <p>Modifica la tua immagine di profilo</p>
                            </div>
                            <div class="header-buttons">
                                <a class="close-button" @click="close()"><i class="fa fa-times" style="text-align: center; position: relative;"></i></a>
                            </div>
                        </div>
                    </div>
                    <div class="new_modal-body panel">
                        
                        <div class="panel-body media" style="margin: 0px;" :style="$root.xs ? {'max-height': '300px', 'overflow-y': 'auto'} : {}">
                          
                            <div v-if="showDropBox" class="modal-body dropbox media-body">
                                <div id="drop_zone" class="dragDrop">
                                    <input type="file" id="files" name="files[]" class="input-file" @change="handleFileSelect" style="margin:auto;" />
                                    <p id="description"></p>
                                    <p>Trascina qui l'immagine<br>o clicca per cercare nel sistema</p>
                                </div>
                                <div id="crop"></div>
                                <div class="modal-body" style="padding: 0px; margin: 15px;">
                                    <center>
                                        <button v-if="cropInstance != null" id="cropper" class="btn btn-warning" @click.prevent="destroyCropInstace">Svuota</button>
                                        <button id="cropper" class="btn btn-info" style="display:none;">Ritaglia</button>
                                    </center>
                                </div>
                            </div>
                            <div v-if="imageData != null && !$root.xs" class="media-right middle" style="width: 25%;">
      
                                <div class="media">
                                    <div class="media-body">
                                        <h4 class="media-heading">Antemprima</h4>
                                        <div class="thumbnail" style="margin-bottom: 0px;">
                                            <a id="cropped"></a>
                                        </div>
                                        <a href="" class="btn btn-info btn-sm" @click.prevent="saveAvatar" style="margin-top: 10px;">CONFERMA</a>
                                    </div>
                                </div>
                    
                            </div>
                        </div>
                        <div v-if="imageData != null && $root.xs" class="panel-footer">
                            <div class="media">
                                <div class="media-body">
                                    <h4 class="media-heading">Antemprima</h4>
                                    <div class="thumbnail" style="margin-bottom: 0px;">
                                        <a id="cropped"></a>
                                    </div>
                                </div>
                                <div class="media-right middle">
                                    <a href="" class="btn btn-info btn-sm" @click.prevent="saveAvatar">CONFERMA</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
import {
  eventBus
} from '../../eventbus.js';
import { toggleVisibility } from './alerts/toggleVisibilityAlertMixin.js'

    export default {
        mounted: function(){
            // Check for the various File API support.
            if (window.File && window.FileReader && window.FileList && window.Blob) {
                // Great success! All the File APIs are supported.
                 this.$nextTick(function(){
                    this.initCropper();
                })
            } else {
                eventBus.$emit("alert", "File APIs non sono totalmente supportate in questo browser")
            }
        },
        mixins: [toggleVisibility],
        data: function(){
            return {
                cropInstance: null,
                showDropBox: true,
                imageData: null
            }
        },
        methods: {
            destroyCropInstace: function(){
                this.cropInstance.destroy();
                this.cropInstance = null;
                this.showDropBox = false;
                this.imageData = null;
                this.$nextTick(function(){
                    this.showDropBox = true;
                })
            },
            initCropper: function(){
                console.log("initializating cropper")
                // Setup the dnd listeners.
                var dropZone = document.getElementById('drop_zone');
                dropZone.addEventListener('dragover', this.handleDragOver, false);
                dropZone.addEventListener('drop', this.handleFileSelectDD, false);
                var vm = this;
                document.getElementById('drop_zone').onpaste = function(event) {
                    // use event.originalEvent.clipboard for newer chrome versions
                    var items = (event.clipboardData || event.originalEvent.clipboardData).items;
                    //console.log(JSON.stringify(items)); // will give you the mime types
                    // find pasted image among pasted items
                    var blob = null;
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].type.indexOf("image") === 0) {
                            blob = items[i].getAsFile();
                        }
                    }
                    // load image if there is a pasted image
                    if (blob !== null) {
                        var reader = new FileReader();
                        reader.onload = function(event) {
                            vm.ritaglia(event.target.result);
                        };
                        reader.readAsDataURL(blob);
                    }
                }
            },
            handleFileSelectDD: function(evt) {
                evt.stopPropagation();
                evt.preventDefault();

                var files = evt.dataTransfer.files; // FileList object.

                // files is a FileList of File objects. List some properties.
                var output = [];
                for (var i = 0, f; f = files[i]; i++) {
                    if (!f.type.match('image.*')) {
                        eventBus.$emit("alert", "il file non è un'immagine!")
                        continue;
                    }
                    var reader = new FileReader();
                    var vm = this;
                    // Closure to capture the file information.
                    reader.onload = (function(theFile) {
                        return function(e) {
                            // passa l'immagine in formato base64
                            vm.ritaglia(e.target.result);
                        };
                    })(f);

                    // Read in the image file as a data URL.
                    reader.readAsDataURL(f);

                    output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                        f.size, ' bytes, last modified: ',
                        f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                        '</li>');
                }
            },
            handleDragOver: function(evt) {
                evt.stopPropagation();
                evt.preventDefault();
                evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
            },
            handleFileSelect: function(evt){
                var files = evt.target.files; // FileList object

                // files is a FileList of File objects. List some properties.
                var output = [];
                for (var i = 0, f; f = files[i]; i++) {

                    // Only process image files.
                    if (!f.type.match('image.*')) {
                        eventBus.$emit("alert", "il file non è un'immagine!")
                        continue;
                    }
                    var reader = new FileReader();
                    var vm = this;
                    // Closure to capture the file information.
                    reader.onload = (function(theFile) {
                        return function(e) {
                            // passa l'immagine in formato base64
                            vm.ritaglia(e.target.result);
                        };
                    })(f);

                    // Read in the image file as a data URL.
                    reader.readAsDataURL(f);

                }
                document.getElementById('description').innerHTML = output.join('');
            },
            ritaglia: function(immagineBase64){
                var nascondi = document.getElementById("drop_zone");
                nascondi.style.display = "none";
                nascondi = document.getElementById("files");
                nascondi.style.display = "none";
                nascondi = document.getElementById("description");
                nascondi.style.display = "none";

                var mostra = document.getElementById("cropper");
                mostra.style.display = "inline";

                var crop = new Croppie(document.getElementById('crop'), {
                    viewport: {
                        width: 200,
                        height: 200
                    },
                    boundary: {
                        width: 300,
                        height: 300
                    },
                    enableZoom: true,
                    mouseWheelZoom: true,
                    showZoomer: true,
                    enforceBoundary: false
                });
                this.cropInstance = crop;
                //crop.bind('./cane.jpg');
                crop.bind(immagineBase64);
                crop.setZoom(1);
                var vm = this;
                document.getElementById("cropper").addEventListener("click", function() {
                    var data = crop.get();

                    var result = crop.result('canvas').then(function(img) {
                        var estensione = img.split(";")[0].split("/")[1];
                        vm.imageData = img;
                        vm.$nextTick(function(){
                            document.getElementById("cropped").innerHTML = '<img class="media-object" alt="Embedded Image" src="' + img + '" crossOrigin="Anonymous" style="width: 100px;"/>';
                        })
                    });
                });
            },
            saveAvatar: function(){
                //TODO: this.$http.post img
                localStorage.setItem("userAvatar", this.imageData);
                console.log(this.imageData)
                eventBus.$emit("gotAvatar")
                this.destroyCropInstace();
                this.close();
            }
        }
    }
</script>
<style scoped>
.media-right.middle{
    vertical-align: middle !important;
}

.custom_spinner {
    width: 40px;
}
.custom_spinner:before {
    width: 20px;
    height: 20px;
}

.new_modal-wrapper a.close-button {
    color: rgb(136, 160, 185);
}
.new_modal-header {
    background-color: rgb(136, 160, 185);
}

.input-file {
    opacity: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    cursor: pointer;
}

.dropbox {
    background: rgba(136, 160, 185, 0.4);
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    color: white;
    padding: 10px 10px;
    min-height: 100px;
    /* minimum height */
    position: relative;
    cursor: pointer;
}

.dropbox:hover {
    background: rgba(136, 160, 185, 1);
    color: white;
}

.dropbox p {
    text-align: center;
    margin-top: 14px;
}
</style>
<style>
.croppie-container {
    width: 100%;
    height: 100%;
}

.croppie-container .cr-image {
    z-index: -1;
    position: absolute;
    top: 0;
    left: 0;
    transform-origin: 0 0;
    max-height: none;
    max-width: none;
}

.croppie-container .cr-boundary {
    position: relative;
    overflow: hidden;
    margin: 0 auto;
    z-index: 1;
    width: 100%;
    height: 100%;
}

.croppie-container .cr-viewport,
.croppie-container .cr-resizer {
    position: absolute;
    border: 2px solid #fff;
    margin: auto;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    box-shadow: 0 0 2000px 2000px rgba(0, 0, 0, 0.5);
    z-index: 0;
}

.croppie-container .cr-resizer {
    z-index: 2;
    box-shadow: none;
    pointer-events: none;
}

.croppie-container .cr-resizer-vertical,
.croppie-container .cr-resizer-horisontal {
    position: absolute;
    pointer-events: all;
}

.croppie-container .cr-resizer-vertical::after,
.croppie-container .cr-resizer-horisontal::after {
    display: block;
    position: absolute;
    box-sizing: border-box;
    border: 1px solid black;
    background: #fff;
    width: 10px;
    height: 10px;
    content: '';
}

.croppie-container .cr-resizer-vertical {
    bottom: -5px;
    cursor: row-resize;
    width: 100%;
    height: 10px;
}

.croppie-container .cr-resizer-vertical::after {
    left: 50%;
    margin-left: -5px;
}

.croppie-container .cr-resizer-horisontal {
    right: -5px;
    cursor: col-resize;
    width: 10px;
    height: 100%;
}

.croppie-container .cr-resizer-horisontal::after {
    top: 50%;
    margin-top: -5px;
}

.croppie-container .cr-original-image {
    display: none;
}

.croppie-container .cr-vp-circle {
    border-radius: 50%;
}

.croppie-container .cr-overlay {
    z-index: 1;
    position: absolute;
    cursor: move;
    touch-action: none;
}

.croppie-container .cr-slider-wrap {
    width: 75%;
    margin: 15px auto;
    text-align: center;
}

.croppie-result {
    position: relative;
    overflow: hidden;
}

.croppie-result img {
    position: absolute;
}

.croppie-container .cr-image,
.croppie-container .cr-overlay,
.croppie-container .cr-viewport {
    -webkit-transform: translateZ(0);
    -moz-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
}


/*************************************/


/***** STYLING RANGE INPUT ***********/


/*************************************/


/*http://brennaobrien.com/blog/2014/05/style-input-type-range-in-every-browser.html */


/*************************************/

.cr-slider {
    -webkit-appearance: none;
    /*removes default webkit styles*/
    /*border: 1px solid white; */
    /*fix for FF unable to apply focus style bug */
    width: 300px;
    /*required for proper track sizing in FF*/
    max-width: 100%;
    padding-top: 8px;
    padding-bottom: 8px;
    background-color: transparent;
}

.cr-slider::-webkit-slider-runnable-track {
    width: 100%;
    height: 3px;
    background: rgba(0, 0, 0, 0.5);
    border: 0;
    border-radius: 3px;
}

.cr-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    border: none;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: #ddd;
    margin-top: -6px;
}

.cr-slider:focus {
    outline: none;
}


/*
.cr-slider:focus::-webkit-slider-runnable-track {
background: #ccc;
}
*/

.cr-slider::-moz-range-track {
    width: 100%;
    height: 3px;
    background: rgba(0, 0, 0, 0.5);
    border: 0;
    border-radius: 3px;
}

.cr-slider::-moz-range-thumb {
    border: none;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: #ddd;
    margin-top: -6px;
}


/*hide the outline behind the border*/

.cr-slider:-moz-focusring {
    outline: 1px solid white;
    outline-offset: -1px;
}

.cr-slider::-ms-track {
    width: 100%;
    height: 5px;
    background: transparent;
    /*remove bg colour from the track, we'll use ms-fill-lower and ms-fill-upper instead */
    border-color: transparent;
    /*leave room for the larger thumb to overflow with a transparent border */
    border-width: 6px 0;
    color: transparent;
    /*remove default tick marks*/
}

.cr-slider::-ms-fill-lower {
    background: rgba(0, 0, 0, 0.5);
    border-radius: 10px;
}

.cr-slider::-ms-fill-upper {
    background: rgba(0, 0, 0, 0.5);
    border-radius: 10px;
}

.cr-slider::-ms-thumb {
    border: none;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: #ddd;
    margin-top: 1px;
}

.cr-slider:focus::-ms-fill-lower {
    background: rgba(0, 0, 0, 0.5);
}

.cr-slider:focus::-ms-fill-upper {
    background: rgba(0, 0, 0, 0.5);
}


/*******************************************/


/***********************************/


/* Rotation Tools */


/***********************************/

.cr-rotate-controls {
    position: absolute;
    bottom: 5px;
    left: 5px;
    z-index: 1;
}

.cr-rotate-controls button {
    border: 0;
    background: none;
}

.cr-rotate-controls i:before {
    display: inline-block;
    font-style: normal;
    font-weight: 900;
    font-size: 22px;
}

.cr-rotate-l i:before {
    content: '↺';
}

.cr-rotate-r i:before {
    content: '↻';
}
/*
button,input{text-align:center;text-decoration:none;display:inline-block}.dragDrop,button,input{text-align:center}input,p{color:#bbc}.dragDrop{margin-top:30px;margin-left:auto;margin-right:auto;padding:30px;width:220px;height:220px;line-height:100px;background:#f0f0ff;border:4px dotted #ccd;border-radius:10px}p{font-family:sans-serif;font-weight:700;font-size:28px;line-height:normal}button{border-radius:10px;background-color:#99a;border:none;color:#fff;padding:7px 16px;font-size:16px;outline:0!important}button:hover{background-color:#889}input{border:none;font-size:15px}
*/
</style>