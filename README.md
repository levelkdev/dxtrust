# Landing-Page

This is the **Landing page** of the [DXdao](https://dxdao.daostack.io/).

## Technical Description

The Landing-Page is written in javascript and typescrypt, it uses ReactJS and Webapack.

## Install
Install dependencies with the following command:
```
yarn
```
    
## Test
No front-end tests at the moment. (Jest is included for testing React components), run tests with the following command:
```
yarn test
```

## Formatting and Linting
- Husky will automatically format files, using prettier + tslist, before git commits.
- Manually execute formatting on staged files with ```yarn lint-staged```
- Formatting tools can be installed for many editors for issue highlighting and features such as format on save
    - [Prettier](https://prettier.io/docs/en/editors.html)
    - [Tslint / Eslint](https://eslint.org/docs/user-guide/integrations)

### Local Development

 - Execute `yarn dev` , this will start the site in http//:localhost:3000
    
## Deployment

To make the build of the dapp use the command `yarn run build`. It will create production build that can be hosted anywhere. We host and support the builds in IPFS and Swarm networks.

### IPFS

Follow the installation instructions here https://docs-beta.ipfs.io/how-to/command-line-quick-start/#install-ipfs.

Executables for ipfs-update can be downloaded from https://dist.ipfs.io/#ipfs-update.

The build can be upload to ipfs with the following command:
```
ipfs add -r build
```
