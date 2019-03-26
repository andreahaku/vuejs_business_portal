<template>
	<div class="col-xs-12" v-if="localItem!=null" :class="{'wrapper_padding_xs' : $root.xs}"
	style="text-align: right; max-height: 100%; overflow-y: auto;">
		<button v-if="action_name" type="button" class="list-group-item" 
		:style="[$root.xs ? {'margin-bottom': '7px'} : '']">
			{{action_name}}
			<a class="btn" :class="[action != null ? action.class : 'btn-default']">
				<i class="fa fa-check" aria-hidden="true"></i>
			</a>
		</button>

		<div v-if="!loading" class="col-xs-12" style="padding: 0px;">
			<div v-show="false" class="panel panel-default paper-shadow animated" data-z="0.5 " 
				style="overflow-y: auto;  margin-top: 12px; height: 500px;">
	    	</div> 
			
			<div v-if="contenuto" id="editor_wrapper" :class="{'expanded' : editor_expanded}" style="padding-bottom: 15px;">
				<a class="btn btn-primary" :class="[editor_expanded ? 'a-expanded' : 'a-compress']" 
				@click.prevent="editor_expanded = !editor_expanded" 
				style="padding: 4px 8px; z-index: 9999; border-bottom-right-radius: 0px;">
					<i class="fa" :class="[editor_expanded ? 'fa-compress' : 'fa-expand']" aria-hidden="true"></i>
				</a>
		 		<vue-editor v-model="content" style="margin-top: 10px;"></vue-editor>
			</div>
			<div v-else>
				<dyn-table :noHead="true" :configs="tableConfigs" :array="indicatori" 
				:tableCss="{'margin-bottom': '0px', 'margin-top': '0px', 'text-align': 'left'}"></dyn-table>
			</div>

		</div>
		
		<div class="col-xs-12" style="padding: 0px;">
			<h4 style="text-align: left; padding-bottom: 4px;">Documenti Allegati</h4>
			<input id="up_file" multiple type="file" name="up" @change="file_change" style="display: none;">
			<button type="button" class="btn btn-sm btn-primary btn-block" onclick="document.getElementById('up_file').click();" 
			style="margin: 4px 0px 4px 0px; padding: 3px 6px; font-size: smaller; width: auto;">Scegli file</button>
		</div>
		

		<div v-if="!loading && files != null && files.length > 0" class="col-xs-12" style="margin: 9px 0px; padding: 0px;">
			<div v-for="(file, index) in files" class="col-xs-12" style="margin: 3px 0px; padding: 0px;">
				<!-- <button type="button" class="btn btn-default btn-block"
				:id="'dd_file'+index" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"
				style="background-color: white;" :class="[xs ? 'wxs' : 'wlg']"><span class="file_name">{{file.name}}</span>
					<i class="fa fa-bars" aria-hidden="true" style="float: right; margin-top: 2px;"></i>
				</button>
				<ul class="dropdown-menu fbutton notransition" :aria-labelledby="'dd_file'+index"
				style="padding: 1px; height: auto;" :class="[xs ? 'lxs' : 'llg']">
	                <li v-if="openFrame[index] ==false">
	                    <a href="#" @click.prevent="download_document(index)">Scarica</a>
	                </li>
	                <li v-if="openFrame[index] == true">
	                    <a v-if="((framesrc != file.path || file.path == null) && (framesrc != file.b64Data || file.b64Data == null)) || xs" 
	                    href="#" @click.prevent="open_document(index)"><span>Apri</span></a>
	                    <a v-else href="#" @click.prevent="framesrc = null">Chiudi</a>
	                </li>
	                <li v-if="openFrame[index] == true && file.path != null">
	                    <a href="#" @click.prevent="download_document(index)">Apri in un'altra scheda</a>
	                </li>
	            </ul> -->
	            <button type="button" class="btn btn-default btn-block"
				:id="'dd_file'+index" @click="open(file)"
				style="background-color: white;" :class="[xs ? 'wxs' : 'wlg']"><span class="file_name">{{file.name}}</span>
					<i class="fa fa-bars" aria-hidden="true" style="float: right; margin-top: 2px;"></i>
				</button>
				<ul class="dropdown-menu fbutton notransition" v-if="file.open == true"
				style="padding: 1px; height: auto; display: block" :class="[xs ? 'lxs' : 'llg']">
	                <li v-if="openFrame[index] ==false">
	                    <a href="#" @click.prevent="download_document(index)">Scarica</a>
	                </li>
	                <li v-if="openFrame[index] == true">
	                    <a v-if="((framesrc != file.path || file.path == null) && (framesrc != file.b64Data || file.b64Data == null)) || xs" 
	                    href="#" @click.prevent="open_document(index)"><span>Apri</span></a>
	                    <a v-else href="#" @click.prevent="emptyframe(file)">Chiudi</a>
	                </li>
	                <li v-if="openFrame[index] == true && file.path != null">
	                    <a href="#" @click.prevent="download_document(index)">Apri in un'altra scheda</a>
	                </li>
	                <li>
	                    <a href="#" @click.prevent="file.open = false">Rimuovi</a>
	                </li>
	            </ul>
			</div>
		</div>

	    <iframe v-if="framesrc != null" :src="framesrc" frameborder="0" width="100%" height="500px" style="margin-bottom: 10px;"></iframe>
	    
		<div v-if="!loading" class="col-xs-12" 
		style="padding:0px; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);">
			<!-- bgimg="images/chat.jpg" 'background-color': '#89f5c8' -->
			<chat metaTxtColor="#222" @insertMSG="new_msg" :items="messages"
			:mycss="{'background-color': 'white', color: '#333', 'box-shadow': 'none', border:'1px solid #bbb'}" 
			:othcss="{'background-color': 'white', color: '#333', 'box-shadow': 'none', border:'1px solid #bbb'}"></chat>
		</div>
    </div>
