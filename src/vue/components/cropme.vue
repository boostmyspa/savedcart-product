<template lang="pug">
	div(ref="root")
</template>

<script>
	export default {
		props: {
			image: {
				type:     String,
				required: true
			},
			params:       Object,
			stencilImage: String
		},
		data() {
			return {
				instance: null
			};
		},
		methods: {
			crop(options) {
				return this.instance.crop(options || {type: 'base64'}).then(image => {
					const result = {
						image,
						params: this.getParams()
					};
					this.$emit('crop', result);
					return result;
				});
			},
			getParams() {
				return {
					position: this.instance.position(),
					viewport: {
						height: this.instance.options.viewport.height,
						width:  this.instance.options.viewport.width
					}
				};
			}
		},
		async mounted() {
			const options = {
				width:  300,
				height: 300,
				zoom: {
					enable:     true,
					mouseWheel: true,
					slider:     true
				},
				rotation: {
					enable:   true,
					slider:   true,
					position: 'left'
				}
			};
			if (this.params) {
				const viewportOptions = this.params.viewport;
				if (viewportOptions) {
					if (!options.viewport) options.viewport = {};
					
					options.viewport.height = viewportOptions.height;
					options.viewport.width  = viewportOptions.width;
				}
			}
			
			this.instance = new Cropme(this.$el, options);
			await this.instance.bind({
				url:      this.image,
				position: this.params?.position
			});
			
			if (this.stencilImage) {
				const $viewport = this.$refs.root.querySelector('.viewport');
				if ($viewport) {
					$viewport.style = `background: url('${this.stencilImage}'); background-size: contain`;
				}
			}
		}
	};
</script>
