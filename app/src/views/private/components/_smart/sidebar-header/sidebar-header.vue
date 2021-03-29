<template>
	<div class="sidebar-header">
		<div v-show="sidebarOpen" class="close" @click="sidebarOpen = false">
			<v-icon class="large" name="chevron_right" />
		</div>
		<div class="spacer" />
		<module-bar-avatar />
	</div>
</template>

<script lang="ts">
import { defineComponent, toRefs } from '@vue/composition-api';
import { useAppStore } from '@/stores';
import ModuleBarAvatar from '../../module-bar-avatar/';

export default defineComponent({
	components: {
		ModuleBarAvatar,
	},
	setup() {
		const appStore = useAppStore();
		const { sidebarOpen } = toRefs(appStore.state);
		return { sidebarOpen };
	},
});
</script>

<style lang="scss" scoped>
.sidebar.is-open .sidebar-header {
	.spacer {
		flex: 1;
	}
	.module-bar-avatar {
		flex: 0;
		position: absolute;
		right: 0;
		top: 0;
	}
}
.sidebar-header {
	width: 100%;
	height: var(--header-bar-height);
    background-color: var(--module-background);
	position: relative;
	display: flex;
	align-items: center;
	padding: 0;
	color: var(--foreground-subdued);
	text-align: left;

	.close {
		z-index: 50;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 50px;
		height: var(--header-bar-height);
		color: var(--foreground-subdued);;
		--sidebar-detail-color-active: var(--white);
		cursor: pointer;
		transition: opacity var(--fast) var(--transition), color var(--fast) var(--transition);

		.v-icon {
			pointer-events: none;
		}

		&:hover {
			color: var(--sidebar-detail-color-active);
		}
	}
	.close::after {
		position: absolute;
		left: -1px;
		top: 8px;
		bottom: 8px;
		width: 3px;
		background-color: var(--module-icon);
		opacity: 0.25;
		content: "";
	}

	.spacer {
		flex: 0;
	}

	.module-bar-avatar {
		flex: 1;
		height: var(--header-bar-height);
		min-width: 64px;
		z-index: 100;
	}
}
</style>