</template>
<script>
import { VueEditor } from 'vue2-editor'
import Chat from '../_fullDyn/chat.vue'
import DynTable from '../_fullDyn/DynTable.vue'

	export default {
		props: {
			item: Object
		},
		components: {
			VueEditor,
			Chat,
			DynTable
		},
		mounted: function(){
			this.tryFromRoute();

			this.messages = this.$Test.chat;
			for(var i = 0; i < this.messages.length; i++){
				//OVERRIDE MY MSG FROM TEST 
				if(this.messages[i].mio == true){
					this.messages[i].IDPersona = localStorage.getItem("idpersona");
					this.messages[i].Persona = localStorage.getItem("nomecognome");
					this.messages[i].Immagine = localStorage.getItem("userAvatar")
				}
			}
		},
		watch: {
			item: function(){
				this.localItem = this.item;
				this.framesrc = null;
				this.$nextTick(function(){
					document.getElementById('up_file').value = null;
					console.log(document.getElementById('up_file').value)
				})
				
				this.initDetail();
			},
			'$route': function() {
	            this.tryFromRoute();
	        }
		},
		data: function(){
			return {
				xs: this.$root.xs,
				loading: true,
				permission: false,
				action: null,
				action_name: null,

				content: null,

				files: null,
				openFrame: [],
				framesrc: null,

				editor_expanded: false,

				localItem: null,
				contenuto: false,

				//TABLE TEST 
				indicatori: this.$Test.tabella.dati,
				tableConfigs: this.$Test.tabella.configs,
				messages: null
			}
		},
		methods: {
			emptyframe: function(file){
				file.open = false;
				this.framesrc = null;
			},
			open: function(file){
				for(var i = 0; i < this.files.length; i++){
					this.files[i].open = false;
				}
				file.open = !file.open;
			},
			tryFromRoute: function(){
				var id;
				try {
					id = this.$route.params.idindice;
					var collection = this.$store.getters.getIndici;
					var el = collection.find({ 'idIndice': parseInt(id) });
					if(el.length > 0){
						this.localItem = el[0];
						this.initDetail();
					} else {
						this.$router.replace({
		                    name: 'main-board'
	            		});
					}
				} catch(err) {
					this.$router.replace({
	                    name: 'main-board'
            		});
				}
			},
			initDetail: function(){
				this.loading = true;
				switch(this.localItem.stato.id){
					case 1: 
						this.action_name = "contrassegna come completato";
					break;
					case 2: 
						this.action_name = "contrassegna come approvato";
					break;
					case 3: 
						this.action_name = "contrassegna come valido";
					break;
					default:
						this.action_name = null;
				}
				if(this.localItem.action.id != 3){
					this.action = this.localItem.action;
				} else {
					this.action = null;
				}
				
				this.files = this.localItem.files;
				this.openFrame = this.parseFiles();
				this.contenuto = this.localItem.tipo == "contenuto"
				this.loading = false;
			},
			file_change: function($event){
				var files = [];
				try {
					files = $event.srcElement.files;
				} catch(err){
					console.log("error in parsing event from input file:")
					console.log(err)
				}
				console.log(files)
				for(var i = 0; i < files.length; i++){
					var file = files[i];
					this.fetchFile(file)
				}
				console.log(this.files)
			    console.log($event);
			},
			fetchFile: function(file){
				var reader = new FileReader();
			    reader.readAsDataURL(file);
			    var vm = this;
			    reader.onload = function () {
			       vm.files.push({
			       		name: file.name,
			       		b64Data: reader.result,
			       		open: false
			       });
			       try {
			       	   console.log(file.name)
			       	   var n = file.name.split('.');
					   vm.openFrame.push(n[1] == 'pdf' || n[1] == 'html' || n[1] == 'htm')
				   } catch(err){console.log(err)}
			    };
			    reader.onerror = function (error) {
			      console.log('Error: ', error);
			    };
			},
			parseFiles: function(){
				//files in complex object
				var slice = this.files.slice();
				this.files = [];
				//files array handles path or Base64 encoded file
				for(var i = 0; i < slice.length; i++){
					try {
						console.log(slice[i])
						var name = slice[i].split('/');
						name = name[name.length - 1];
						var ext = name.split('.')[1];
						this.files.push({
							name: name,
							ext: ext,
							path: slice[i],
							open: false
						})
					} catch(err) {
						console.log("Error splitting files array")
						console.log(err)
					}
				}

				this.openFrame = [];
				for(var i = 0; i < this.files.length; i++){
					if(this.files[i] != null){
						var p = this.files[i]
						try {
							this.openFrame.push(p.ext == 'pdf' || p.ext == 'html' || p.ext == 'htm');
						} catch (err) {
							console.log(err)
							this.openFrame.push(false);
						}
					}	
				}
				return this.openFrame;
			},
			download_document: function(index){
				var what = this.files[index];
				what.open = false;
				if(what.path != null){
					window.open(what.path);
				} else {
					window.open(what.b64Data);
				}
			},
			open_document: function(index){
				var what = this.files[index];
				what.open = false;
				if(what.path != null){
					if(this.xs){
						window.open(what.path);
					} else {
						this.framesrc = what.path;
					}
				} else {
					this.framesrc = what.b64Data;
				}
			},
			new_msg: function(e){
				var InserisciCommento = new Promise(function(res, err){
	                setTimeout(function(){
	                    res();
	                }, 1000)
	            })
	            InserisciCommento.then((response) => {
	                var m = {
	                    ID: 1521,
	                    IDPersona: localStorage.getItem("idpersona"),
	                    Persona: localStorage.getItem("nomecognome"),
	                    Immagine: localStorage.getItem("userAvatar"),
	                    DataInserimento: "Adesso",
	                    Testo: e.msg
	                }
	                e.callback(null, m);
	            });
			}
		}
	}
