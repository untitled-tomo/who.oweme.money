# WhoOweMeMoney
A web-based bill splitting application for restaurant outings with friends. The app should guide users through the following process:

1. Enter the number of people in the group
2. Input each person's name
3. Add menu items with their costs and select who's splitting each item
4. Specify who paid the bill
5. Generate a detailed breakdown showing each person's share of the bill

## Features

- **Bill Splitting**: Split bills among friends with customizable tax rates
- **Dark & Light Modes**: Toggle between dark and light theme based on your preference
- **ShareCard**: Generate and share beautiful bill summary images with friends

UI/Style:
- Playful, food-inspired color palette with appetizing imagery
- Intuitive, step-by-step interface mimicking a digital menu board
- Animated transitions between steps to keep the experience light and engaging
### Todo 
- [ ] Integrate [dicebear](https://www.dicebear.com/introduction/)

# Installation

```
git clone https://github.com/yourusername/who-oweme-money.git
cd who-oweme-money
pnpm install
```

## Required Dependencies

For the ShareCard image generation feature, you need to install:

```
pnpm add html2canvas file-saver @types/file-saver
```

### Commands

```sh
pnpm dev             # start development server
pnpm start           # start development server
pnpm validate        # run test,lint,build,typecheck concurrently
pnpm test            # run jest
pnpm lint            # run eslint
pnpm lint:fix        # run eslint with --fix option
pnpm typecheck       # run TypeScript compiler check
pnpm build           # build production bundle to 'dist' directly
pnpm prettier        # run prettier for json|yml|css|md|mdx files
pnpm clean           # remove 'node_modules' 'yarn.lock' 'dist' completely
pnpm serve           # launch server for production bundle in local
```

# Background

https://x.com/5warag/status/1878909434640105977

# License

MIT

## Contributors ✨

!
