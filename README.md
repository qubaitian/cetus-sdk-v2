# cetus-ts-sdk

Cetus TypeScript SDK is a comprehensive collection of TypeScript libraries for interacting with various Cetus protocol features. This monorepo contains multiple SDK packages, each focusing on specific functionality within the Cetus ecosystem.

## SDK Modules

| Module                                                                                     | Version | Description                             | Documentation                               |
| ------------------------------------------------------------------------------------------ | ------- | --------------------------------------- | ------------------------------------------- |
| [@cetusprotocol/sui-clmm-sdk](https://www.npmjs.com/package/@cetusprotocol/sui-clmm-sdk)   | 5.3.4   | Concentrated Liquidity Market Maker SDK | [View Docs](./packages/clmm/README.md)      |
| [@cetusprotocol/vaults-sdk](https://www.npmjs.com/package/@cetusprotocol/vaults-sdk)       | 0.0.1   | Vaults Management SDK                   | [View Docs](./packages/vaults/README.md)    |
| [@cetusprotocol/launchpad-sdk](https://www.npmjs.com/package/@cetusprotocol/launchpad-sdk) | 0.0.1   | Launchpad and Token Launch SDK          | [View Docs](./packages/launchpad/README.md) |
| [@cetusprotocol/farms-sdk](https://www.npmjs.com/package/@cetusprotocol/farms-sdk)         | 0.0.1   | Farming and Yield Generation SDK        | [View Docs](./packages/farms/README.md)     |
| [@cetusprotocol/xcetus-sdk](https://www.npmjs.com/package/@cetusprotocol/xcetus-sdk)       | 0.0.1   | XCETUS Token Operations SDK             | [View Docs](./packages/xcetus/README.md)    |
| [@cetusprotocol/limit-sdk](https://www.npmjs.com/package/@cetusprotocol/limit-sdk)         | 0.0.1   | Limit Order Operations SDK              | [View Docs](./packages/limit/README.md)     |
| [@cetusprotocol/burn-sdk](https://www.npmjs.com/package/@cetusprotocol/burn-sdk)           | 0.0.1   | Token Burning Operations SDK            | [View Docs](./packages/burn/README.md)      |
| [@cetusprotocol/dca-sdk](https://www.npmjs.com/package/@cetusprotocol/dca-sdk)             | 0.0.1   | Dollar Cost Averaging SDK               | [View Docs](./packages/dca/README.md)       |
| [@cetusprotocol/zap-sdk](https://www.npmjs.com/package/@cetusprotocol/zap-sdk)             | 0.0.1   | Zap Operations SDK                      | [View Docs](./packages/zap/README.md)       |
| [@cetusprotocol/common-sdk](https://www.npmjs.com/package/@cetusprotocol/common-sdk)       | 0.0.1   | Common Utilities and Shared Components  | [View Docs](./packages/common/README.md)    |

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
