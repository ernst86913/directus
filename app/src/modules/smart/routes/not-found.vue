<template>
	<smart-view :title="$t('page_not_found')">
		<template #navigation>
			<files-navigation />
		</template>

		<div class="not-found">
			<v-info :title="$t('page_not_found')" icon="not_interested">
				{{ $t('page_not_found_body') }}
			</v-info>
		</div>
	</smart-view>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import FilesNavigation from '../components/navigation.vue';

export default defineComponent({
	components: { FilesNavigation },
});
</script>

<style lang="scss" scoped>
.not-found {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 20vh 0;
}
</style>
