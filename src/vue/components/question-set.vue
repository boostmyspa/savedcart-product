<template lang="pug">
	div(ref="top")
		div(v-for="(grouping, grName, grIndex) in questions" :key="grName")
			h6.mt-3(v-if="isGroupingShouldBeShown(grIndex)") {{grouping.name}}
			
			transition-group(name="fade" tag="div" mode="out-in")
				gbb-question(ref="question" :question="question" :validationEnabled="validationEnabled" v-model="answers[grName].attributes[qName]"
					v-if="isQuestionShouldBeShown(grIndex, qIndex)"
					v-for="(question, qName, qIndex) in grouping.attributes" :key="qName")
					template(#footer="{question, isValidAnswer}")
						button.btn.btn-primary.btn-block.px-5.mr-2.mt-3(@click="goToNextQuestion"
							v-if="isSaveButtonShouldBeShown(isValidAnswer())")
							i.mr-2(data-feather="shopping-cart")
							| Save & Next Step
		
		.pb-4
			.d-flex.flex-wrap.pt-1
				div(v-if="isFinishButtonShouldBeShown()")
					button.btn.btn-primary.btn-block.px-5(type="button" @click="finish")
						i.mr-2(data-feather="shopping-cart")
						| Save
			//.mt-3.text-center
				small: a.btn.btn-sm.btn-outline-info(@click="finish" v-if="answers") Go back to selecting quantity →
</template>

<script>
	import GbbQuestion from '../components/question.vue';
	import {isMobile}  from '../../js/util';
	
	function isDummyEqual(a, b) {
		return (a === b) || (JSON.stringify(a) === JSON.stringify(b));
	}
	
	export default {
		components: {
			GbbQuestion
		},
		props: {
			value: {},
			questions: {
				type:     Object,
				required: true
			},
			validationEnabled: {}
		},
		data() {
			return {
				background: '',
				color:      '',
				
				answers: this.value,
				
				breadcrumbs: [0, 0]
			};
		},
		computed: {
			currentGroupingName() {
				return Object.keys(this.questions)[this.breadcrumbs[0]];
			},
			currentGrouping() {
				return Object.values(this.questions)[this.breadcrumbs[0]];
			},
			currentQuestionName() {
				return Object.keys(this.currentGrouping.attributes)[this.breadcrumbs[1]];
			},
			currentQuestion() {
				return Object.values(this.currentGrouping.attributes)[this.breadcrumbs[1]];
			},
			currentAnswer() {
				return this.answers[this.currentGroupingName]?.attributes[this.currentQuestionName];
			},
			
			isCurrentGroupingLast() {
				return this.breadcrumbs[0] === this.lastStep[0];
			},
			isCurrentQuestionLastInCurrentGrouping() {
				return this.breadcrumbs[1] === (Object.keys(this.currentGrouping.attributes).length - 1);
			},
			isCurrentQuestionLast() {
				return isDummyEqual(this.breadcrumbs, this.lastStep);
			},
			
			lastStep: function() {
				const grNames = Object.keys(this.questions);
				const qNames  = Object.keys(this.questions[grNames[grNames.length-1]].attributes);
				
				return [grNames.length-1, qNames.length-1];
			}
		},
		methods: {
			isGroupingShouldBeShown(groupingIndex) {
				return !isMobile() || (groupingIndex == this.breadcrumbs[0]);
			},
			isQuestionShouldBeShown(groupingIndex, questionIndex) {
				return !isMobile() || isDummyEqual([groupingIndex, questionIndex], this.breadcrumbs);
			},
			isSaveButtonShouldBeShown(condition = true) {
				return condition && isMobile() && !this.isCurrentQuestionLast;
			},
			isFinishButtonShouldBeShown() {
				return !isMobile() || this.isCurrentQuestionLast;
			},
			
			goToNextGrouping() {
				if (this.isCurrentGroupingLast) return;
				
				this.$set(this.breadcrumbs, 0, this.breadcrumbs[0] + 1);
				this.$set(this.breadcrumbs, 1, 0);
			},
			async goToNextQuestion() {
				try {
					if (await this.validateQuestions()) {
						if (this.isCurrentQuestionLastInCurrentGrouping) {
							this.goToNextGrouping();
						} else {
							this.$set(this.breadcrumbs, 1, this.breadcrumbs[1]+1);
						}
						
						this.$refs.top.scrollIntoView();
					}
				} catch (e) {
					console.log(e);
				}
			},
			
			async validateQuestions() {
				let result = true;
				
				for (const question of this.$refs.question) {
					try {
						if (!await question.validate()) result = false;
					} catch (e) {
						result = false;
					}
				}
				
				return result;
			},
			
			async finish() {
				if (await this.validateQuestions()) {
					this.$emit('input', {
						background: this.background.replace('rgb', ''),
						color:      this.color     .replace('rgb', ''),
						...this.answers
					});
					this.$emit('finish');
				}
			}
		},
		created() {
			if (!this.answers) {
				this.$set(this, 'answers', {});
				for (const [grName, grouping] of Object.entries(this.questions)) {
					this.$set(this.answers, grName, {
						attributes: {}
					});
					
					for (const [qName, question] of Object.entries(grouping.attributes)) {
						this.$set(this.answers[grName].attributes, qName, question.answer);
					}
				}
			}
		}
	};
</script>