</script>
<style scoped>
.notransition {
  -webkit-transition: none !important;
  -moz-transition: none !important;
  -o-transition: none !important;
  transition: none !important;
}
	.file_name {
		max-width: 90%;
	    overflow-x: hidden;
	    text-overflow: ellipsis;
	    display: inline-block
	}
	.fbutton { 
		text-align: center; 
		top: 0px;
	}
	.wxs {
		width: 100%;
	}
	.wlg {
		width: 50%;
	}
	.lxs {
		left: 0px;
		top: 33px;
	}
	.llg {
		left: 50%;
		top: 0px;
	}
	li:hover > a{
		background-color: #42a5f5;
		color: white;
	}

	button.list-group-item {
		padding: 0px 0px 0px 10px; 
		float: right;
		border-radius: 10px !important;
		cursor: default;
	}
	button.list-group-item > a {
		margin-left: 5px;
		padding: 6px 10px;
		border-top-right-radius: 10px;
		border-bottom-right-radius: 10px;
	}
	button.list-group-item > a.btn-default {
		cursor: not-allowed;
	}
	button.btn-block {
		padding: 6px 12px;
		border-width: 2px;
		border-color: #CCC;
		border-style: outset;
		border-radius: 4px;
	}

	#up_file::-webkit-file-upload-button{
		background-color: #42a5f5;
		color: white;
		border-radius: 4px;
		padding: 4px 8px;
	}

	#editor_wrapper {
	    -webkit-transition: background-color 0.3s ease;
    	transition: background-color 0.3s ease;
	}
	#editor_wrapper.expanded {
		position: fixed;
	    z-index: 9997;
	    top: 0;
	    left: 0;
	    width: 100%;
	    height: 100%;
	    background-color: rgba(0, 0, 0, .5);
	    display: table;
	}
	
	a.a-expanded {
		position: fixed;
		bottom: 10%;
		right: 10%;
	}
	a.a-compress {
		position: absolute; 
		bottom: 15px; 
		right: 0px;
	}

	.wrapper_padding_xs {
		padding: 10px;
	}
</style>
<style>
	div.quillWrapper {
		background-color: white;
		box-shadow: rgba(0, 0, 0, 0.3) 0px 2px 6px;
	}
	#editor_wrapper.expanded div.quillWrapper {
		top: 10%;
		left: 10%;
		height: 80%;
		width: 80%;
		position: fixed;
		z-index: 9998;
	}

	#editor_wrapper.expanded div.ql-toolbar {
		text-align: center;
		height: 5%;
	}
	#editor_wrapper.expanded div.ql-container {
		height: 95% !important;
	}

	div.quillWrapper polygon {
		display: none;
	}
</style>
