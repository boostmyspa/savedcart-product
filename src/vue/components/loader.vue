<template lang="pug">
	.modal(ref="modal" tabindex="-1" role="dialog" data-keyboard="false" data-backdrop="static" v-if="isVisible")
		.modal-dialog.modal-dialog-centered(role="document")
			.modal-content
				.modal-header
					h5.modal-title Creating Your Customization
				.modal-body
					.progress.mb-3
						.progress-bar.progress-bar-striped.progress-bar-animated(role="progressbar" :style="{width: `${progress}%`}")
					.list-group
						a.list-group-item.list-group-item-action(href="#"
							v-if="progress >= visible"
							:class="[(progress >= active) ? 'active' : 'disabled']"
							v-for="[visible, active, message] in messages")
							| {{message}}
</template>

<script>
	export default {
		data() {
			return {
				isVisible: false,
				progress: 0,
				timeoutHandlers: [],
				
				messages: [
					// [visible, active, message]
					[ 0, 10,  'Preparing Your Custom Product'],
					[10, 20,  'Grabbing the Necessary Supplies'],
					[20, 30,  'Putting together your Custom Made Product'],
					[30, 30,  'Preparing for Pictures'],
					[40, 40,  'Calling the Photographer'],
					[50, 50,  'Uploading the Pictures to the Server'],
					[60, 60,  'Sending to the Dark Room'],
					[70, 70,  'Waiting for it to develop...'],
					[80, 80,  'Doing the Finishing Touches'],
					[90, 90,  'All Set and just one more step.'],
					[95, 100, 'Downloading the files....']
				],
				states: [
					// [time, progress]
					[  300,  10],
					[  400,  20],
					[  700,  30],
					[ 1000,  40],
					[ 8000,  50],
					[10000,  60],
					[13000,  70],
					[16000,  80],
					[18000,  90],
					[20000, 100]
				]
			};
		},
		methods: {
			async hide() {
				$(this.$refs.modal).modal('hide')
				
				await this.$nextTick();
				this.isVisible = false;
				
				this.timeoutHandlers.forEach(clearTimeout);
				this.timeoutHandlers = [];
			},
			async show() {
				this.progress = 0;
				this.isVisible = true;
				await this.$nextTick();
				
				$(this.$refs.modal).modal('show');
				
				this.timeoutHandlers = this.states.map(([delay, progress]) => setTimeout(() => this.progress = progress, delay));
			}
		}
	};
</script>
