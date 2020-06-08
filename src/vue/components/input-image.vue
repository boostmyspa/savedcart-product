<template lang="pug">
	div(:class="{active: isDragging || isProcessing}")
		label(:for="id" style="position: relative")
			div
				img(:src="value || defaultImg")
			div(@dragenter="isDragging = true" @dragleave="isDragging = false"
			     @dragover.prevent @drop.prevent="handleDnD"
			     style="position: absolute; top: 0; right: 0; bottom: 0; left: 0; cursor: pointer")
		input(type="file" :id="id" ref="file" @change="handleInput" style="display: none")
</template>

<script>
	import {generateUID} from '../../js/util'
	
	export default {
		props: {
			value:      String,
			defaultImg: String
		},
		data() {
			return {
				isDragging:   false,
				isProcessing: false
			};
		},
		computed: {
			id() {
				return `${this.$options.name}-${generateUID()}`;
			}
		},
		methods: {
			handleDnD(ev) {
				if (ev.dataTransfer.items) {
					const item = ev.dataTransfer.items[0];
					if (item.kind !== 'file') return;
					
					this.process(item.getAsFile());
				} else {
					const file = ev.dataTransfer.files[0];
					this.process(file);
				}
				this.isDragging = false;
			},
			handleInput() {
				const file = this.$refs.file.files[0];
				if (!file) return;
				
				this.process(file);
			},
			process(file) {
				this.$emit('file', file);
				
				var reader = new FileReader();
				reader.addEventListener('load', () => {
					this.$emit('input', reader.result);
				});
				reader.readAsDataURL(file);
			}
		}
	};
</script>
