<template lang="pug">
	.form-group.mb-1
		label.d-block
			| {{question.question}}
			template(v-if="question.type === 'T'")  (Max 20 Letters)
			small.error(style="display: block; color: red" v-if="errors.has(question.question)") This field is required
		
		// Crop an image
		template(v-if="question.type === 'C'")
			div(style="position: relative" @mouseleave="answer.params = $refs.cropme.getParams()" v-if="answer[ORIGINAL_IMAGE]")
				gbb-cropme(ref="cropme"
					:image="answer[ORIGINAL_IMAGE]" :params="answer.params"
					stencil-image="https://glamourbabyboutique.com/media/product_images/mug-testing.png")
				
				button(type="button" @click="resetAnswer" style="position: absolute; top: 0; right: 0; background: none; border: none")
					<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30" height="30" class="icon icon-remove" style="top: -7.5px; right: -7.5px;"><path d="M511.921231 0C229.179077 0 0 229.257846 0 512 0 794.702769 229.179077 1024 511.921231 1024 794.781538 1024 1024 794.702769 1024 512 1024 229.257846 794.781538 0 511.921231 0ZM732.041846 650.633846 650.515692 732.081231C650.515692 732.081231 521.491692 593.683692 511.881846 593.683692 502.429538 593.683692 373.366154 732.081231 373.366154 732.081231L291.761231 650.633846C291.761231 650.633846 430.316308 523.500308 430.316308 512.196923 430.316308 500.696615 291.761231 373.523692 291.761231 373.523692L373.366154 291.918769C373.366154 291.918769 503.453538 430.395077 511.881846 430.395077 520.349538 430.395077 650.515692 291.918769 650.515692 291.918769L732.041846 373.523692C732.041846 373.523692 593.447385 502.547692 593.447385 512.196923 593.447385 521.412923 732.041846 650.633846 732.041846 650.633846Z" fill="red"></path></svg>
			gbb-input-image(v-model="answer[ORIGINAL_IMAGE]"
				default-img="https://glamourbabyboutique.com/static/img/taptoupload.png"
				@file="uploadImage($event).then(id => answer.original_image = id)" v-else)
			input(type="hidden" :name="question.question" v-model="answer[ORIGINAL_IMAGE]" v-validate="'required'")
		
		// Select an image
		template(v-else-if="question.type === 'I'")
			.radio-tile-group(style="justify-content: left")
				.input-container(v-for="(ans, aIndex) in question.answers" :key="aIndex")
					input.radio-button(type="radio" :name="question.question" :value="aIndex" v-model="answer" v-validate="'required'")
					.radio-tile
						img(:src="ans.image" style="max-width: 95%; height: auto; margin: auto")
		
		// Select a color
		template(v-else-if="question.type === 'R'")
			.custom-control.custom-option.custom-control-inline.mb-2(v-for="(ans, aIndex) in question.answers" :key="aIndex")
				input.custom-control-input(:id="question.question+'-'+aIndex" type="radio" :name="question.question" :value="aIndex" v-model="answer" v-validate="'required'")
				label.custom-option-label(:for="question.question+'-'+aIndex" style="background: white")
					span.custom-option-color(:style="{backgroundColor: ans.title}")
		
		// Select from a list
		template(v-else-if="question.type === 'S'")
			select.form-control.custom-select(v-model="answer")
				option(:name="question.question" :value="aIndex" v-validate="'required'" v-for="(ans, aIndex) in question.answers" :key="aIndex") {{ans.title}}
		
		// Type a text
		template(v-else-if="question.type === 'T'")
			input.form-control(type="text" :name="question.question" v-model="answer" v-validate="'required'" maxlength="20")
		
		// Select image > image
		template(v-else-if="question.type === 'V'")
			.radio-tile-group(style="justify-content: left")
				.input-container(v-for="(ans, aIndex) in question.answers" :key="aIndex")
					input.radio-button(type="radio" :name="question.question" :value="ans" v-model="question.selection" v-validate="'required'")
					.radio-tile
						img(:src="ans.image" style="max-width: 95%; height: auto; margin: auto")
				
				div(style="width: 100%; display: flex" v-if="question.selection")
					label.d-block
						| {{question.selection.title}}
						small.error(style="display: block; color: red" v-if="errors.has(question.title)") This field is required
				div(style="width: 100%; display: flex" v-if="question.selection")
					.input-container(v-for="(ans, aIndex) in question.selection.answers" :key="aIndex")
						input.radio-button(type="radio" :name="question.title" :value="aIndex" v-model="answer" v-validate="'required'")
						.radio-tile
							img(:src="ans.image" style="max-width: 95%; height: auto; margin: auto")
		
		// Select from a list > list
		template(v-else-if="question.type === 'W'")
			select.form-control.custom-select(v-model="question.selection")
				option(:name="question.question" :value="ans" v-validate="'required'" v-for="(ans, aIndex) in question.answers" :key="aIndex") {{aIndex}}
			div(v-if="question.selection")
				| {{question.selection.answers}}
				label.d-block
					| {{question.selection.title}}
					small.error(style="display: block; color: red" v-if="errors.has(question.selection)") This field is required
				select.form-control.custom-select(v-model="answer")
					option(:name="question.selection" :value="aIndex" v-validate="'required'" v-for="(ans, aIndex) in question.selection.answers" :key="aIndex") {{ans.title}}
		
		slot(name="footer" v-bind="{question, isValidAnswer}")
</template>

<script>
	import GbbCropme     from './cropme.vue';
	import GbbInputImage from './input-image.vue';
	import * as api      from '../../js/api'
	
	export default {
		components: {
			GbbCropme,
			GbbInputImage
		},
		props: {
			value: {},
			question: {
				type:     Object,
				required: true
			},
			validationEnabled: {
				type:    Boolean,
				default: true
			}
		},
		data() {
			return {
				ORIGINAL_IMAGE: Symbol('[C] Original image file as data URL'),
				
				answer: this.value ?? this.resetAnswer()
			};
		},
		computed: {
			waitList() {
				return this.$root.waitList;
			}
		},
		methods: {
			uploadImage(file) {
				const promise = api.uploadImage(file);
				this.waitList.push(promise);
				return promise;
			},
			
			isValidAnswer() {
				if (!this.validationEnabled) return true;
				
				return (this.question.type === 'C')
					? !!this.answer[this.ORIGINAL_IMAGE]
					: !!this.answer;
			},
			resetAnswer() {
				return (this.question.type === 'C')
					? this.answer = {}
					: this.answer = null;
			},
			async validate() {
				return this.validationEnabled
					? this.$validator.validateAll()
					: Promise.resolve(true);
			}
		},
		watch: {
			answer: {
				handler() {
					this.$emit('input', this.answer);
				}
			}
		},
		async created() {
			if (this.question.type === 'C') {
				if (this.answer.original_image) {
					this.$set(this.answer, this.ORIGINAL_IMAGE, URL.createObjectURL(await api.getImage(this.answer.original_image)));
				}
			}
		},
		beforeDestroy() {
			if (this.question.type === 'C') {
				this.answer.params = this.$refs.cropme.getParams();
			}
		}
	};
</script>
