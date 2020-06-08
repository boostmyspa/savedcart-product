<template lang="pug">
	div
		.container.pb-5
			.row
				.col-12.pt-md-5.pt-2.d-none.d-md-block
					nav(aria-label="breadcrumb")
						ol.breadcrumb.justify-content-center.justify-content-md-start
							li.breadcrumb-item: a(href="#") SHOP
				.col-lg-6
					.product-gallery.p-3.position-sticky(style="top: 0; padding-left: 0 !important")
						img(src="https://placehold.it/600x600")
					// Related products (visible lg and up)
				
				// Product details column
				.col-lg-5.col-lg-offset-1
					// Product title and price (visible lg and up)
					gbb-base-design.card.p-3.mb-3(  v-if="view === 's1'")
					gbb-products.card.p-3.mb-3(v-else-if="view === 's2'")
		
		
</template>

<script>
	import GbbBaseDesign from './pages/base-design.vue';
	import GbbProducts   from './pages/products.vue';
	
	export default {
		components: {
			GbbBaseDesign,
			GbbProducts
		},
		props: {
			baseDesign: Object,
			baseDesignQuestions: {
				type:     Object,
				required: true
			},
			customizationQuestions: {
				type:     Object,
				required: true
			},
			items: {
				type:     Array,
				required: true
			},
			productSlug: {
				type:     String,
				required: true
			},
			productsInfo: {
				type:     Object,
				required: true
			}
		},
		data() {
			return {
				view:     this.baseDesign ? 's2' : 's1', // 's1' | 's2'
				waitList: []
			};
		},
		created() {
			this.items
				.filter(item => !item.design)
				.forEach(item => item.design = this.baseDesign);
		}
	};
</script>
