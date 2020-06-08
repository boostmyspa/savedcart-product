<template lang="pug">
	div
		h3 Let's Create Your Personalized Matching Set
		
		gbb-question-set(:questions="baseDesignQuestions" v-model="answers" @finish="finish")
</template>

<script>
	import GbbQuestionSet from '../components/question-set.vue';
	
	export default {
		components: {
			GbbQuestionSet
		},
		data() {
			return {
				answers: this.$root.baseDesign ?? null
			};
		},
		computed: {
			baseDesignQuestions() {
				return this.$root.baseDesignQuestions;
			}
		},
		methods: {
			finish() {
				this.$root.baseDesign = this.answers;
				this.$root.items.forEach(item => item.design = this.$root.baseDesign);
				this.$root.view = 's2';
			}
		}
	};
</script>
