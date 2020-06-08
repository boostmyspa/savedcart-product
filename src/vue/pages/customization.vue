<template lang="pug">
	div(v-if="item")
		h3 Mom &amp; Dad Mugs
		p
			span(style="margin-right: 5px; text-decoration: line-through; color: rgb(102, 102, 102);")
			span(style="font-weight: 900;" v-if="price") ${{price | price}}
			.badge.badge-pill.badge-danger FLASH Sale
		
		p: b Your Product Selection
		.product-list
			.product(v-for="(product, productId) in productsInfo")
				input.product__checkbox(:id="`product-${productId}`" type="radio" name="product" :value="productId" v-model="item.product.productId")
				label.product__label(:for="`product-${productId}`")
					img.product__image(:src="product.image")
		
		template(v-if="item.product.productId")
			p: b Your Color Selection
			.color-list
				.color(v-for="color in productsInfo[item.product.productId].colors")
					input.color__checkbox(:id="`color-${color.name}`" type="radio" name="color" :value="color.name" v-model="item.product.color" :style="{backgroundColor: color.code}")
			
			.form-group.mb-1.col-12.text-left
				label Your Size Selection
				select.form-control.custom-select(v-model="item.product.size")
					option(:value="size" v-for="size in productsInfo[item.product.productId].sizes") {{size}}
			
			gbb-question-set(:questions="customizationQuestions" :validationEnabled="false" v-model="item.customizations" @finish="finish")
		
		.mt-3.mb-3
			small: a.btn.btn-sm.btn-outline-info(@click="removeItem" v-if="items.length > 1") Delete this item
		//.mt-3.mb-3
			small: a.btn.btn-sm.btn-outline-info(@click="$root.view = 's2'") Save changes
</template>

<script>
	import GbbQuestionSet from '../components/question-set.vue';
	import {filterPrice}  from '../../js/util';
	
	export default {
		components: {
			GbbQuestionSet
		},
		props: {
			item: {
				type:     Object,
				required: true
			}
		},
		computed: {
			customizationQuestions() {
				return this.$root.customizationQuestions;
			},
			items() {
				return this.$root.items;
			},
			price() {
				return this.productsInfo[this.item.product.productId]?.prices[`${this.item.product.color}-${this.item.product.size}`];
			},
			productsInfo() {
				return this.$root.productsInfo;
			}
		},
		filters: {
			price: filterPrice
		},
		methods: {
			finish() {
				this.$emit('done');
			},
			removeItem() {
				const index = this.items.indexOf(this.item);
				this.items.splice(index, 1);
				this.finish();
			}
		},
		watch: {
			'item.product.productId': function () {
				this.item.product.color = this.productsInfo[this.item.product.productId].colors[0].name;
				this.item.product.size  = this.productsInfo[this.item.product.productId].sizes[0];
			}
		}
	};
</script>
