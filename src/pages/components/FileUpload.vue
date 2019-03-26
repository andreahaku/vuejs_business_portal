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
                                <h4 class="media-heading">Carica File</h4>
                                <p>Carica uno o più documenti da allegare all'edizione</p>
                            </div>
                            <div class="header-buttons">
                                <a class="close-button" @click="chCancel()"><i class="fa fa-times" style="text-align: center; position: relative;"></i></a>
                            </div>
                        </div>
                    </div>
                    <div class="new_modal-body panel">
                        <div class="panel-body">
                            <!-- <div v-if="loading" class="alert custom_spinner"></div> -->
                            <div class="modal-body dropbox">
                            <input type="file" multiple name="uploadField" class="input-file" @change="filesChange">
                            <p v-if="isInitial()">
                                Trascina i tuoi file qui<br>o clicca per cercare nel sistema
                            </p>
                            <p v-if="isSaving()">
                                Caricando...
                            </p>
                        </div>
                        <div class="modal-body files">
                            <p v-if="!uploadedFiles || uploadedFiles.length == 0">
                                Nessun file caricato.
                            </p>
                            <p v-for="(file, index) in uploadedFiles" :key="index" class="fileItem">
                                <span class="fileName">
                                    <span @click="uploadedFiles.splice(index, 1)"><i class="fa fa-times" style="text-align: center; margin-right: 8px; cursor: pointer;"></i></span> 
                                    <span v-if="!file.editmode">{{ formatFileName(file.overrideName, file.ext) }}</span><input v-else type="text" v-model="file.overrideName" style="width: 200px">
                                    <i v-if="!file.editmode" class="fa fa-edit" style="text-align: center; margin-left: 8px; cursor: pointer;" @click="file.editmode = true"></i>
                                    <i v-else class="fa fa-save" style="text-align: center; margin-left: 8px; cursor: pointer;"  @click="file.editmode = false"></i>
                                </span>
                                <!-- TODO USARE OVERRIDE NAME IN V-MODEL-->
                                
                                <span class="fileSize">{{ file.display_size }}</span>
                            </p>
                        </div>
                        </div>
                        <div class="panel-footer">
                            <div v-if="uploadingFiles" class="custom_spinner" style="bottom: 1px;"></div>
                            <a v-if="uploadedFiles && uploadedFiles.length > 0" href="" class="btn btn-warning btn-sm" @click.prevent="uploadedFiles = []">SVUOTA</a>
                            <a href="" class="btn btn-info btn-sm" :disabled="!uploadedFiles || uploadedFiles.length == 0" @click.prevent="chOk()">CONFERMA</a>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import MoonLoader from 'vue-spinner/src/MoonLoader.vue'
import { toggleVisibility } from './alerts/toggleVisibilityAlertMixin.js'

const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_SUCCESS = 2, STATUS_FAILED = 3;

