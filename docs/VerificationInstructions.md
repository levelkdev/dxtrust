# Verification Instructions

## Application

To calculate the same ipfs hash used for the application deployed you will need: The git commit of the codebase to be used, the ENV variables that were used for build.
Once you have your ENV variables set, you can checkout to the specified commit by using `git checkout COMMIT_HASH`, then you should delete the `node_modules` and `build` folders, run `yarn` to have fresh dependencies installed and at last run `yarn run build` to generate a clean build.
Now with the build at your disposal you can calculate the hash of the folder by running `ipfs add -r -n build`.

For example with the git commit:
```

```
And ONLY this ENV varibales enabled:
```
REACT_APP_GIT_SHA=
REACT_APP_VERSION=0.1.0
NODE_ENV=production
```

The build hash ipfs of the entire build folder will be ``
