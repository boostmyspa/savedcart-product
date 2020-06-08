<template lang="pug">
	div(v-if="view === 'list'")
		h3 Mom &amp; Dad Mugs
		p
			span(style="margin-right: 5px; text-decoration: line-through; color: rgb(102, 102, 102);")
			span(style="font-weight: 900;") ${{totalPrice | price}}
			span.badge.badge-pill.badge-danger FLASH Sale
		p
			br
			b ⏰ Get Yours before We Sell Out!
		
		.pb-4
			.align-items-center.pt-1
				.row
					.form-group.mb-1.col-12.text-left(v-for="item in items")
						p.mt-4.mb-0: small: a(@click="customize(item)" style="cursor: pointer") Customize →
						label What size coffee mug?
						select.form-control.custom-select(v-model="item.product.size")
							option(:value="size" v-for="size in productsInfo[item.product.productId].sizes") {{size}}
					.col-12.mt-4.text-center
						button.btn.btn-outline-info.btn-block.px-5.mr-2(type="button" @click="addItem") Add product with this design
					.col-12.mt-4.text-center(style="border: 2px solid red; padding: 25px; background-color: aliceblue; margin-top: 20px;")
						button.btn.btn-primary.btn-block.px-5.mr-2(type="button" @click="buy") Buy this Set Now
						small.w-100 Guaranteed Delivery before Father's Day!
		.mt-3.mb-3
			small: a.btn.btn-sm.btn-outline-info(@click="changeBaseDesign") ← Click to go back to editting your design
		
		gbb-loader(ref="loader")
	
	gbb-customization(:item="currentItem" @done="customize(null)" v-else-if="view === 'item'")
</template>

<script>
	import GbbCustomization from './customization.vue';
	import GbbLoader        from '../components/loader.vue';
	import * as api         from '../../js/api';
	import {filterPrice}    from '../../js/util';
	
	export default {
		components: {
			GbbCustomization,
			GbbLoader
		},
		data() {
			return {
				currentItem: null,
				items:       this.$root.items,
				view:        'list' // 'list' | 'item'
			};
		},
		computed: {
			productSlug() {
				return this.$root.productSlug;
			},
			productsInfo() {
				return this.$root.productsInfo;
			},
			totalPrice() {
				return this.items.reduce((sum, item) => sum + this.getItemPrice(item), 0);
			},
			waitList() {
				return this.$root.waitList;
			}
		},
		filters: {
			price: filterPrice
		},
		methods: {
			addItem() {
				this.items.push(JSON.parse(JSON.stringify(this.items[this.items.length-1])));
				this.customize(this.items[this.items.length-1]);
			},
			changeBaseDesign() {
				this.$root.view = 's1';
			},
			customize(item) {
				if (item) {
					this.currentItem = item;
					this.view = 'item';
				} else {
					this.view = 'list';
					this.currentItem = null;
				}
			},
			getItemPrice(item) {
				return this.productsInfo[item.product.productId]?.prices[`${item.product.color}-${item.product.size}`]
			},
			
			async buy() {
				try {
					await this.$refs.loader.show();
					await Promise.all(this.waitList);
					await api.buy(this.productSlug, this.items);
				} finally {
					this.$refs.loader.hide();
				}
			}
		}
	};
</script>