export default {
    components: {
        MoonLoader
    },
    data() {
        return {
            currentStatus: null,
            uploadedFiles: [],
            uploadError: null,
            fileCount: 0,
            uploadingFiles: false
        }
    },
    mixins: [toggleVisibility],
    props: {
        uploadData: {
            callerId: String,
            choice: String,
            idOggetto: String,
            tipoOggetto: String
        }
    },
    mounted() {
        this.reset()
    },
    methods: {
        reset() {
            this.currentStatus = STATUS_INITIAL
            this.uploadedFiles = []
            this.uploadError = null
            this.fileCount = 0
        },
        isInitial() {
            return this.currentStatus === STATUS_INITIAL;
        },
        isSaving() {
            return this.currentStatus === STATUS_SAVING;
        },
        isSuccess() {
            return this.currentStatus === STATUS_SUCCESS;
        },
        isFailed() {
            return this.currentStatus === STATUS_FAILED;
        },
        filesChange(event) {
            let formData = new FormData()
            var name = event.target.name
            var files = event.target.files
            var fileCount
            var vm = this

            if (!files.length)
                return

            fileCount = files.length

            for (var i = 0; i < files.length; i++) {
                this.upload(files[i])
            }           
        },
        upload(file) {
            var reader = new FileReader()
            var vm = this
            reader.onloadend = (e) => {
                if (e.currentTarget.error == null) {
                    var now = new Date();
                    var pushing = {
                        name: file.name,
                        size: file.size,
                        editmode: false,
                        File: e.currentTarget.result,
                        data: now.toLocaleDateString()
                    }
                    if(file.size < 1024 * 1024){
                        pushing.display_size = Math.floor(file.size / 1024) + " KB"
                    } else {
                        pushing.display_size = Math.floor(file.size / (1024 * 1024)) + " MB"
                    } 
                    var overrideName = '';
                    try {
                        overrideName = pushing.name.split(".");
                        pushing.ext = overrideName.splice(overrideName.length - 1, 1);
                        overrideName = overrideName.join(".")
                        console.log(overrideName)
                        console.log(pushing.ext)
                    } catch(err) {}

                    pushing.overrideName = overrideName;
                    vm.uploadedFiles.push(pushing);
                }
                else {
                    vm.uploadError = e.currentTarget.error
                }
            }
            reader.readAsDataURL(file)
        },
        formatFileName(name, ext) {
            if (name && name.length > 30) {
                return name.substring(0, 30) + "." + ext + "..."
            }
            else {
                return name + "." + ext
            }
        },
        chCancel() {
            this.uploadData.choice = 'cancel'
            this.$emit('endModal', this.uploadData)
            this.close();
        },
        chOk() {
            var vm = this;
            var promises = [];
            this.uploadingFiles = true;
            for(var i = 0; i < this.uploadedFiles.length; i++){
                var up = {}
                var towebapi = ["name", "File", "data"];
                for( var ii = 0; ii < towebapi.length; ii++ ){
                    up[towebapi[ii]] = this.uploadedFiles[i][towebapi[ii]];
                }
                // OVERRIDE NAME
                up.name = this.uploadedFiles[i].overrideName + "." + this.uploadedFiles[i].ext;
                // --- TODO: Gestire l'inicio di entrambi i campi

                up.IDOggetto = this.uploadData.idOggetto.toString();
                up.TipoOggetto = this.uploadData.tipoOggetto;
                up.flagPrincipale = 0;
                var t = JSON.stringify(up)
                promises.push(this.$http.post(localStorage.getItem('path') + '/Webapi', t, {
                    headers: {
                        'X-HTTP-Method-Override': "InsertDocumenti",
                        'Content-Type': 'application/json'
                    }
                }))
            }
    
            //API FRANZ
            /*
            this.$http.post(localStorage.getItem('path') + 'APIDocumenti', t, {
                headers: {
                    IdSocieta: this.$root.UserData.IdSocieta,
                    IdUtente: this.$root.UserData.IdUtente.toString(),
                    IdOggetto: this.uploadData.idOggetto.toString(),
                    TipoOggetto: this.uploadData.tipoOggetto
                }
            }).then((r) => {
                this.uploadData.choice = 'ok'
                this.$emit('endModal', this.uploadData)
                this.close();
            },(err) => {
                this.chCancel();
            })
            */
                
            if (promises.length > 0) {
                Promise.all(promises).then(function() {
                    vm.uploadData.choice = 'ok'
                    vm.$emit('endModal', vm.uploadData)
                    vm.reset();
                    vm.close();
                    vm.uploadingFiles = false;
                }, function(err) {
                    console.log(err);
                    vm.uploadData.choice = 'error'
                    vm.$emit('endModal', vm.uploadData)
                    vm.close();
                    vm.uploadingFiles = false;
                })
            } else {
                console.log(err);
                this.uploadData.choice = 'error'
                this.$emit('endModal', this.uploadData)
                this.uploadingFiles = false;
                this.close();
            }
        }        
    }
}
</script>

<style scoped>
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

.input-file {
    opacity: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    cursor: pointer;
}

.files {
    display: grid;
    max-height: 50vh;
    overflow: auto;
    margin-top: 10px;
}

.fileName {
    float: left;
    font-size: smaller;
    font-style: italic;
}

.fileSize {
    float: right;
    color: blue;
    font-size: smaller;
    font-style: italic;
}
</style>