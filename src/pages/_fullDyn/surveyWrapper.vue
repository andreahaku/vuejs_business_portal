<template>
	<span>
		<div id="surveyContainer" :class="wrapperClasses" :style="wrapperStyle"></div>
		<alertchoice :show="showModal" :mess="message" @done="handleChoice"></alertchoice>
	</span>
</template>
<script>
import alertchoice from '../recruiting/cv-components/alert-choice.vue'

export default {
	props: {
		json_survey: Object,

		wrapperClasses: String,
		wrapperStyle: Object,

		headerClasses: String,
		titleClasses: String
	},
	mounted: function(){
		this.permit = this.$Ev(this.$parent.permessi.Survey)
		console.log("Survey")
		console.log(this.permit)
		this.$nextTick(function(){
			this.init();
		})
	},
	components: {
		alertchoice
	},
	data: function(){
		return {
			showModal: false,
			survery: null,
			filled: 0,
			tot: 0,
			permit: null
		}
	},
	computed: {
		message: function(){
			return 'You answered ' + this.filled + ' of ' + this.tot + ' question, do you wish to proceed?'
		}
	},
	methods: {
		mandatorySurveyAPI: function(){
			return !this.survey.isCurrentPageHasErrors;
		},
		getValueSurveyAPI: function(){
			return this.survey.data;
		},
		init: function(){
			var jsonSurvey;
			if(this.json_survey == null){
				jsonSurvey = this.$root.performance_survey_template;
			} else {
				jsonSurvey = this.json_survey;
			}
			console.log(jsonSurvey)
			this.survey = new Survey.Survey(jsonSurvey);
			this.$emit("SurveyAPI", { mandatoryCheck: this.mandatorySurveyAPI, getValue: this.getValueSurveyAPI});
			console.log(this.survey)
			console.log(Survey)
			var vm;
			this.survey.onValueChanged.add(function(){
				vm.$parent.modified = true;
			})
			
			
			console.log("scheda val")
			console.log(this.$parent.schedaVal)
			
			var previous_answers = this.$parent.schedaVal.RisposteSurvey
			if(previous_answers != null && previous_answers != {}){
				previous_answers = JSON.parse(previous_answers)
				this.survey.data = previous_answers;
			}
			
			this.survey.onComplete.add(function (s) {
				console.log(s.data)
			});	
			var vm = this;
			this.survey.onCheckBeforeComplete.add(function (s) {
				console.log(JSON.stringify(s.data))
				vm.tot = s.currentPage.questions.length;
				var f = 0;
				for(var prop in s.data){
					f++;
				}
				vm.filled = f; 
				vm.showModal = true;
			});	

			this.survey.render("surveyContainer");
			this.$nextTick(function(){
				if(this.headerClasses != null){
					$("#surveyContainer > div.panel-heading").addClass(this.headerClasses);
				}
				if(this.titleClasses){
					$("#surveyContainer > div.panel-heading > h3").addClass(this.titleClasses);
				}

				if(this.$Ev(this.$parent.permessi.Survey) == "vis"){
					$("#surveyContainer form.form-inline").addClass("well well-sm");
					$("#surveyContainer :input").prop("disabled", true);
				}
			})
		},
		handleChoice: function($event) {
            this.showModal = false;

            if ($event == true) {
            	//completeLastPage segnala alla libreria l'effettivo completamento del survey
				this.survey.completeLastPage();
            } else {
                console.log("Do Nothing")
            }
        }
	}
}
</script>
<style>
	#surveyContainer .radio,
	#surveyContainer .checkbox{
		padding-left: 10px;
	}
	#surveyContainer .radio label::before, 
	#surveyContainer .checkbox label::before {
		display: none;
	}

	#surveyContainer .form-inline .radio input[type="radio"], 
	#surveyContainer .form-inline .checkbox input[type="checkbox"] {
		opacity: 1;
		margin-right: 5px;
		cursor: pointer;
	}

	#surveyContainer select.form-control {
		margin-bottom: 20px;
	}

	#surveyContainer .panel-footer {
		background-color: inherit;
		padding-top: 0px;
	}

	#surveyContainer .panel-body {
		padding-bottom: 5px;
	}

	#surveyContainer h3 {
		margin-top: 0px;
	}

	#surveyContainer div.panel-footer {
		display: none;
	}

	#surveyContainer div.alert.alert-danger span.glyphicon {
		display: none;
	}

	#surveyContainer div.alert.alert-danger {
		margin-bottom: 12px;
		padding: 10px 15px;
		color: #a94442 !important;
    	background-color: #f2dede !important;
    	border-color: #ebccd1 !important;
	}
	    
</style>