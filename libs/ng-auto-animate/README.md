# ng-auto-animate

An Angular Directive for FormKit's [`auto-animate`](https://auto-animate.formkit.com) library.

**Demo** → [https://ng-auto-animate.netlify.app/](https://ng-auto-animate.netlify.app/)

<a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT License"/></a>
<a href="https://www.npmjs.com/package/ng-auto-animate" title="View this project on NPM"><img src="https://img.shields.io/npm/v/ng-auto-animate" alt="NPM version" /></a>
<a href="https://www.npmjs.com/package/ng-auto-animate" title="View this project on NPM"><img src="https://img.shields.io/npm/dm/ng-auto-animate" alt="NPM downloads" /></a>

## Highlights

- ✅ Standalone Directive, for Angular v17 and above.
- ✅ Zoneless & signals-first. RxJS is not required.
- ✅ Custom `InjectionToken` for configuring global settings and plugins.
- ✅ SSR-safe, running only after the view is initialized on the client-side.

<!--

Some lore for folks lurking in the code:

## Why a separate wrapper library?

TLDR; Issues with setting up builds in original repo.

A publishable library for Angular needs [`ng-packagr`](https://github.com/ng-packagr/ng-packagr) and Angular CLI for proper scaffolding and formatting. Migrating the repository structure for `auto-animate` is a non-trivial task and would need an unbiased build system like [Nx](https://nx.dev) (which I am using here) or some other similar tool.

[Justin Schroeder](https://github.com/justin-schroeder), the creator of [`auto-animate`](https://auto-animate.formkit.com), has been supportive towards [contributions](https://github.com/formkit/auto-animate/pull/38) for Angular integration, but he [does not work with Angular](https://github.com/formkit/auto-animate/issues/72#issuecomment-1222732238) and is unable to work towards this actively. I, too, would not be able to do much in his shoes, especially when it requires replacing all build actions, scripts, and the project structure, all to support a single framework.

If there is a simpler solution, I would be willing to submit a PR with my changes here to the original project, especially the support for global options/plugin via an `InjectionToken`.

-->

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
import { NgAutoAnimate } from 'ng-auto-animate';
```

### Variants

1. **Default usage.** This uses the default values configured by `@formkit/auto-animate`.

   ```angular
   <article auto-animate>
     @if (shouldShow()) {
       <p>Conditionally shown element</p>
     }
   </article>
   ```

1. **Pass one-off options.** Inline options will completely replace and override the default options.

   ```angular
   <article [auto-animate]="{ duration: 750 }">
     @if (shouldShow()) {
       <p>{{ paragraph }}</p>
     }
   </article>
   ```

1. **Global options.** The ideal place to configure standard settings across your app. The supported values are `Partial<AutoAnimateOptions> | AutoAnimationPlugin`

   ```ts
   // src/app/app.config.ts
   import { ApplicationConfig } from '@angular/core';
   import { provideAutoAnimateConfig } from 'ng-auto-animate';
   import type {
     AutoAnimateOptions, // Standard options like easing, duration, etc.
     AutoAnimationPlugin, // Custom plugins
   } from '@formkit/auto-animate';

   export const appConfig: ApplicationConfig = {
     providers: [
       provideAutoAnimateConfig({ duration: 1000, easing: 'ease-out' }),
     ],
   };

   // main.ts
   import { bootstrapApplication } from '@angular/platform-browser';
   import { appConfig } from './app/app.config';
   import { App } from './app/app';

   bootstrapApplication(App, appConfig).catch(err => console.error(err));
   ```

   ```angular
   <article auto-animate>
     <!-- Default usage -->
     @for (paragraph of paragraphs; track paragraph) {
       <p>{{ paragraph }}</p>
     }
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

1. **Disable animations.** `prefers-reduced-motion` is already respected. Additionally, we can explicitly disable animations like this:

   ```angular
   <article
     [auto-animate]="{ duration: 750 }"
     [disableAutoAnimate]="shouldDisableAnimations()"
   >
     @if (shouldShow()) {
       <p>{{ paragraph }}</p>
     }
   </article>
   ```

## Missing support for something?

Go through existing issues if your problem is tracked; if not, please [raise a new issue!](https://github.com/ajitzero/ng-auto-animate/issues/new/choose)

## Support us

Is AutoAnimate saving you time?

Please consider [supporting us with a recurring or one-time donation](https://github.com/sponsors/ajitzero)! 🙏

## License

[MIT](https://github.com/ajitzero/ng-auto-animate/blob/main/LICENSE).

Built by [Ajit Panigrahi](https://github.com/ajitzero). Original library by [Justin Schroeder](https://github.com/justin-schroeder) and many contributors.
