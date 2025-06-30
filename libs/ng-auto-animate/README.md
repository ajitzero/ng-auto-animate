# ng-auto-animate

An Angular Directive to use FormKit's [`auto-animate`](https://auto-animate.formkit.com) library within Angular projects.

## Highlights

- ✅ Standalone Directive, for Angular v17 and above. Tested on Node 20.x, but should work on previous versions.
- ✅ Custom `InjectionToken` for configuring global settings and plugins.
- ✅ Works in SSR-based apps, after the view is initialized on the client-side.

## Why a new wrapper library?

A publishable library for Angular needs [`ng-packagr`](https://github.com/ng-packagr/ng-packagr) and Angular CLI for proper scaffolding and finalized formatting. Migrating the repository structure for `auto-animate` is a non-trivial task and would need an unbiased build system like [Nx](https://nx.dev) (which I am using here) or some other similar tool.

[Justin Schroeder](https://github.com/justin-schroeder), the creator of [`auto-animate`](https://auto-animate.formkit.com), has been supportive towards [contributions](https://github.com/formkit/auto-animate/pull/38) for Angular integration, but he [does not work with Angular](https://github.com/formkit/auto-animate/issues/72#issuecomment-1222732238) and is unable to work towards this actively. I, too, would not be able to do much in his shoes, especially when it requires replacing all build actions, scripts, and the project structure, all to support a single framework.

If there is a simpler solution, I would be willing to submit a PR with my changes here to the original project, especially the support for global options/plugin via an `InjectionToken`.

## Installation

Install this package and its peer dependency with the package manager of your choice.

   ```bash
   npm i ng-auto-animate @formkit/auto-animate
   ```
   ```bash
   pnpm i ng-auto-animate @formkit/auto-animate
   ```
   ```bash
   bun add ng-auto-animate @formkit/auto-animate
   ```
   ```bash
   yarn add ng-auto-animate @formkit/auto-animate
   ```

## Usage

### Principle

Add the directive to the parent tag, within which DOM elements are being dynamically shown or hidden.

Applying the directive to the same tag being hidden will have no effect, as it only detects changes in child nodes.

### Import Path

Import and add the directive to your module or standalone component's imports array.

```ts
import { NgAutoAnimateDirective } from 'ng-auto-animate';
```

### Variants

1. **Default usage.** This uses the default values configured by `@formkit/auto-animate`.

   ```html
   <article auto-animate>
   	<p *ngFor="let paragraph of paragraphs">{{ paragraph }}</p>
   </article>
   ```

1. **Pass one-off options.** Inline options will completely replace and override the default options.

   ```html
   <article [auto-animate]="{ duration: 750 }">
   	<p *ngFor="let paragraph of paragraphs">{{ paragraph }}</p>
   </article>
   ```

1. **Global options.** The ideal place to configure standard settings across your app.

   ```ts
   // src/app/app.config.ts
   import { ApplicationConfig } from '@angular/core';
   import { GLOBAL_AUTO_ANIMATE_OPTIONS } from 'ng-auto-animate';

   export const appConfig: ApplicationConfig = {
   	providers: [
   		{
   			provide: GLOBAL_AUTO_ANIMATE_OPTIONS,
   			useValue: {
   				duration: 750,
   				easing: 'ease-out',
   				// etc.
   			},
   		},
   		// other providers
   	],
   };

   // main.ts
   import { bootstrapApplication } from '@angular/platform-browser';
   import { appConfig } from './app/app.config';
   import { AppComponent } from './app/app.component';

   bootstrapApplication(AppComponent, appConfig).catch(err =>
   	console.error(err),
   );
   ```

   ```html
   <article auto-animate>
   	<!-- Default usage -->
   	<p *ngFor="let paragraph of paragraphs">{{ paragraph }}</p>
   </article>
   ```

1. **Custom plugins.** Same support as `@formkit/auto-animate`.

   > See the example here in the [demo app](https://github.com/ajitzero/ng-auto-animate/blob/0f305d97a9a30ab715b1c41304572519f0d27894/apps/demo/src/app/app.component.ts#L68) for a "bouncy" effect.

   ```ts
   customPlugin: AutoAnimationPlugin = (...) => {...};
   ```

   ```html
   <article [auto-animate]="customPlugin">...</article>
   ```

## Missing support for something?

Go through existing issues if your problem is tracked; if not, please [raise a new issue!](https://github.com/ajitzero/ng-auto-animate/issues/new/choose)

## License

[MIT](https://github.com/ajitzero/ng-auto-animate/blob/main/LICENSE).

Built by [Ajit Panigrahi](https://github.com/ajitzero). Original library by [Justin Schroeder](https://github.com/justin-schroeder) and many contributors.

---

This library was generated with [Nx](https://nx.dev).
