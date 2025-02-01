# Better-Auth with Svelte 5

> NOTE!! theres no email/password auth guide, I simply don't use it but I might add it in the future.

## What Tech I used in this demo

- pnpm
- Svelte 5
- Drizzle ORM
- Libsql
- tailwindcss
- better-auth

## Guide

### 1. Create OAUTH app with the providers of your choice.

### 2. Set the OAUTH callback/redirect URL to

http://localhost:5173/api/auth/callback/{yourpovider} <br>
e.g: http://localhost:5173/api/auth/callback/google

> NOTE!! This is the default better-auth callback, do this step if you want to avoid configuring better-auth to use a different callback

### 3. create auth.ts in src/lib and copy those contents:

```ts
// src/lib/auth.ts
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';

import { db } from '$lib/server/db';

export const auth = betterAuth({
	account: {
		accountLinking: {
			enabled: true,
			trustedProviders: ['google']
		}
	},

	database: drizzleAdapter(db, {
		provider: 'sqlite'
	}),

	// You can add any other providers you want
	socialProviders: {
		google: {
			clientId: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET
		}
		// github: {
		// 	clientId: GITHUB_CLIENT_ID,
		// 	clientSecret: GITHUB_CLIENT_SECRET
		// }
	}
});
```

### 4. Create hooks.server.ts if you don't already have it and mount the handler:

```ts
//hooks.server.ts
import { auth } from '$lib/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';

export async function handle({ event, resolve }) {
	return svelteKitHandler({ event, resolve, auth });
}
```

### 5. Create auth-client.ts in src/lib, and put this in it to interact with the client:

```ts
import { createAuthClient } from 'better-auth/svelte';
export const authClient = createAuthClient({
	baseURL: 'http://localhost:5173' // the base url of your auth server
});
```

### 6. Prepare to Generate the schema:

in auth.ts replace the $lib with the absolute paths and comment every thing except the database

```ts
// src/lib/auth.ts
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

// import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';

import { db } from '../lib/server/db';

export const auth = betterAuth({
	// account: {
	// 	accountLinking: {
	// 		enabled: true,
	// 		trustedProviders: ['google']
	// 	}
	// },

	database: drizzleAdapter(db, {
		provider: 'sqlite'
	})

	// socialProviders: {
	// 	google: {
	// 		clientId: GOOGLE_CLIENT_ID,
	// 		clientSecret: GOOGLE_CLIENT_SECRET
	// 	}
	// }
});
```

### 7. Generate schema

> pnpx dlx @better-auth/cli generate

This will hopefully generate the schema without any problems.

### 8. Import the schema and undo the absolute paths and uncomment lines

```ts
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';

import { db } from '$lib/server/db';

import * as schema from '$lib/server/db/schema'; //Import the schema here

export const auth = betterAuth({
	account: {
		accountLinking: {
			enabled: true,
			trustedProviders: ['google']
		}
	},

	database: drizzleAdapter(db, {
		provider: 'sqlite',

		// Add it here
		schema: {
			...schema // <------------------
		}
	}),

	socialProviders: {
		google: {
			clientId: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET
		}
	}
});
```

### 9. Use in the client

> NOTE!! better-auth default callback is NOT "/" so you have to explicitly specify it. "callbackURL: '/'"

```ts
<script lang="ts">
	import { authClient } from '$lib/auth-client';
</script>
<button
	class="flex items-center gap-8 rounded-xl bg-blue-800 px-4 py-2 font-bold text-white hover:bg-blue-700"
	onclick={async () => {
            await authClient.signIn.social({
                provider: 'google',
                callbackURL: '/' <-----------------
            });
        }
    }
>
	Sign in
</button>
```

i like to create auth route to handle auth and add +page.server.ts into the root route to redirect the user to /auth if they are not authenticated.

See +page.server.ts, its very simple.

Signing Out is the same just use goto to navigate. See +page.svelte
