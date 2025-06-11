# cetus-ts-sdk

Cetus TypeScript SDK is a comprehensive collection of TypeScript libraries for interacting with various Cetus protocol features. This monorepo contains multiple SDK packages, each focusing on specific functionality within the Cetus ecosystem.

## SDK Modules

| Module                                                                                   | Description                             | Documentation                            |
| ---------------------------------------------------------------------------------------- | --------------------------------------- | ---------------------------------------- |
| [@cetusprotocol/sui-clmm-sdk](https://www.npmjs.com/package/@cetusprotocol/sui-clmm-sdk) | Concentrated Liquidity Market Maker SDK | [View Docs](./packages/clmm/README.md)   |
| [@cetusprotocol/vaults-sdk](https://www.npmjs.com/package/@cetusprotocol/vaults-sdk)     | Vaults Management SDK                   | [View Docs](./packages/vaults/README.md) |
| [@cetusprotocol/farms-sdk](https://www.npmjs.com/package/@cetusprotocol/farms-sdk)       | Farming and Yield Generation SDK        | [View Docs](./packages/farms/README.md)  |
| [@cetusprotocol/xcetus-sdk](https://www.npmjs.com/package/@cetusprotocol/xcetus-sdk)     | XCETUS Token Operations SDK             | [View Docs](./packages/xcetus/README.md) |
| [@cetusprotocol/limit-sdk](https://www.npmjs.com/package/@cetusprotocol/limit-sdk)       | Limit Order Operations SDK              | [View Docs](./packages/limit/README.md)  |
| [@cetusprotocol/burn-sdk](https://www.npmjs.com/package/@cetusprotocol/burn-sdk)         | Token Burning Operations SDK            | [View Docs](./packages/burn/README.md)   |
| [@cetusprotocol/dca-sdk](https://www.npmjs.com/package/@cetusprotocol/dca-sdk)           | Dollar Cost Averaging SDK               | [View Docs](./packages/dca/README.md)    |
| [@cetusprotocol/common-sdk](https://www.npmjs.com/package/@cetusprotocol/common-sdk)     | Common Utilities and Shared Components  | [View Docs](./packages/common/README.md) |

## Getting Started

Each SDK module can be installed individually using npm or yarn. For example:

```bash
npm install @cetusprotocol/sui-clmm-sdk
```

## Development

This is a monorepo managed by pnpm. To get started with development:

1. Install dependencies:

```bash
pnpm install
```

2. Build all packages:

```bash
pnpm build
```

3. Run tests:

```bash
pnpm test
```

## License

MIT
