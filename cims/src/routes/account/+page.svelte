<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	let { data, form } = $props()
	let { session, supabase, profile, users} = $derived(data)
	let profileForm: HTMLFormElement
	let loading = $state(false)
	let fullName: string = $derived(profile?.full_name)
	let username: string = $derived(profile?.username)
	let access_level: string = $derived(profile?.access_level)

	let isEditing: boolean = $state(false)

	let access_levels = ["Workflow Manager", "Contract Manager", "Contract Viewer"];

	const handleSubmit: SubmitFunction = () => {
		loading = true
		return async () => {
			loading = false
		}
	}
	const handleSignOut: SubmitFunction = () => {
		loading = true
		return async ({ update }) => {
			loading = false
			update()
		}
	}
</script>
<div class="form-widget">
	<div>
		<h1>Welcome back, {username}</h1>
	</div>

	<div> 
		<h3>Here are your account details:</h3>
	</div>

	<form
		class="form-widget"
		method="post"
		action="?/update"
		use:enhance={handleSubmit}
		bind:this={profileForm}
	>
		<div>
			<label for="isEditing">Edit Account Details</label>
			<input type="checkbox" id="isEditing" name="isEditing" bind:checked={isEditing} />
		</div>
		<div>
			<label for="email">Email</label>
			<input id="email" type="text" value={session.user.email} disabled />
		</div>
		<div>
			<label for="access_level">Access Level</label>
			<input id="access_level" name="access_level" type="text" value={form?.access_level ?? access_level} disabled={access_level !== "Workflow Manager" || !isEditing} />
		</div>
		<div>
			<label for="fullName">Full Name</label>
			<input id="fullName" name="fullName" type="text" value={form?.fullName ?? fullName} disabled={!isEditing} />
		</div>
		<div>
			<label for="username">Username</label>
			<input id="username" name="username" type="text" value={form?.username ?? username} disabled={!isEditing} />
		</div>
		<div>
			<input
				type="submit"
				value={loading ? 'Loading...' : 'Update'}
				disabled={loading}
			/>
		</div>
	</form>
	<form method="post" action="?/signout" use:enhance={handleSignOut}>
		<div>
			<button class="button block" disabled={loading}>Sign Out</button>
		</div>
	</form>

	{#if access_level === "Workflow Manager"}
		<div>
			<h1>List of Registered Users:</h1>
			<table>
				<thead>
					<tr>
						<th>Full Name</th>
						<th>Username</th>
						<th>Access Level</th>
					</tr>
				</thead>
				<tbody>
					{#each users as user}
						<tr>
							<td>{user.full_name}</td>
							<td>{user.username}</td>
							<td>
								<form
									class="form-widget"
									method="post"
									action="?/update_access_level"
									use:enhance={handleSubmit}
								>
									<input type="hidden" name="id" value={user.id} />
									<select name="access_level" bind:value={user.access_level}>
										{#each access_levels as level}
											<option value={level}>{level}</option>
										{/each}
									</select>
										<input
											type="submit"
											value={loading ? 'Updating...' : 'Update'}
											disabled={loading}
										/>
								</form>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

<style>
	table {
		table-layout: fixed;
		width: 90%;
		margin: 10px auto;
		border-collapse: collapse;
		border-top: 1px solid #999999;
		border-bottom: 1px solid #999999;
	}

	th,
	td {
		vertical-align: top;
		padding: 0.3em;
	}

	tbody tr:nth-child(odd) {
		background-color: #eeeeee;
	}
</style>
