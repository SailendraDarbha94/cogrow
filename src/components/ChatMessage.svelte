<script lang="ts">
	//import type { ChatCompletionRequestMessageRoleEnum } from 'openai';
	import bubble from "$lib/assets/secure_ai.png"
	import user from "$lib/assets/vegeta.png"
	export let message: string | undefined;
	export let type: string = "chatbot";
</script>

<div class={type}>
	<div class="">
		<div class="">
			<img
				src={type === "chatbot" ? bubble : user}
				alt="avatar"
				class="h-10 w-10 rounded-md"
			/>
		</div>
	</div>
	<div class="">
		{message}
	</div>
</div>

<style lang="postcss">
	.user {
		display: flex;
		flex-direction: column;
		width: 100%;
		align-items: flex-end;
	}

	.chatbot {
		display: flex;
		width: 100%;
		flex-direction: column;
		justify-content: left;
	}
</style>
