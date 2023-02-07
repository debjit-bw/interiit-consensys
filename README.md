# TradeX

Price alerts for your tokens.

## Getting Started

Clone the repository and setup the development environment:

```shell
yarn install && yarn start
```

### Testing and Linting

Run `yarn test` to run the tests once.

Run `yarn lint` to run the linter, or run `yarn lint:fix` to run the linter and fix any automatically fixable issues.

<br>

# What's the big thing?

The daily grind of going to your exchange's website and searching through to find the prices of your tokens. Waiting endlessly, till they pump up to your go-to. We've all been there.

That's why we brought it right into your wallet. Now you can ask your wallet to notify you when, say, the price of ETH you get for your USDT goes up by 20%.

In this volatile market, it should be no one's task to wait when the price hits the target. Rather we notify you when it does, while you can get back to life.

Here's [a demo](https://drive.google.com/file/d/1Xok0xADtXjTIiuM8689nQ7GYqV0oInTK/view?usp=share_link).

## Notes

- Babel is used for transpiling TypeScript to JavaScript, so when building with the CLI,
  `transpilationMode` must be set to `localOnly` (default) or `localAndDeps`.
- For the global `wallet` type to work, you have to add the following to your `tsconfig.json`:
  ```json
  {
    "files": ["./node_modules/@metamask/snap-types/global.d.ts"]
  }
  ```
