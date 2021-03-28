<template>
	<div class="module-nav-header">
		<span class="name">{{ moduleTitle }}</span>
	</div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
	props: {
		moduleTitle: {
			type: String,
			default: null,
		},
	}
});
</script>

<style lang="scss" scoped>
.module-nav-header {
	position: relative;
	display: flex;
	align-items: center;
	width: 100%;
	height: 64px;
	padding: 0 20px;
	color: var(--foreground-normal-alt);
	text-align: left;
	background-color: var(--background-normal-alt);

	.name {
		flex-grow: 1;
		margin-left: 12px;
	}
}
</style>
